// One-tap price capture: a bookmarklet the user taps on a Woolworths or Coles
// product page they have open. It reads the page in their own browser and opens
// the app with what it found, where they confirm before anything is saved.
(function () {
  const S = window.Shopping;
  const FOODS = window.FOODS;
  const MAX_PRICE = 1000;
  const STOP = new Set(['the', 'and', 'with', 'for', 'raw', 'fresh', 'frozen', 'pack', 'approx', 'woolworths', 'coles', 'free', 'range', 'large', 'small', 'bulk', 'value', 'approved', 'rspca']);

  // Runs inside the bookmarklet on the store's page, so it must be self-contained.
  // Tries structured data first, then falls back to the visible page text.
  function extract(d, l) {
    var h = l.hostname;
    var r = { store: /(^|\.)woolworths\.com\.au$/.test(h) ? 'woolworths' : /(^|\.)coles\.com\.au$/.test(h) ? 'coles' : '', name: '', price: null, was: null, url: l.href.split('?')[0] };
    function num(v) { var n = parseFloat(String(v).replace(/[^0-9.]/g, '')); return n > 0 ? n : null; }
    function isProduct(t) { return t === 'Product' || (Array.isArray(t) && t.indexOf('Product') >= 0); }
    function walk(o, depth) {
      if (!o || typeof o !== 'object' || depth > 12 || r.price) return;
      if (Array.isArray(o)) { o.forEach(function (x) { walk(x, depth + 1); }); return; }
      if (isProduct(o['@type']) && o.offers) {
        var of = Array.isArray(o.offers) ? o.offers[0] : o.offers;
        var p = num(of.price || of.lowPrice);
        if (p) { r.price = p; r.name = r.name || o.name || ''; return; }
      }
      if (o.pricing && typeof o.pricing === 'object' && num(o.pricing.now)) {
        r.price = num(o.pricing.now); r.was = num(o.pricing.was); r.name = r.name || o.name || ''; return;
      }
      if (o.Stockcode && num(o.Price)) {
        r.price = num(o.Price); r.was = num(o.WasPrice); r.name = r.name || o.Name || ''; return;
      }
      Object.keys(o).forEach(function (k) { walk(o[k], depth + 1); });
    }
    var sel = 'script[type="application/ld+json"],script#__NEXT_DATA__,script[type="application/json"]';
    Array.prototype.forEach.call(d.querySelectorAll(sel), function (s) {
      try { walk(JSON.parse(s.textContent), 0); } catch (e) {}
    });
    var main = d.querySelector('main') || d.body;
    var text = main ? (main.innerText || main.textContent || '') : '';
    if (!r.price) {
      var meta = d.querySelector('meta[property="product:price:amount"],[itemprop="price"]');
      if (meta) r.price = num(meta.getAttribute('content') || meta.textContent);
    }
    if (!r.price) {
      var m = text.match(/\$\s?(\d{1,3}\.\d{2})(?!\s*\/|\s*per\b|\d)/i);
      if (m && !/(was|save)\s*$/i.test(text.slice(Math.max(0, m.index - 6), m.index))) r.price = num(m[1]);
    }
    if (!r.was) {
      var w = text.match(/(?:^|[^a-z])was\s*\$\s?(\d{1,3}\.\d{2})/i);
      if (w) r.was = num(w[1]);
    }
    if (!r.name) {
      var t = d.querySelector('h1');
      r.name = t ? t.textContent.trim() : (d.title || '');
    }
    return r;
  }

  function bookmarklet(appUrl) {
    const body = 'var r=(' + extract.toString() + ')(document,location);' +
      'if(!r.store){alert("Open a Woolworths or Coles product page first, then tap this bookmark.");return;}' +
      'var u=' + JSON.stringify(appUrl) + '+"?capture="+encodeURIComponent(JSON.stringify(r));' +
      'if(!window.open(u,"_blank"))location.href=u;';
    return 'javascript:' + encodeURIComponent('(function(){' + body + '})()').replace(/'/g, '%27');
  }

  // The capture arrives in a URL anyone could craft, so treat it as untrusted.
  function parse(raw) {
    let o;
    try { o = JSON.parse(raw); } catch (e) { return null; }
    if (!o || !S.STORES.some((s) => s.key === o.store)) return null;
    const money = (v) => (typeof v === 'number' && v > 0 && v < MAX_PRICE ? Math.round(v * 100) / 100 : null);
    const price = money(o.price);
    const was = money(o.was);
    return {
      store: o.store,
      name: String(o.name || '').trim().slice(0, 120),
      price,
      special: !!(price && was && was > price),
      url: S.safeStoreUrl(o.store, o.url),
    };
  }

  const tokens = (s) => String(s).toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2 && !/^\d/.test(t) && !STOP.has(t));

  // Best-matching ingredient for a product name; foods on the list win ties.
  function guessFood(name, listFoods) {
    const wanted = new Set(tokens(name));
    let best = null;
    let bestScore = 0;
    Object.keys(FOODS).forEach((k) => {
      const have = new Set(tokens(FOODS[k].name + ' ' + S.PACKS[k].search));
      let score = 0;
      have.forEach((t) => { if (wanted.has(t)) score += 1; });
      if (score && listFoods.includes(k)) score += 0.5;
      if (score > bestScore) { bestScore = score; best = k; }
    });
    return bestScore >= 1 ? best : null;
  }

  window.PriceCapture = { extract, bookmarklet, parse, guessFood };
})();
