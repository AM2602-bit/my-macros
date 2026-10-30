# Uploads the app to the web host over FTPS (FTP with TLS).
#
# First run:  powershell -ExecutionPolicy Bypass -File deploy.ps1
#   - creates deploy.config.json to fill in (host, username, remote folder)
#   - asks for the FTP password and offers to save it encrypted for your
#     Windows account only (deploy.secret)
# Both files are git-ignored. Options: -DryRun lists what would be uploaded.
param([switch]$DryRun)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$configPath = Join-Path $root 'deploy.config.json'
$secretPath = Join-Path $root 'deploy.secret'

# Only these are published; dev files (README, serve.ps1, .git, ...) stay local.
$include = @('index.html', 'manifest.webmanifest', 'sw.js', '.htaccess', 'css', 'js', 'icons')

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
  $req.KeepAlive = $true
  return $req
}

function Ensure-FtpDir([string]$url) {
  try { (New-FtpRequest $url ([System.Net.WebRequestMethods+Ftp]::MakeDirectory)).GetResponse().Close() }
  catch { } # already exists
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
  $req = New-FtpRequest "$base/$rel" ([System.Net.WebRequestMethods+Ftp]::UploadFile)
  $bytes = [IO.File]::ReadAllBytes($f.FullName)
  $req.ContentLength = $bytes.Length
  $stream = $req.GetRequestStream()
  $stream.Write($bytes, 0, $bytes.Length)
  $stream.Close()
  $req.GetResponse().Close()
  Write-Host "  uploaded $rel"
}
Write-Host 'Done.'
