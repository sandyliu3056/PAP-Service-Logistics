// Visit every route of the built site, report browser errors, horizontal overflow and missing images.
// Usage: node tools/audit.js [baseUrl] [width]   (default http://localhost:8765/ and 1366)
const { chromium } = require('playwright');
(async () => {
  const base = process.argv[2] || 'http://localhost:8765/';
  const width = +(process.argv[3] || 1366);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  p.on('requestfailed', (r) => { if (!/fonts\.g/.test(r.url())) errors.push('request failed: ' + r.url()); });
  await p.goto(base + '#home', { waitUntil: 'load' });
  await p.waitForTimeout(500);
  const routes = await p.evaluate(() => Array.from(document.querySelectorAll('main .page')).map((s) => s.id.replace(/^pg-/, '')));
  let bad = 0;
  for (const r of routes) {
    await p.evaluate((h) => { location.hash = h; }, r);
    await p.waitForTimeout(r === 'c4' ? 700 : 250);
    const info = await p.evaluate(() => {
      const act = document.querySelector('main .page.active');
      const docW = document.documentElement.clientWidth;
      const over = [];
      act.querySelectorAll('*').forEach((el) => {
        const rc = el.getBoundingClientRect();
        if (rc.width && rc.right > docW + 1 && !el.closest('.org-stage, .tblw, .fig, .tabs')) over.push(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''));
      });
      const imgs = Array.from(act.querySelectorAll('img')).filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src'));
      const widgets = (act.innerHTML.match(/<!--\s*WIDGET:[a-z-]+\s*-->/g) || []).length;
      const text = act.innerText || '';
      const bad = ['待確認', 'TODO', 'TBD', 'undefined', 'NaN', '[object'].filter((w) => text.indexOf(w) !== -1);
      return { id: act.id, over: over.slice(0, 5), n: over.length, imgs, widgets, bad, h: act.scrollHeight };
    });
    const flag = info.n || info.imgs.length || info.widgets || info.bad.length;
    if (flag) bad++;
    console.log((flag ? 'FAIL ' : 'ok   ') + r.padEnd(7) + ' h=' + info.h + (info.n ? ' overflow=' + info.n + ' ' + info.over.join(',') : '') + (info.imgs.length ? ' missing-images=' + info.imgs.join(',') : '') + (info.widgets ? ' unresolved-widgets=' + info.widgets : '') + (info.bad.length ? ' bad-text=' + info.bad.join(',') : ''));
  }
  console.log('routes:', routes.length, 'failing:', bad);
  console.log('errors:', errors.length ? '\n' + errors.join('\n') : 'none');
  await b.close();
  process.exit(bad || errors.length ? 1 : 0);
})();
