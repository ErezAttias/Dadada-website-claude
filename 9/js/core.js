/* dadada V8 · core: helpers, store, router, chrome (header, menus, search, bag, quick view), shared components */
(function () {
  "use strict";
  var D = window.DD, I = window.DDI;
  var V8 = window.V8 = { pages: {}, routes: [] };

  /* ---------- helpers ---------- */
  var $ = V8.$ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = V8.$$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var esc = V8.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var money = V8.money = function (n, cents) {
    var v = Math.round(n * 100) / 100, whole = v % 1 === 0;
    return "$" + v.toLocaleString("en-US", { minimumFractionDigits: whole && !cents ? 0 : 2, maximumFractionDigits: 2 });
  };
  var P = V8.P = D.products;
  V8.list = function (type) { return (D.order[type === "crib" ? "cribs" : type === "dresser" ? "dressers" : "kids"] || []).map(function (id) { return P[id]; }); };
  V8.all = function () { return Object.keys(P).map(function (k) { return P[k]; }); };
  V8.minPrice = function (p) { return Math.min.apply(null, p.finishes.map(function (f) { return f.price; })); };
  V8.hasRange = function (p) { var a = p.finishes.map(function (f) { return f.price; }); return Math.min.apply(null, a) !== Math.max.apply(null, a); };
  // card cutout: transparent product + where its top edge sits, so the word can peek out above it
  V8.cut = function (img) { var n = img.split("/").pop().replace(/\.\w+$/, ""), t = window.DDCUT && DDCUT[n]; return t == null ? null : { src: "assets/cut/" + n + ".webp", top: t }; };
  V8.url = function (p) { return "#/p/" + p.id; };
  V8.word = function (p) { // the big hover word on product cards
    var w = { soho: "Retro", lala: "Calm", bliss: "Cozy", spirit: "Grow", jolly: "Curvy", merry: "Wavy", bliss6: "Soft", lalabig: "Roomy", soho5: "Mod", austin5: "Solid", cp: "Cubby", austin3: "Wide", lalalittle: "Petite", muse: "Play", shelf: "Story", tower: "Chef", fun: "Dream", kit: "Next" };
    return w[p.id] || p.name;
  };
  V8.icon = function (name) { return I[name] || ""; };
  var svg = V8.svg = {
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12H4M10 6l-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l13 8-13 8z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="5" y="3" width="5" height="18" rx="1"/><rect x="14" y="3" width="5" height="18" rx="1"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7.5-4.6-9.2-9.4C1.7 7.3 3.9 4 7.3 4c2 0 3.6 1.1 4.7 2.7C13.1 5.1 14.7 4 16.7 4c3.4 0 5.6 3.3 4.5 6.6C19.5 15.4 12 20 12 20z"/></svg>',
    heartOn: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 20s-7.5-4.6-9.2-9.4C1.7 7.3 3.9 4 7.3 4c2 0 3.6 1.1 4.7 2.7C13.1 5.1 14.7 4 16.7 4c3.4 0 5.6 3.3 4.5 6.6C19.5 15.4 12 20 12 20z"/></svg>',
  };
  V8.stars = function (r) { var n = Math.round(+r || 5), s = ""; for (var i = 0; i < 5; i++) s += i < n ? svg.star : svg.star.replace('fill="currentColor"', 'fill="none" stroke="currentColor" stroke-width="1.5"'); return '<span class="stars" aria-hidden="true">' + s + "</span>"; };
  V8.doodle = function (id, cls) { return '<svg class="dd ' + (cls || "") + '" aria-hidden="true"><use href="#' + id + '"/></svg>'; };

  /* ---------- store (bag + wishlist) ---------- */
  var KEY = "dd8";
  var S = (function () { try { var v = JSON.parse(localStorage.getItem(KEY)); if (v && v.cart) return v; } catch (e) {} return { cart: [], wish: [] }; })();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  V8.store = S;
  V8.cartCount = function () { return S.cart.reduce(function (a, c) { return a + c.qty; }, 0); };
  V8.lineFor = function (c) { var p = P[c.id]; if (!p) return null; var f = p.finishes[c.f] || p.finishes[0]; return { p: p, f: f, price: f.price, total: f.price * c.qty }; };
  V8.totals = function () {
    var lines = S.cart.map(V8.lineFor).filter(Boolean);
    var sub = lines.reduce(function (a, l, i) { return a + l.price * S.cart[i].qty; }, 0);
    // nursery set: each crib + dresser pair is 15% off both pieces
    var cribs = [], dressers = [];
    S.cart.forEach(function (c) { var l = V8.lineFor(c); if (!l) return; for (var i = 0; i < c.qty; i++) (l.p.type === "crib" ? cribs : l.p.type === "dresser" ? dressers : []).push(l.price); });
    cribs.sort(function (a, b) { return b - a; }); dressers.sort(function (a, b) { return b - a; });
    var pairs = Math.min(cribs.length, dressers.length), base = 0;
    for (var k = 0; k < pairs; k++) base += cribs[k] + dressers[k];
    var disc = Math.round(base * 0.15 * 100) / 100;
    return { sub: sub, disc: disc, pairs: pairs, total: sub - disc, count: V8.cartCount() };
  };
  V8.add = function (id, f, qty, opts) {
    f = f || 0; qty = qty || 1;
    var ex = S.cart.find(function (c) { return c.id === id && c.f === f; });
    if (ex) ex.qty = Math.min(9, ex.qty + qty); else S.cart.push({ id: id, f: f, qty: qty });
    save(); syncBadges(); renderBag();
    if (!(opts && opts.silent)) openBag(true);
  };
  V8.setQty = function (i, q) { if (q < 1) S.cart.splice(i, 1); else S.cart[i].qty = Math.min(9, q); save(); syncBadges(); renderBag(); V8.emit("cart"); };
  V8.clearCart = function () { S.cart = []; save(); syncBadges(); renderBag(); };
  V8.isWished = function (id) { return S.wish.indexOf(id) > -1; };
  V8.toggleWish = function (id) {
    var i = S.wish.indexOf(id), on = i < 0;
    if (on) S.wish.push(id); else S.wish.splice(i, 1);
    save(); syncBadges();
    $$('[data-wish="' + id + '"]').forEach(function (b) { b.setAttribute("aria-pressed", on); b.setAttribute("aria-label", (on ? "Remove " : "Save ") + P[id].full + (on ? " from" : " to") + " wishlist"); b.classList.remove("pop"); void b.offsetWidth; if (on) b.classList.add("pop"); });
    V8.toast(on ? P[id].full + " saved to your wishlist" : "Removed from your wishlist");
    V8.emit("wish");
  };
  var listeners = {};
  V8.on = function (ev, fn) { (listeners[ev] = listeners[ev] || []).push(fn); };
  V8.emit = function (ev) { (listeners[ev] || []).forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } }); };

  /* ---------- shared components ---------- */
  // the hand-drawn heart from the brand icons; saved state turns it orange
  V8.heart = (window.DDI && DDI.heart) || svg.heart;
  V8.wishBtn = function (p, cls) { var on = V8.isWished(p.id); return '<button type="button" class="icon-btn ' + (cls || "") + '" data-wish="' + p.id + '" aria-pressed="' + on + '" aria-label="' + (on ? "Remove " : "Save ") + esc(p.full) + (on ? " from" : " to") + ' wishlist">' + V8.heart + "</button>"; };
  V8.priceHTML = function (p, f) {
    var fin = f == null ? null : p.finishes[f];
    if (fin) return '<span class="price">' + money(fin.price) + (fin.was ? "<s>" + money(fin.was) + "</s>" : "") + "</span>";
    return '<span class="price">' + (V8.hasRange(p) ? '<span class="from">From</span>' : "") + money(V8.minPrice(p)) + (p.was ? "<s>" + money(p.was) + "</s>" : "") + "</span>";
  };
  // small label in the card's top corner, as in the original V8 cards
  V8.kicker = function (p) {
    if (p.type === "crib") return p.kind.split(" ")[0];
    if (p.type === "dresser") return p.kind.replace(/-drawer dresser/, " drawers");
    return p.type === "kit" ? "Add-on" : p.kind;
  };
  V8.card = function (p, o) {
    o = o || {};
    var f = o.f || 0, fin = p.finishes[f];
    var sw = p.finishes.length > 1 ? '<div class="swatches" role="radiogroup" aria-label="' + esc(p.full) + ' finish">' + p.finishes.map(function (x, i) {
      return '<button type="button" class="sw" role="radio" aria-checked="' + (i === f) + '" tabindex="' + (i === f ? 0 : -1) + '" aria-label="' + esc(x.name) + '" title="' + esc(x.name) + '" data-f="' + i + '" style="background:' + x.sw + '"></button>';
    }).join("") + "</div>" : "";
    var cut = V8.cut(fin.img), word = V8.word(p);
    return '<article class="pcard rv" data-id="' + p.id + '" data-f="' + f + '" style="--d:' + (o.d || 0) + 's">' +
      '<div class="pcard-fig"><a class="pcard-media' + (cut ? " has-cut" : "") + '" href="' + V8.url(p) + '" tabindex="-1" aria-hidden="true"' + (cut ? ' style="--top:' + cut.top + '"' : "") + ">" + (cut && !o.life ? '<span class="pcard-big" style="--len:' + word.length + '">' + esc(word) + "</span>" : "") + '<img class="cut" src="' + (cut ? cut.src : fin.img) + '" alt="" loading="lazy">' + (o.life ? '<img class="life" data-src="' + o.life + '" alt="">' : "") + "</a>" +
      '<span class="pcard-kick">' + (p.was ? '<span class="sale">Sale</span>' : "") + esc(V8.kicker(p)) + "</span>" +
      V8.wishBtn(p, "pcard-fav") + "</div>" +
      '<div class="pcard-body"><h3 class="pcard-name"><a href="' + V8.url(p) + '">' + esc(p.full) + "</a></h3>" +
      '<div class="pcard-sub"><span class="pcard-fin">' + esc(fin.name) + '</span><span class="pcard-price">' + V8.priceHTML(p, p.finishes.length > 1 && V8.hasRange(p) ? null : f) + "</span></div>" +
      sw + "</div></article>";
  };
  // swatch clicks inside any card swap the image and price
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".pcard .sw");
    if (!b) return;
    var card = b.closest(".pcard"), p = P[card.dataset.id], f = +b.dataset.f;
    card.dataset.f = f;
    $$(".sw", card).forEach(function (x) { var on = x === b; x.setAttribute("aria-checked", on); x.tabIndex = on ? 0 : -1; });
    var c = V8.cut(p.finishes[f].img), m = $(".pcard-media", card);
    $(".cut", m).src = c ? c.src : p.finishes[f].img;
    if (c) m.style.setProperty("--top", c.top);
    $(".pcard-price", card).innerHTML = V8.priceHTML(p, f);
    $(".pcard-fin", card).textContent = p.finishes[f].name;
  });
  document.addEventListener("keydown", function (e) {
    var b = e.target.closest && e.target.closest(".pcard .sw"); if (!b) return;
    var all = $$(".sw", b.parentNode), k = all.indexOf(b), n = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = all[(k + 1) % all.length];
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = all[(k + all.length - 1) % all.length];
    if (n) { e.preventDefault(); n.click(); n.focus(); }
  });
  document.addEventListener("click", function (e) {
    var w = e.target.closest("[data-wish]"); if (w) { e.preventDefault(); V8.toggleWish(w.dataset.wish); return; }
    var q = e.target.closest("[data-quick]"); if (q) { e.preventDefault(); var card = q.closest(".pcard"); V8.quick(q.dataset.quick, card ? +card.dataset.f : 0, q); return; }
    var a = e.target.closest("[data-add]"); if (a) { e.preventDefault(); V8.add(a.dataset.add, +(a.dataset.f || 0), 1); }
  });

  /* ---------- overlays: one scrim, focus kept inside, Esc closes ---------- */
  var scrim = $("#scrim"), openEl = null, lastFocus = null;
  function trap(e) {
    if (!openEl || e.key !== "Tab") return;
    var f = $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', openEl).filter(function (x) { return x.offsetParent !== null; });
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }
  function openLayer(el, focusSel) {
    if (openEl && openEl !== el) closeLayer(true);
    lastFocus = document.activeElement; openEl = el;
    el.classList.add("open"); scrim.classList.add("on"); document.body.style.overflow = "hidden";
    setTimeout(function () { var t = focusSel ? $(focusSel, el) : $("button, a, input", el); if (t) t.focus(); }, 60);
  }
  function closeLayer(silent) {
    if (!openEl) return;
    openEl.classList.remove("open"); scrim.classList.remove("on"); document.body.style.overflow = "";
    if (openEl.id === "sheet") $("#menuBtn").setAttribute("aria-expanded", "false");
    openEl = null;
    if (!silent && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  V8.closeLayer = closeLayer;
  scrim.addEventListener("click", function () { closeLayer(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { if (openEl) { e.preventDefault(); closeLayer(); } else if (mega.classList.contains("open")) { closeMega(); $("#megaBtn").focus(); } }
    trap(e);
  });

  /* ---------- bag drawer ---------- */
  var bag = $("#bag");
  function openBag(added) { renderBag(added); openLayer(bag, added ? ".btn-primary" : null); }
  V8.openBag = openBag;
  function renderBag(added) {
    var t = V8.totals(), body = $("#bagBody"), foot = $("#bagFoot");
    if (!S.cart.length) {
      body.innerHTML = '<div class="empty">' + V8.doodle("dd-heart-o") + '<p class="h4" style="color:var(--ink)">Your bag is empty.</p><p>Start with the crib. Everything else follows.</p><a class="btn btn-primary" href="#/cribs">Shop cribs</a></div>';
      foot.innerHTML = ""; return;
    }
    body.innerHTML = (added ? '<p class="small" style="color:var(--orange-ink);font-weight:700;margin-bottom:6px">✓ Added to your bag</p>' : "") +
      S.cart.map(function (c, i) { var l = V8.lineFor(c); if (!l) return ""; return '<div class="line-item"><a class="li-img" href="' + V8.url(l.p) + '"><img src="' + l.f.img + '" alt=""></a><div><a class="li-name" href="' + V8.url(l.p) + '">' + esc(l.p.full) + '</a><div class="li-meta">' + esc(l.f.name) + '</div><div class="qty" role="group" aria-label="Quantity for ' + esc(l.p.full) + '"><button type="button" data-q="' + i + '" data-d="-1" aria-label="Decrease">−</button><span>' + c.qty + '</span><button type="button" data-q="' + i + '" data-d="1" aria-label="Increase">+</button></div> <button type="button" class="li-remove" data-rm="' + i + '">Remove</button></div><b class="price">' + money(l.price * c.qty) + "</b></div>"; }).join("") +
      (t.pairs ? "" : setNudge());
    foot.innerHTML = '<div class="sum-row"><span>Subtotal</span><span class="price">' + money(t.sub) + "</span></div>" +
      (t.disc ? '<div class="sum-row" style="color:var(--orange-ink);font-weight:700"><span>Nursery set · 15% off</span><span>−' + money(t.disc) + "</span></div>" : "") +
      '<div class="sum-row"><span>Shipping</span><span>Free</span></div>' +
      '<div class="sum-row total"><span>Total</span><span class="price">' + money(t.total) + "</span></div>" +
      '<a class="btn btn-primary block" href="#/checkout">Checkout</a><p class="small muted" style="text-align:center">Taxes added at checkout · 14-day returns</p>';
  }
  function setNudge() {
    var hasCrib = S.cart.some(function (c) { return P[c.id] && P[c.id].type === "crib"; }), hasDr = S.cart.some(function (c) { return P[c.id] && P[c.id].type === "dresser"; });
    if (hasCrib && !hasDr) { var cr = P[S.cart.find(function (c) { return P[c.id].type === "crib"; }).id], d = P[cr.set] || P.soho5; return '<div class="line-item" style="background:var(--paper);border-radius:14px;padding:12px;border:0;margin-top:14px"><span class="li-img" style="background:#fff"><img src="' + d.finishes[0].img + '" alt=""></span><div><b class="li-name">Add the ' + esc(d.full) + '</b><div class="li-meta">Crib + dresser: 15% off both</div></div><button type="button" class="btn btn-ink sm" data-add="' + d.id + '">Add</button></div>'; }
    return "";
  }
  bag.addEventListener("click", function (e) {
    var q = e.target.closest("[data-q]"); if (q) { var i = +q.dataset.q; V8.setQty(i, S.cart[i].qty + +q.dataset.d); return; }
    var r = e.target.closest("[data-rm]"); if (r) { V8.setQty(+r.dataset.rm, 0); return; }
    if (e.target.closest("[data-close-bag]") || e.target.closest("a[href]")) closeLayer(true);
  });
  $("#bagBtn").addEventListener("click", function () { openBag(false); });
  function syncBadges() {
    var n = V8.cartCount(), w = S.wish.length, bc = $("#bagCount"), wc = $("#wishCount");
    bc.textContent = n || ""; bc.classList.toggle("on", n > 0); $("#bagBtn").setAttribute("aria-label", "Bag, " + n + " item" + (n === 1 ? "" : "s"));
    wc.textContent = w || ""; wc.classList.toggle("on", w > 0);
  }

  /* ---------- quick view ---------- */
  var qv = $("#qv"), qvState = null;
  V8.quick = function (id, f) {
    var p = P[id]; if (!p) return;
    qvState = { id: id, f: f || 0, qty: 1 };
    renderQV(); openLayer(qv, ".btn-primary");
  };
  function renderQV() {
    var p = P[qvState.id], fin = p.finishes[qvState.f];
    qv.innerHTML = '<button type="button" class="icon-btn qv-close" data-close-qv aria-label="Close">' + svg.x + '</button>' +
      '<div class="qv-media"><img src="' + fin.img + '" alt="' + esc(p.full + ", " + fin.name) + '"></div>' +
      '<div class="qv-body">' + (p.awards ? '<div class="row" style="--s:6px">' + p.awards.slice(0, 1).map(function (a) { return '<span class="chip lime">' + esc(a) + "</span>"; }).join("") + "</div>" : "") +
      '<h2 class="disp c-orange" id="qvTitle">' + esc(p.full) + "</h2>" +
      '<div class="buy-meta">' + V8.priceHTML(p, qvState.f).replace('class="price"', 'class="price" style="font-size:24px"') + (p.rating ? '<span class="rating">' + V8.stars(p.rating) + p.rating + " · " + p.reviews + " reviews</span>" : "") + "</div>" +
      '<p class="body">' + esc(p.tag || p.line || p.kind) + "</p>" +
      (p.finishes.length > 1 ? '<div class="stack" style="--s:10px"><span class="label muted">Finish · ' + esc(fin.name) + '</span><div class="fin-pills">' + p.finishes.map(function (x, i) { return '<button type="button" class="fin-pill" aria-pressed="' + (i === qvState.f) + '" data-qf="' + i + '"><i style="background:' + x.sw + '"></i>' + esc(x.name) + "</button>"; }).join("") + "</div></div>" : "") +
      '<div class="buy-row"><div class="qty lg" role="group" aria-label="Quantity"><button type="button" data-qq="-1" aria-label="Decrease">−</button><span>' + qvState.qty + '</span><button type="button" data-qq="1" aria-label="Increase">+</button></div><button type="button" class="btn btn-primary lg" data-qadd>Add to bag · ' + money(fin.price * qvState.qty) + "</button></div>" +
      '<ul class="buy-perks" role="list"><li>Free shipping to the 48 states</li><li>Ships in 1 business day</li><li>14-day returns</li></ul>' +
      '<a class="link" href="' + V8.url(p) + '" data-close-qv>See full details <span class="ar" aria-hidden="true">→</span></a></div>';
  }
  qv.addEventListener("click", function (e) {
    if (e.target.closest("[data-close-qv]")) { closeLayer(!!e.target.closest("a")); return; }
    var f = e.target.closest("[data-qf]"); if (f) { qvState.f = +f.dataset.qf; renderQV(); $('[data-qf="' + qvState.f + '"]', qv).focus(); return; }
    var q = e.target.closest("[data-qq]"); if (q) { qvState.qty = Math.max(1, Math.min(9, qvState.qty + +q.dataset.qq)); renderQV(); $('[data-qq="' + q.dataset.qq + '"]', qv).focus(); return; }
    if (e.target.closest("[data-qadd]")) { closeLayer(true); V8.add(qvState.id, qvState.f, qvState.qty); }
  });

  /* ---------- toast ---------- */
  var toastT;
  V8.toast = function (msg) { var t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("on"); }, 2600); };

  /* ---------- header: logo, mega menu, phone menu, search ---------- */
  $("#logo").innerHTML = I.logo + '<span class="sr">dadada</span>';
  $("#logo2").innerHTML = I.logo;
  $("#ftrWord").innerHTML = I.logo;
  $("#searchBtn").innerHTML = I.search; $(".t-acct").insertAdjacentHTML("afterbegin", I.account); $(".t-wish").insertAdjacentHTML("afterbegin", I.heart); $("#bagBtn").insertAdjacentHTML("afterbegin", I.bag);
  // Shop menu (V7 layout): big categories on the left, a room photo for the one in focus on the right
  var MG = { cribs: ["mom-soho", "Shop all cribs"], dressers: ["mom-dr-soho", "Shop all dressers"], kids: ["mom-kids", "Shop toddler & kids"], sets: ["mom-dr-cp", "Shop all sets"] };
  // every option of the category in focus is listed next to it
  var MGL = {
    cribs: V8.list("crib").map(function (p) { return [V8.url(p), p.full, p.kind.split(" ")[0], V8.minPrice(p)]; }).concat([["#/compare", "Compare cribs", "", 0]]),
    dressers: V8.list("dresser").map(function (p) { return [V8.url(p), p.full, p.kind.replace(" dresser", ""), V8.minPrice(p)]; }),
    kids: V8.list("kids").concat(V8.list("kit")).map(function (p) { return [V8.url(p), p.full, p.kind, V8.minPrice(p)]; }),
    sets: Object.keys(D.sets).map(function (c) { var cr = P[c], dr = P[D.sets[c]]; return ["#/sets", cr.name + " set", "Crib + " + dr.kind.replace(" dresser", " dresser").toLowerCase(), Math.round((V8.minPrice(cr) + V8.minPrice(dr)) * .85)]; })
  };
  $("#mgLists").innerHTML = Object.keys(MGL).map(function (k) { return '<ul class="mg-list" data-c="' + k + '"' + (k === "cribs" ? "" : " hidden") + ">" + MGL[k].map(function (r) { return '<li><a href="' + r[0] + '"><span><b>' + esc(r[1]) + "</b>" + (r[2] ? "<small>" + esc(r[2]) + "</small>" : "") + "</span>" + (r[3] ? '<span class="pr">' + (k === "sets" ? "from " : "") + money(r[3]) + "</span>" : "") + "</a></li>"; }).join("") + "</ul>"; }).join("");
  $$(".mg-cat").forEach(function (a) {
    function focusCat() { $$(".mg-cat").forEach(function (x) { x.classList.toggle("on", x === a); }); $$(".mg-list").forEach(function (l) { l.hidden = l.dataset.c !== a.dataset.c; }); var m = MG[a.dataset.c]; $("#mgImg").src = "media/" + m[0] + ".webp"; $("#mgImgA").href = a.getAttribute("href"); $("#mgAll").href = a.getAttribute("href"); $("#mgAll").innerHTML = m[1] + ' <span aria-hidden="true">→</span>'; }
    a.addEventListener("mouseenter", focusCat); a.addEventListener("focus", focusCat);
  });
  var smItem = function (p) { return '<li><a href="' + V8.url(p) + '">' + esc(p.full) + "</a></li>"; };
  $("#smCribs").innerHTML = V8.list("crib").map(smItem).join("") + '<li><a class="all" href="#/cribs">Shop all cribs →</a></li>';
  $("#smDressers").innerHTML = V8.list("dresser").map(smItem).join("") + '<li><a class="all" href="#/dressers">Shop all dressers →</a></li>';
  $("#smKids").innerHTML = V8.list("kids").concat(V8.list("kit")).map(smItem).join("") + '<li><a class="all" href="#/kids">Shop toddler &amp; kids →</a></li>';
  var mega = $("#mega"), megaBtn = $("#megaBtn"), megaT;
  function wakeImgs(el) { $$("img[data-src]", el).forEach(function (i) { i.src = i.dataset.src; i.removeAttribute("data-src"); }); }
  function openMega() { wakeImgs(mega); clearTimeout(megaT); mega.classList.add("open"); megaBtn.setAttribute("aria-expanded", "true"); $(".hdr").classList.add("mega-on"); }
  function closeMega() { mega.classList.remove("open"); megaBtn.setAttribute("aria-expanded", "false"); $(".hdr").classList.remove("mega-on"); }
  var megaHoverAt = 0;
  megaBtn.addEventListener("click", function () { if (mega.classList.contains("open") && Date.now() - megaHoverAt > 600) closeMega(); else openMega(); });
  [megaBtn, mega].forEach(function (el) { el.addEventListener("mouseenter", function () { if (matchMedia("(hover:hover)").matches) { if (!mega.classList.contains("open")) megaHoverAt = Date.now(); openMega(); } }); el.addEventListener("mouseleave", function () { megaT = setTimeout(closeMega, 180); }); });
  mega.addEventListener("click", function (e) { if (e.target.closest("a")) closeMega(); });
  document.addEventListener("click", function (e) { if (!e.target.closest("#mega") && !e.target.closest("#megaBtn")) closeMega(); });
  var sheet = $("#sheet");
  $("#menuBtn").addEventListener("click", function () { wakeImgs(sheet); this.setAttribute("aria-expanded", "true"); openLayer(sheet); });
  sheet.addEventListener("click", function (e) { if (e.target.closest("[data-close-sheet]")) closeLayer(); else if (e.target.closest("a")) closeLayer(true); });

  var search = $("#search"), q = $("#q");
  function openSearch() { openLayer(search, "#q"); runSearch(); }
  V8.openSearch = openSearch;
  $("#searchBtn").addEventListener("click", openSearch);
  search.addEventListener("click", function (e) { if (e.target.closest("[data-close-search]")) closeLayer(); else if (e.target.closest("a")) closeLayer(true); var s = e.target.closest("[data-sugg]"); if (s) { q.value = s.dataset.sugg; runSearch(); q.focus(); } });
  document.addEventListener("keydown", function (e) { if (e.key === "/" && !/input|textarea|select/i.test(e.target.tagName) && !openEl) { e.preventDefault(); openSearch(); } });
  q.addEventListener("input", runSearch);
  function runSearch() {
    var v = q.value.trim().toLowerCase(), res = $("#searchRes"), sug = $("#searchSugg");
    sug.innerHTML = ["Convertible crib", "Walnut", "Dresser", "Toddler bed", "Changing tray", "Safety"].map(function (s) { return '<button type="button" class="filter" data-sugg="' + s + '">' + s + "</button>"; }).join("");
    var items = V8.all().filter(function (p) { if (!v) return p.type === "crib"; var hay = [p.full, p.kind, p.tag, p.line].concat(p.finishes.map(function (f) { return f.name; })).join(" ").toLowerCase(); return v.split(/\s+/).every(function (w) { return hay.indexOf(w.replace(/s$/, "")) > -1; }); });
    var arts = v ? D.journal.filter(function (j) { return (j.title + " " + j.ex + " " + j.cat).toLowerCase().indexOf(v) > -1; }) : [];
    res.innerHTML = (items.length ? '<p class="label muted" style="margin-bottom:12px">' + (v ? items.length + " product" + (items.length === 1 ? "" : "s") : "Popular cribs") + '</p><div class="search-res">' + items.slice(0, 10).map(function (p) { return '<a href="' + V8.url(p) + '"><span class="im"><img src="' + p.finishes[0].img + '" alt="" loading="lazy"></span><b>' + esc(p.full) + '</b><span class="small muted">' + V8.priceHTML(p) + "</span></a>"; }).join("") + "</div>" : '<p class="h4">No products match “' + esc(q.value) + '”.</p><p class="muted mt-s">Try “crib”, “dresser” or a finish like “walnut”.</p>') +
      (arts.length ? '<p class="label muted" style="margin:24px 0 12px">From the journal</p><div class="stack" style="--s:8px">' + arts.map(function (j) { return '<a class="link" href="#/journal/' + j.id + '">' + esc(j.title) + "</a>"; }).join("") + "</div>" : "");
  }

  /* header state: transparent over the home film, solid after scrolling, hides on scroll down */
  var hdr = $("#hdr"), lastY = 0;
  function onScroll() {
    var y = scrollY, over = document.body.classList.contains("home-page");
    hdr.classList.toggle("over", over && y < innerHeight * 0.75);
    hdr.classList.toggle("scrolled", !over || y > 10);
    hdr.classList.toggle("hide", y > 400 && y > lastY + 4 && !mega.classList.contains("open"));
    if (y < lastY - 4 || y < 400) hdr.classList.remove("hide");
    lastY = y;
  }
  addEventListener("scroll", onScroll, { passive: true });

  /* announcement strip rotates */
  var msgs = $$("#strip .strip-msg"), mi = 0;
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setInterval(function () { msgs[mi].classList.remove("on"); mi = (mi + 1) % msgs.length; msgs[mi].classList.add("on"); }, 4000);

  /* newsletter (footer and any [data-news] form) */
  document.addEventListener("submit", function (e) {
    var f = e.target.closest(".news"); if (!f) return;
    e.preventDefault(); var inp = $("input[type=email]", f);
    if (!inp.value || !/^\S+@\S+\.\S+$/.test(inp.value)) { inp.setAttribute("aria-invalid", "true"); inp.focus(); V8.toast("Enter a valid email address"); return; }
    inp.removeAttribute("aria-invalid"); f.classList.add("done");
  });

  /* ---------- reveal on scroll ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -6% 0px" }) : null;
  V8.reveal = function (root) { $$(".rv:not(.in)", root).forEach(function (el) { if (io) io.observe(el); else el.classList.add("in"); }); setTimeout(function () { $$(".rv:not(.in)", root).forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add("in"); }); }, 1200); };

  /* ---------- router ---------- */
  V8.route = function (pattern, fn) { V8.routes.push({ re: new RegExp("^" + pattern.replace(/:(\w+)/g, "([^/]+)") + "$"), fn: fn }); };
  var main = $("#main"), cleanup = [];
  V8.onLeave = function (fn) { cleanup.push(fn); };
  function render() {
    var h = location.hash;
    if (h && h.indexOf("#/") !== 0) return; // in-page anchors (skip link) are left to the browser
    var path = decodeURIComponent((h || "#/").slice(2)).replace(/\/$/, "").split("?")[0];
    var m = null, r = null;
    for (var i = 0; i < V8.routes.length; i++) { m = V8.routes[i].re.exec(path); if (m) { r = V8.routes[i]; break; } }
    cleanup.forEach(function (fn) { try { fn(); } catch (e) {} }); cleanup = [];
    closeLayer(true); closeMega();
    var out = r ? r.fn.apply(null, m.slice(1)) : V8.pages.notFound();
    if (out && out.redirect) { location.replace(out.redirect); return; }
    document.body.classList.toggle("home-page", !!out.home);
    document.title = out.title ? out.title + " · dadada" : "dadada · Bring your personality. We'll bring the crib.";
    main.innerHTML = out.html;
    $$(".nav a").forEach(function (a) { a.toggleAttribute("aria-current", a.getAttribute("href") === "#/" + path.split("/")[0]); if (a.hasAttribute("aria-current")) a.setAttribute("aria-current", "page"); });
    if (!out.keepScroll) scrollTo(0, 0);
    onScroll();
    if (out.after) out.after(main);
    V8.reveal(main);
    if (V8._navigated) main.focus({ preventScroll: true });
    V8._navigated = true;
  }
  V8.render = render;
  V8.start = function () { addEventListener("hashchange", render); syncBadges(); renderBag(); render(); };
})();
