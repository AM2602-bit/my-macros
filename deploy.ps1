# Publishes the app to the web host. Two methods, set by "method" in deploy.config.json:
#
#   cpanel-git (recommended): cPanel pulls the pushed GitHub commit and copies the
#     files per .cpanel.yml, all over HTTPS. One-time setup: create the repo in
#     cPanel -> Git Version Control, create an API token, then run
#       powershell -ExecutionPolicy Bypass -File deploy.ps1 -SetupCpanel
#     to save the token encrypted for your Windows account (deploy.cpanel.secret).
#
#   ftp: uploads over FTPS (FTP with TLS). First run creates deploy.config.json and
#     asks for the FTP password, saved encrypted (deploy.secret).
#
# Config and secrets are git-ignored. -DryRun shows what would be deployed.
param([switch]$DryRun, [switch]$SetupCpanel)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$configPath = Join-Path $root 'deploy.config.json'
$secretPath = Join-Path $root 'deploy.secret'

# Only these are published; dev files (README, serve.ps1, .git, ...) stay local.
$include = @('index.html', 'manifest.webmanifest', 'sw.js', '.htaccess', 'css', 'js', 'icons', 'admin')

if (-not (Test-Path $configPath)) {
  [ordered]@{
    host      = 'ftp.nvsolutions.net'
    username  = ''
    remoteDir = '/mymac-ro.nvsolutions.net'
    secure    = $true
  } | ConvertTo-Json | Set-Content -Encoding utf8 $configPath
  Write-Host "Created deploy.config.json. Fill in your FTP username and the subdomain's folder, then run this again."
  exit 1
}
$cfg = Get-Content $configPath -Raw | ConvertFrom-Json

# ---------- cPanel Git deploy (HTTPS) ----------
$tokenPath = Join-Path $root 'deploy.cpanel.secret'
if ($SetupCpanel) {
  foreach ($k in 'cpanelHost', 'cpanelUser', 'repoPath', 'branch', 'siteUrl') {
    if (-not $cfg.$k) { throw "Set ""$k"" in deploy.config.json first." }
  }
  Read-Host "cPanel API token for $($cfg.cpanelUser)" -AsSecureString | ConvertFrom-SecureString | Set-Content $tokenPath
  $cfg | Add-Member -Force -NotePropertyName method -NotePropertyValue 'cpanel-git'
  $cfg | ConvertTo-Json | Set-Content -Encoding utf8 $configPath
  Write-Host 'Token saved (encrypted) and deploy method set to cpanel-git.'
  exit 0
}

if ($cfg.method -eq 'cpanel-git') {
  if (-not (Test-Path $tokenPath)) { throw 'No cPanel API token saved. Run: deploy.ps1 -SetupCpanel' }
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  $tok = Get-Content $tokenPath | ConvertTo-SecureString
  $plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($tok))
  $headers = @{ Authorization = "cpanel $($cfg.cpanelUser):$plain" }

  # cPanel deploys what's on GitHub, so local work must be committed and pushed.
  git -C $root fetch -q origin
  $ahead = (git -C $root rev-list --count "origin/$($cfg.branch)..HEAD").Trim()
  if ($ahead -ne '0') { throw "$ahead local commit(s) aren't on GitHub yet. Run: git push" }
  $dirty = git -C $root status --porcelain -- $include
  if ($dirty) { Write-Warning "Uncommitted changes won't be deployed:`n$($dirty -join "`n")" }
  $head = (git -C $root log -1 --format='%h %s').Trim()
  Write-Host "Deploying $head via cPanel Git"
  if ($DryRun) { exit 0 }

  function Invoke-Uapi([string]$module, [string]$fn, [hashtable]$params) {
    $q = ($params.GetEnumerator() | ForEach-Object { "$($_.Key)=$([uri]::EscapeDataString($_.Value))" }) -join '&'
    $r = Invoke-RestMethod "https://$($cfg.cpanelHost):2083/execute/$module/$fn`?$q" -Headers $headers -TimeoutSec 120
    if ($r.status -ne 1) { throw "$module/$fn failed: $(($r.errors) -join '; ')" }
    return $r.data
  }
  Write-Host '  pulling from GitHub into cPanel'
  Invoke-Uapi 'VersionControl' 'update' @{ repository_root = $cfg.repoPath; branch = $cfg.branch } | Out-Null
  Write-Host '  running .cpanel.yml deployment'
  $d = Invoke-Uapi 'VersionControlDeployment' 'create' @{ repository_root = $cfg.repoPath }

  # Confirm the live sw.js matches ours (it changes with every release).
  $want = [IO.File]::ReadAllText((Join-Path $root 'sw.js'))
  for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Seconds 3
    try { $live = (Invoke-WebRequest "$($cfg.siteUrl.TrimEnd('/'))/sw.js?v=$(Get-Random)" -UseBasicParsing -TimeoutSec 15).Content } catch { $live = '' }
    if ($live.Replace("`r", '') -eq $want.Replace("`r", '')) { Write-Host "Done. Live at $($cfg.siteUrl) (deploy $($d.deploy_id))."; exit 0 }
  }
  throw "Deployment $($d.deploy_id) was queued but the live site hasn't updated yet. Check cPanel -> Git Version Control -> Manage -> Pull or Deploy for the deploy log."
}

if (-not $cfg.username) { throw 'Set "username" in deploy.config.json.' }

# Password: env var, saved encrypted secret, or prompt.
if ($env:MM_FTP_PASSWORD) {
  $password = $env:MM_FTP_PASSWORD
} else {
  if (Test-Path $secretPath) {
    $secure = Get-Content $secretPath | ConvertTo-SecureString
  } else {
    $secure = Read-Host "FTP password for $($cfg.username)" -AsSecureString
    if ((Read-Host 'Save it encrypted for next time? (y/n)') -eq 'y') {
      $secure | ConvertFrom-SecureString | Set-Content $secretPath
    }
  }
  $password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
}
$cred = New-Object System.Net.NetworkCredential($cfg.username, $password)
$dir = $cfg.remoteDir.Trim('/')
$base = 'ftp://' + $cfg.host + $(if ($dir) { '/' + $dir } else { '' })

function New-FtpRequest([string]$url, [string]$method) {
  $req = [System.Net.FtpWebRequest]::Create($url)
  $req.Method = $method
  $req.Credentials = $cred
  $req.EnableSsl = [bool]$cfg.secure
  $req.UsePassive = $true
  $req.UseBinary = $true
  # A fresh connection per request: reusing one over TLS fails mid-upload on this host (451).
  $req.KeepAlive = $false
  return $req
}

function Ensure-FtpDir([string]$url) {
  try { (New-FtpRequest $url ([System.Net.WebRequestMethods+Ftp]::MakeDirectory)).GetResponse().Close() }
  catch { } # already exists
}

# cPanel writes its own sections into the server's .htaccess (e.g. PHP settings).
# Keep them when replacing the file with ours.
function Merge-CpanelBlocks([byte[]]$local) {
  $text = [Text.Encoding]::UTF8.GetString($local)
  try {
    $res = (New-FtpRequest "$base/.htaccess" ([System.Net.WebRequestMethods+Ftp]::DownloadFile)).GetResponse()
    $remote = (New-Object IO.StreamReader($res.GetResponseStream())).ReadToEnd()
    $res.Close()
  } catch { return $local } # no existing file
  $blocks = [regex]::Matches($remote, '(?ms)^# BEGIN cPanel-generated.*?^# END cPanel-generated[^\r\n]*') | ForEach-Object { $_.Value }
  if (-not $blocks) { return $local }
  return [Text.Encoding]::UTF8.GetBytes($text.TrimEnd() + "`n`n" + ($blocks -join "`n`n") + "`n")
}

$files = foreach ($item in $include) {
  $path = Join-Path $root $item
  if (Test-Path $path -PathType Container) { Get-ChildItem $path -Recurse -File }
  elseif (Test-Path $path) { Get-Item $path -Force }
}

Write-Host "Deploying $($files.Count) files to $base"
if ($DryRun) { $files | ForEach-Object { $_.FullName.Substring($root.Length + 1) }; exit 0 }

if ($dir) { Ensure-FtpDir $base }
$made = @{}
foreach ($f in $files) {
  $rel = $f.FullName.Substring($root.Length + 1).Replace('\', '/')
  $dir = Split-Path $rel -Parent
  if ($dir -and -not $made[$dir]) {
    $acc = ''
    foreach ($part in $dir.Replace('\', '/').Split('/')) {
      $acc = if ($acc) { "$acc/$part" } else { $part }
      if (-not $made[$acc]) { Ensure-FtpDir "$base/$acc"; $made[$acc] = $true }
    }
  }
  $bytes = [IO.File]::ReadAllBytes($f.FullName)
  if ($rel -eq '.htaccess') { $bytes = Merge-CpanelBlocks $bytes }
  # This host intermittently drops transfers (451), so retry a few times.
  for ($attempt = 1; ; $attempt++) {
    try {
      $req = New-FtpRequest "$base/$rel" ([System.Net.WebRequestMethods+Ftp]::UploadFile)
      $req.ContentLength = $bytes.Length
      $stream = $req.GetRequestStream()
      $stream.Write($bytes, 0, $bytes.Length)
      $stream.Close()
      $req.GetResponse().Close()
      break
    } catch {
      if ($attempt -ge 4) { throw }
      Write-Host "  retrying $rel ($($_.Exception.InnerException.Message))"
      Start-Sleep -Seconds (2 * $attempt)
    }
  }
  Write-Host "  uploaded $rel"
}
Write-Host 'Done.'
