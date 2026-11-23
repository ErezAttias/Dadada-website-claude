/* dadada V8 · shop: collections, product pages, compare, quiz, checkout */
(function () {
  "use strict";
  var V8 = window.V8, D = window.DD, P = V8.P, $ = V8.$, $$ = V8.$$, esc = V8.esc, money = V8.money, svg = V8.svg;

  function crumbs(items) { return '<nav class="crumbs" aria-label="Breadcrumb">' + items.map(function (c, i) { return i === items.length - 1 ? '<span aria-current="page">' + esc(c[0]) + "</span>" : '<a href="' + c[1] + '">' + esc(c[0]) + '</a><i aria-hidden="true">/</i>'; }).join("") + "</nav>"; }
  V8.crumbs = crumbs;
  function head(o) { return '<header class="wrap page-head">' + crumbs(o.crumbs) + '<h1 class="disp d2">' + o.h1 + "</h1>" + (o.lede ? '<p class="lede">' + o.lede + "</p>" : "") + (o.extra || "") + "</header>"; }
  V8.pageHead = head;
  function quizBand() { return '<section class="bg-orange quizband" aria-labelledby="qb-h">' + '<h2 class="disp d2" id="qb-h">Still <b>deciding?</b></h2><p>Four questions and we’ll pick one, with a reason.</p><div class="row" style="--s:12px;justify-content:center"><a class="btn btn-lime lg" href="#/quiz">Take the quiz</a><a class="btn btn-light lg" href="#/compare">Compare cribs</a></div></section>'; }
  V8.quizBand = quizBand;

  /* ---------- collections ---------- */
  var COLL = {
    cribs: { t: "Cribs", h1: "Cribs that <b>grow up.</b>", lede: "Five convertible cribs in solid European beech, made in Italy. Each one becomes a toddler bed, and some go much further.", items: function () { return V8.list("crib"); },
      filters: [["all", "All"], ["3-in-1", "3-in-1"], ["4-in-1", "4-in-1"], ["8-in-1", "8-in-1"]], test: function (p, v) { return p.kind.indexOf(v) === 0; } },
    dressers: { t: "Dressers", h1: "Bring the tiny socks.<br><b>We’ll bring the drawers.</b>", lede: "Eight solid-wood dressers, all 34 inches tall. Add a tray and any of them becomes a changing table, then lift it off when the diaper years are over.", items: function () { return V8.list("dresser"); },
      filters: [["all", "All"], ["6", "Six drawers"], ["5", "Five drawers"], ["3", "Three drawers"]], test: function (p, v) { return String(p.drawers) === v; } },
    kids: { t: "Toddler & kids", h1: "They grow up.<br><b>Your taste stays.</b>", lede: "Beds, shelves and a tower for the years after the crib, in the same clean lines as the nursery.", items: function () { return V8.list("kids").concat(V8.list("kit")); } },
    finishing: { t: "Finishing touches", h1: "The last layer.<br><b>Finishing touches.</b>", lede: "Mattresses, sheets, bedding, wallpaper and the small pieces that finish a dadada nursery.", items: function () { return V8.list("touch"); },
      filters: [["all", "All"]].concat(D.touchGroups), test: function (p, v) { return p.group === v; } },
    sale: { t: "Sale", h1: "On sale, <b>for now.</b>", lede: "The same solid wood and finishes, for less. Sale items are final sale.", items: function () { return V8.all().filter(function (p) { return p.was; }); } }
  };
  function collection(key) {
    var c = COLL[key], items = c.items();
    var html = head({ crumbs: [["Home", "#/"], [c.t]], h1: c.h1, lede: c.lede }) +
      '<section class="wrap" aria-label="' + esc(c.t) + '"><div class="coll-bar"><div class="filters" role="group" aria-label="Filter">' + (c.filters ? c.filters.map(function (f, i) { return '<button type="button" class="filter" aria-pressed="' + !i + '" data-v="' + f[0] + '">' + f[1] + "</button>"; }).join("") : '<span class="coll-count">' + items.length + " pieces</span>") + "</div>" +
      '<div class="sort"><label for="sort">Sort</label><select id="sort"><option value="feat">Featured</option><option value="lo">Price, low to high</option><option value="hi">Price, high to low</option></select></div></div>' +
      '<div class="pgrid' + (key === "finishing" ? " tiles" : "") + '" id="collGrid"></div><p class="coll-count mt-m" id="collCount" aria-live="polite"></p></section>' +
      (key === "dressers" ? '<div class="wrap mt-m"><a class="link" href="#/compare-dressers">Compare all eight dressers</a></div>' + trays() : "") +
      (key === "cribs" ? '<section class="sec"><div class="wrap">' + setsStrip() + "</div></section>" : "") +
      (key !== "sale" ? quizBand() : "");
    return { title: c.t, html: html, after: function (root) {
      var fv = "all", sv = "feat", grid = $("#collGrid", root);
      function draw() {
        var list = items.filter(function (p) { return fv === "all" || !c.test || c.test(p, fv); });
        if (sv !== "feat") list = list.slice().sort(function (a, b) { return (V8.minPrice(a) - V8.minPrice(b)) * (sv === "lo" ? 1 : -1); });
        grid.innerHTML = list.map(function (p, i) { return V8.card(p, { d: i * .04 }); }).join("") || '<p class="muted">Nothing matches that filter.</p>';
        $("#collCount", root).textContent = list.length + " of " + items.length + " pieces";
        V8.reveal(grid);
      }
      $$(".filter", root).forEach(function (b) { b.addEventListener("click", function () { fv = b.dataset.v; $$(".filter", root).forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); draw(); }); });
      $("#sort", root).addEventListener("change", function () { sv = this.value; draw(); });
      draw();
    } };
  }
  function trays() { return '<section class="sec"><div class="wrap split"><div class="im rv"><img src="media/tray-detail.webp" alt="A beech changing tray with a linen pad and folded muslins on a cream dresser" loading="lazy"></div><div class="stack rv" style="--s:20px"><h2 class="disp d2 c-orange">A dresser now.<br><b>A changing table too.</b></h2><p class="lede">Every dadada dresser stands 34 inches tall, the right height for changing a diaper without bending. Snap a solid-wood tray on top for the baby years. When they’re done, lift it off and the dresser stays in the room for good.</p><ul class="acc" role="list" style="list-style:none;padding:0"><li class="sum-row" style="padding:14px 0;border-bottom:1px solid var(--line)"><span>Soho, Bliss, Merry tray</span><b>$119</b></li><li class="sum-row" style="padding:14px 0;border-bottom:1px solid var(--line)"><span>Austin, Central Park, LaLa Big</span><b>$99</b></li><li class="sum-row" style="padding:14px 0;border-bottom:1px solid var(--line)"><span>LaLa Little</span><b>$69</b></li></ul></div></div></section>'; }
  function setRows() { return D.order.cribs.map(function (cid) { var cr = P[cid], dr = P[D.sets[cid]]; if (!dr) return null; var sub = cr.finishes[0].price + dr.finishes[0].price; return { cr: cr, dr: dr, sub: sub, tot: sub * .85 }; }).filter(Boolean); }
  function setsStrip() { return '<div class="setband rv"><div class="setband-img"><img src="media/mom-bliss.webp" alt="A mother beside a walnut Bliss crib and a Bliss dresser" loading="lazy"></div><div class="setband-copy"><span class="label" style="color:var(--lime)">Nursery sets</span><h2 class="disp d2">Crib + dresser.<br><b>15% off both.</b></h2><p class="lede">Put both in your bag and the set price applies automatically.</p><a class="btn btn-lime" href="#/sets">Shop the sets</a></div></div>'; }

  /* sets page */
  V8.route("sets", function () {
    var rows = setRows();
    return { title: "Nursery sets", html: head({ crumbs: [["Home", "#/"], ["Nursery sets"]], h1: "Crib + dresser. <b>15% off both.</b>", lede: "Pair any crib with any dresser and the saving comes off both pieces at checkout. These are the pairs we designed together." }) +
      '<section class="wrap" aria-label="Sets"><ul class="stack" role="list" style="--s:var(--gap)">' + rows.map(function (r, i) {
        return '<li class="rv" style="--d:' + i * .05 + 's"><div class="setband" style="background:var(--paper);color:var(--ink)"><div class="setband-copy" style="grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1fr);gap:var(--gap);align-items:center">' +
          '<a href="' + V8.url(r.cr) + '" class="pcard-media" style="aspect-ratio:4/3"><img src="' + r.cr.finishes[0].img + '" alt="' + esc(r.cr.full) + '"></a>' +
          '<a href="' + V8.url(r.dr) + '" class="pcard-media" style="aspect-ratio:4/3"><img src="' + r.dr.finishes[0].img + '" alt="' + esc(r.dr.full) + '"></a>' +
          '<div class="stack" style="--s:12px"><h2 class="h4">' + esc(r.cr.full) + " + " + esc(r.dr.full) + '</h2><p class="price" style="font-size:24px">' + money(r.tot, true) + "<s>" + money(r.sub) + '</s></p><p class="small muted">You save ' + money(r.sub - r.tot, true) + '</p><button type="button" class="btn btn-primary" data-set="' + r.cr.id + '">Add the set</button></div></div></div></li>';
      }).join("") + "</ul></section>" +
      '<section class="sec"><div class="wrap"><div class="sec-head"><h2 class="disp d2 c-orange">Ready-made <b>bundles.</b></h2><p class="lede">Two pairings at a fixed bundle price.</p></div><div class="pgrid">' + V8.list("bundle").map(function (p, i) { return V8.card(p, { d: i * .05 }); }).join("") + "</div></div></section>" + quizBand(),
      after: function (root) { $$("[data-set]", root).forEach(function (b) { b.addEventListener("click", function () { V8.add(b.dataset.set, 0, 1, { silent: true }); V8.add(D.sets[b.dataset.set], 0, 1); }); }); } };
  });
  ["cribs", "dressers", "kids", "finishing", "sale"].forEach(function (k) { V8.route(k, function () { return collection(k); }); });
  V8.route("dressers/sets", function () { return { redirect: "#/sets" }; });

  /* ---------- product page ---------- */
  function specList(p) {
    if (p.specs) return p.specs;
    if (p.type === "dresser") return [["Dimensions", p.w + "″ W × 34″ H"], ["Drawers", p.drawers + (p.drawers === 3 && p.id === "cp" ? " drawers + two open shelves" : " drawers")], ["Drawers glide", p.glide], ["Clearance", p.clear], ["Weight", p.weight + " lb"], ["Changing tray", "Fits on top · " + money(p.tray)], ["Legs", p.legs === "splay" ? "Splayed, mid-century" : "Straight"], ["Safety", "Anti-tip kit included"], ["Warranty", "1 year"]].filter(function (r) { return r[1] && !/undefined/.test(r[1]); });
    if (p.facts) return p.facts.map(function (f, i) { return [["Size", "Mattress", "Detail"][i] || "Detail", f]; });
    return [];
  }
  function product(id) {
    var p = P[id]; if (!p) return V8.pages.notFound();
    var isCrib = p.type === "crib", coll = { crib: ["Cribs", "#/cribs"], dresser: ["Dressers", "#/dressers"], kids: ["Toddler & kids", "#/kids"], kit: ["Toddler & kids", "#/kids"], touch: ["Finishing touches", "#/finishing"], bundle: ["Nursery sets", "#/sets"], gift: ["Gift card", "#/p/gift-card"] }[p.type], isTouch = p.type === "touch" || p.type === "gift", kitId = p.id === "jolly" ? "kit-jolly" : "kit";
    var set = isCrib && P[p.set];
    var gallery = p.finishes.map(function (f, i) { return { img: f.img, cut: !isTouch, f: i, alt: p.full + ", " + f.name }; }).filter(function (g, i, a) { return a.findIndex(function (x) { return x.img === g.img; }) === i; })
      .concat((p.gallery || []).map(function (g) { return { img: g.img, alt: g.alt, cap: g.cap }; })).concat(p.scene ? [{ img: p.scene, alt: p.full + " in a room" }] : []).concat(p.mom ? [{ img: p.mom, alt: p.full + " in a nursery" }] : []);
    // films: the product film first, then a parent's film where there is one
    var FILMS = { soho: ["v-soho", "ugc-soho-nursery"], lala: ["v-lala", "ugc-lala"], spirit: ["v-spirit"], jolly: ["v-jolly", "ugc-jolly"], bliss: ["ugc-bliss"] }[p.id] || [];
    FILMS.slice().reverse().forEach(function (v) { gallery.splice(1, 0, { video: v, img: "media/" + v + ".webp", alt: p.full + (v.indexOf("ugc") === 0 ? ", filmed by a parent" : ", film") }); });
    var related = (isCrib ? V8.list("crib") : p.type === "dresser" ? V8.list("dresser") : p.type === "bundle" ? V8.list("bundle").concat(V8.list("crib")) : isTouch ? V8.list("touch") : V8.list("kids").concat(V8.list("kit"))).filter(function (x) { return x.id !== p.id; }).slice(0, 4);
    var reviews = p.quotes || [];
    // pieces that go with this one; each can be ticked and added with it from the buy panel
    var TRAY = { soho5: "tray-soho", bliss6: "tray-soho", merry: "tray-soho", austin5: "tray-austin", cp: "tray-austin", lalabig: "tray-austin" };
    var addOns = (isCrib ? [set && { id: set.id, note: "Crib + dresser · 15% off both" }, { id: "newton", note: "Made to fit this crib" }, { id: "sheet-organic", note: "Organic cotton muslin" }, { id: kitId, note: "Turns it into a toddler bed", kit: true }]
      : p.type === "dresser" ? [TRAY[p.id] && { id: TRAY[p.id], note: "Makes it a changing table" }, { id: "baskets", note: "For the open shelves and drawers" }, p.cribs && P[p.cribs[0]] && { id: p.cribs[0], note: "Crib + dresser · 15% off both" }]
      : p.type === "kids" ? [{ id: "bedding", note: "Toddler bedding set" }, { id: "comforter", note: "Toddler comforter" }] : []).filter(function (a) { return a && P[a.id] && a.id !== p.id; });
    var BADGES = isCrib ? [["leaf", "GREENGUARD Gold certified"], ["home", "Made in Italy, solid beech"], ["shield", "Non-toxic, baby-safe finish"]]
      : p.type === "dresser" ? [["ruler", "34″ tall, changing-table height"], ["shield", "Anti-tip kit included"], ["home", "Solid wood legs and pulls"]] : [];
    var awards = (p.awards || []).filter(function (a) { return /\d{4}|ABC|award|best/i.test(a); });
    var nurseries = (p.id === "soho" ? ["media/life/keys.webp", "media/life/laptop.webp", "media/life/records.webp", "media/life/erva.webp"] : []).concat([p.mom, p.scene].concat((p.gallery || []).map(function (g) { return g.img; }))).concat(FILMS.filter(function (v) { return v.indexOf("ugc") === 0; }).map(function (v) { return "media/" + v + ".webp"; })).filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 6);
    var TASK = "https://www.taskrabbit.com/partner/dadadababy";
    var hasAsm = /^(dresser|crib|kids)$/.test(p.type);
    var html = '<div class="wrap" style="padding-top:clamp(20px,2.4vw,36px)">' + crumbs([["Home", "#/"], coll, [p.full]]) + "</div>" +
      '<section class="wrap pdp" style="padding-block:clamp(20px,2.4vw,36px) var(--sec)" aria-labelledby="pd-h">' +
        '<div class="gal"><div class="gal-main" id="galMain"><img id="galImg" src="' + gallery[0].img + '" alt="' + esc(gallery[0].alt) + '"><video id="galVid" class="gal-vid" muted loop playsinline preload="none" hidden></video>' +
          "</div>" +
          '<div class="gal-thumbs" role="group" aria-label="Images">' + gallery.slice(0, 10).map(function (g, i) { return '<button type="button" aria-pressed="' + !i + '" data-g="' + i + '" aria-label="' + esc(g.alt) + '"' + (g.video ? ' class="is-vid"' : "") + '><img class="' + (g.cut ? "cut" : "") + '" src="' + g.img + '" alt="" loading="lazy"></button>'; }).join("") + "</div></div>" +
        '<div class="buy" id="buy">' +
          (p.was ? '<div class="row"><span class="chip orange">Sale</span></div>' : "") +
          '<h1 class="disp d2" id="pd-h">' + esc(p.full) + "</h1>" +
          '<p class="lede" style="margin-top:-8px">' + esc(p.tag || p.line || p.kind) + "</p>" +
          (p.rating ? '<a class="rating pd-rating" href="#reviews">' + V8.stars(p.rating) + p.rating + " · " + p.reviews + " reviews</a>" : "") +
          (awards.length ? '<ul class="pd-awards" role="list">' + awards.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul>" : "") +
          (BADGES.length ? '<ul class="pd-badges" role="list">' + BADGES.map(function (b) { return '<li><span class="pd-bi pd-bi-' + b[0] + '" aria-hidden="true"></span>' + esc(b[1]) + "</li>"; }).join("") + "</ul>" : "") +
          '<div class="buy-meta"><span id="pdPrice">' + V8.priceHTML(p, 0) + "</span></div>" +
          (p.finishes.length > 1 ? (p.finishes.every(function (f) { return f.sw; }) ? '<div class="fin-sws" role="group" aria-label="' + esc(p.opt || "Finish") + '">' + p.finishes.map(function (f, i) { return '<button type="button" class="fin-sw" aria-pressed="' + !i + '" data-pf="' + i + '" aria-label="' + esc(f.name) + '" title="' + esc(f.name) + '"><i style="background:' + f.sw + '"></i></button>'; }).join("") + "</div>" : '<div class="fin-pills" role="group" aria-label="' + esc(p.opt || "Finish") + '">' + p.finishes.map(function (f, i) { return '<button type="button" class="fin-pill" aria-pressed="' + !i + '" data-pf="' + i + '">' + esc(f.name) + (V8.hasRange(p) && p.type !== "gift" ? " · " + money(f.price) : "") + "</button>"; }).join("") + "</div>") : "") +
          (addOns.length ? '<fieldset class="addons"><legend class="label">Pairs well with</legend>' + addOns.map(function (a) { var x = P[a.id], pr = a.kit ? (p.kit || x.finishes[0].price) : x.finishes[0].price; return '<label class="addon"><input type="checkbox" data-addon="' + x.id + '" data-price="' + pr + '"' + (a.kit ? " data-kit" : "") + '><span class="addon-im"><img src="' + x.finishes[0].img + '" alt="" loading="lazy"></span><span class="addon-tx"><b>' + esc(x.full) + "</b><small>" + esc(a.note) + '</small></span><span class="addon-p">+' + money(pr) + "</span></label>"; }).join("") + "</fieldset>" : "") +
          '<div class="buy-row"><button type="button" class="btn btn-primary lg" id="pdAdd">Add to bag</button>' + V8.wishBtn(p) + "</div>" +
          (set ? '<a class="buy-set" href="' + V8.url(set) + '">Pair it with the ' + esc(set.full) + ' · <b>15% off both</b> <span aria-hidden="true">→</span></a>' : "") +
          (p.fits ? '<p class="small">Fits the ' + p.fits.map(function (k) { return '<a class="link" href="' + V8.url(P[k]) + '">' + esc(P[k].full) + "</a>"; }).join(", ") + "</p>" : "") + (p.parts ? '<p class="small">Includes the ' + p.parts.map(function (k) { return '<a class="link" href="' + V8.url(P[k]) + '">' + esc(P[k].full) + "</a>"; }).join(" and ") + "</p>" : "") + (p.finalSale ? '<p class="small"><b>Final sale.</b> This item can’t be returned.</p>' : "") +
          (isTouch ? (p.priceNote ? '<p class="small muted">' + esc(p.priceNote) + "</p>" : "") : '<p class="buy-perks">Free shipping · Ships in 1 business day · 14-day returns · ' + (isCrib ? "2-year" : "1-year") + " warranty</p>") +
          (hasAsm ? '<div class="asm"><span class="asm-ic" aria-hidden="true">' + svg.box + '</span><div><b>Don’t stress the build.</b><span>Book a Taskrabbit pro from $65, after you order.</span><label class="asm-check"><input type="checkbox" id="pdAsm"' + (V8.store.asm ? " checked" : "") + '> Remind me to book assembly at checkout</label></div><a class="link" href="' + TASK + '" target="_blank" rel="noopener">How it works</a></div>' : "") +
          '<div class="acc">' + (p.about && p.about.length ? '<details open><summary>About the ' + esc(p.name) + '</summary><div class="acc-body">' + p.about.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</div></details>" : "") + (p.featsLive && p.featsLive.length ? '<details><summary>Features &amp; specifications</summary><div class="acc-body"><ul>' + p.featsLive.map(function (w) { return "<li>" + esc(w) + "</li>"; }).join("") + "</ul></div></details>" : "") + (p.why && p.why.length ? '<details' + (p.about ? "" : " open") + '><summary>Why parents pick it</summary><div class="acc-body"><ul>' + p.why.map(function (w) { return "<li>" + esc(w) + "</li>"; }).join("") + "</ul></div></details>" : p.feats && p.feats.length ? '<details open><summary>Details</summary><div class="acc-body"><ul>' + p.feats.map(function (w) { return "<li>" + esc(w) + "</li>"; }).join("") + "</ul></div></details>" : "") +
          (isTouch ? "" : '<details><summary>Shipping &amp; returns</summary><div class="acc-body">Free delivery to the contiguous 48 states, shipped within one business day. Return within 14 days of delivery, unused and in the original packaging; a 20% restocking fee applies. <a class="link" href="#/support/returns">Full policy</a></div></details>') +
          (isCrib ? '<details><summary>Safety</summary><div class="acc-body">' + esc(D.safe) + "</div></details>" : "") + "</div>" +
        "</div>" +
      "</section>" +
      (addOns.length ? '<section class="sec pw" aria-labelledby="pw-h"><div class="wrap"><div class="sec-head"><h2 class="disp d2 c-orange" id="pw-h">Pairs well <b>with.</b></h2><p class="muted">Add any of these without leaving the page.</p></div><div class="pw-grid">' + addOns.map(function (a) { var x = P[a.id]; return '<div class="pw-card"><a class="pw-im" href="' + V8.url(x) + '"><img src="' + x.finishes[0].img + '" alt="' + esc(x.full) + '" loading="lazy"></a><div class="pw-tx"><a href="' + V8.url(x) + '"><b>' + esc(x.full) + "</b></a><small>" + esc(a.note) + '</small><span class="price">' + V8.priceHTML(x, 0) + '</span></div><button type="button" class="btn btn-secondary sm" data-pwadd="' + x.id + '"' + (a.kit ? " data-kit" : "") + ">Add</button></div>"; }).join("") + "</div></div></section>" : "") +
      (specList(p).length ? '<section class="sec bg-paper" aria-labelledby="sp-h"><div class="wrap specs"><div class="stack" style="--s:16px"><h2 class="disp d2 c-orange" id="sp-h">The <b>details.</b></h2>' + (p.specLede ? '<p class="lede">' + esc(p.specLede).replace(". ", ".<br>") + "</p>" : "") + '</div><dl class="spec-table">' + specList(p).map(function (s) { return "<div><dt>" + esc(s[0]) + "</dt><dd>" + esc(s[1]) + "</dd></div>"; }).join("") + "</dl></div></section>" : "") +
      (isCrib && p.modes ? '<section class="sec" aria-labelledby="lv-h"><div class="wrap"><div class="sec-head"><h2 class="disp d2 c-orange" id="lv-h">' + esc(p.lives || "Every stage") + '. <b>One crib.</b></h2><a class="link" href="#/p/kit">The conversion kit</a></div><ol class="lives" role="list">' + p.modes.map(function (m, i) { return '<li class="rv" style="--d:' + i * .06 + 's"><img src="assets/stage-' + (i % 3 + 1) + '.webp" alt="" loading="lazy"><span class="n">0' + (i + 1) + '</span><b class="h4">' + esc(m.name) + '</b><span class="muted">' + esc(m.note) + "</span></li>"; }).join("") + "</ol></div></section>" : "") +
      (nurseries.length > 2 ? '<section class="sec" aria-labelledby="nu-h"><div class="wrap"><div class="sec-head"><h2 class="disp d2 c-orange" id="nu-h">In real <b>nurseries.</b></h2><p class="muted">How the ' + esc(p.name) + ' looks at home.</p></div><ul class="nu-grid" role="list">' + nurseries.map(function (src) { return '<li><img src="' + src + '" alt="The ' + esc(p.full) + ' in a nursery" loading="lazy"></li>'; }).join("") + "</ul></div></section>" : "") +
      (p.rating ? '<section class="sec bg-paper" id="reviews" aria-labelledby="rv-h"><div class="wrap"><div class="sec-head"><h2 class="disp d2 c-orange" id="rv-h">Parents on <b>' + esc(p.name) + '.</b></h2><div class="row" style="--s:10px"><button type="button" class="btn btn-primary sm" id="rvWrite">Write a review</button><a class="btn btn-secondary sm" href="#/reviews">All dadada reviews</a></div></div>' +
        '<div class="rv-pd"><div class="rv-pd-sum"><b>' + esc(p.rating) + "</b>" + V8.stars(p.rating) + '<span class="small muted">' + esc(p.reviewsNote || p.reviews + " reviews") + "</span></div>" +
        (reviews.length ? '<div class="rv-pd-list" id="rvList">' + reviews.map(function (q, i) { var who = (q[1] || "Verified buyer").replace(/\s*·\s*Verified buyer\s*$/i, ""); return '<figure class="rv-pd-item"' + (i > 3 ? " hidden" : "") + '><span class="rv-av" aria-hidden="true">' + esc(who.charAt(0)) + "</span><div>" + V8.stars(5) + "<blockquote>" + esc(q[0]) + '</blockquote><footer><b>' + esc(who) + '</b> <span class="rv-ver">✓ Verified buyer</span></footer></div></figure>'; }).join("") + "</div>" : '<p class="muted">Reviews for this piece are coming in from the store.</p>') +
        "</div>" + (reviews.length > 4 ? '<button type="button" class="btn btn-secondary" id="rvMore">Show all ' + reviews.length + " reviews</button>" : "") + "</div></section>" : "") +
      (p.faq ? '<section class="sec bg-paper" aria-labelledby="pf-h"><div class="wrap faqblock"><h2 class="disp d2 c-orange" id="pf-h">Good <b>to know.</b></h2><div class="acc">' + p.faq.map(function (f) { return "<details><summary>" + esc(f[0]) + '</summary><div class="acc-body">' + esc(f[1]) + "</div></details>"; }).join("") + "</div></div></section>" : "") +
      '<section class="sec" aria-labelledby="rl-h"><div class="wrap"><div class="sec-head"><h2 class="disp d2 c-orange" id="rl-h">You might <b>also like.</b></h2>' + (isCrib ? '<a class="link" href="#/compare">Compare all cribs</a>' : "") + '</div><div class="pgrid">' + related.map(function (x, i) { return V8.card(x, { d: i * .05 }); }).join("") + "</div></div></section>" +
      '<div class="sticky-buy" id="stickyBuy" aria-hidden="true"><span><b>' + esc(p.full) + '</b><span class="small muted" id="sbMeta">' + esc(p.finishes[0].name) + " · " + money(p.finishes[0].price) + '</span></span><button type="button" class="btn btn-primary" id="sbAdd" tabindex="-1">Add to bag</button></div>';
    return { title: p.full, html: html, after: function (root) {
      var more = $("#rvMore", root); if (more) more.addEventListener("click", function () { $$("#rvList [hidden]", root).forEach(function (f) { f.hidden = false; }); more.remove(); });
      var rw = $("#rvWrite", root); if (rw) rw.addEventListener("click", function () { V8.toast("Reviews are collected after delivery. We’ll email you a link."); });
      var asm = $("#pdAsm", root); if (asm) asm.addEventListener("change", function () { V8.setAssembly(asm.checked); });
      $$("[data-pwadd]", root).forEach(function (b) { b.addEventListener("click", function () { var id = b.dataset.pwadd; V8.add(id, b.hasAttribute("data-kit") ? kitF() : 0, 1); }); });
      var st = { f: 0, qty: 1, g: 0 };
      var img = $("#galImg", root), thumbs = $$("[data-g]", root);
      var vid = $("#galVid", root);
      function showG(i) { st.g = i; var g = gallery[i];
        img.hidden = !!g.video; vid.hidden = !g.video;
        if (g.video) { if (vid.dataset.v !== g.video) { vid.dataset.v = g.video; vid.poster = g.img; vid.innerHTML = '<source src="media/v/' + g.video + '.webm" type="video/webm"><source src="media/v/' + g.video + '.mp4" type="video/mp4">'; vid.load(); } var pp = vid.play(); if (pp && pp.catch) pp.catch(function () {}); vid.setAttribute("aria-label", g.alt); } else vid.pause();
        img.src = g.img; img.alt = g.alt; img.classList.toggle("photo", !g.cut); thumbs.forEach(function (t, k) { t.setAttribute("aria-pressed", k === i); }); }
      thumbs.forEach(function (t) { t.addEventListener("click", function () { showG(+t.dataset.g); }); });
      function setF(i) {
        st.f = i; var f = p.finishes[i];
        $$("[data-pf]", root).forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.pf === i); });
        $("#pdPrice", root).innerHTML = V8.priceHTML(p, i);
        var gi = gallery.findIndex(function (g) { return g.f === i; }); showG(gi > -1 ? gi : 0);
        $("#sbMeta", root).textContent = f.name + " · " + money(f.price);
        updAdd();
      }
      function kitF() { return kitId === "kit" ? ({ natural: 0, white: 1, walnut: 2 }[p.finishes[st.f].k] || 0) : 0; }
      function updAdd() { var t = p.finishes[st.f].price * st.qty; $$("[data-addon]:checked", root).forEach(function (c) { t += +c.dataset.price * st.qty; }); $("#pdAdd", root).textContent = "Add to bag · " + money(t); }
      $$("[data-pf]", root).forEach(function (b) { b.addEventListener("click", function () { setF(+b.dataset.pf); }); });
      $$("[data-addon]", root).forEach(function (c) { c.addEventListener("change", updAdd); });
      function add() { $$("[data-addon]:checked", root).forEach(function (c) { V8.add(c.dataset.addon, c.hasAttribute("data-kit") ? kitF() : 0, st.qty, { silent: true }); c.checked = false; }); V8.add(p.id, st.f, st.qty); updAdd(); }
      $("#pdAdd", root).addEventListener("click", add); $("#sbAdd", root).addEventListener("click", add);
      // sticky buy bar once the main button scrolls away (phones)
      var sb = $("#stickyBuy", root), sio = new IntersectionObserver(function (es) { var vis = !es[0].isIntersecting && es[0].boundingClientRect.top < 0; sb.classList.toggle("on", vis); sb.setAttribute("aria-hidden", !vis); $("#sbAdd", root).tabIndex = vis ? 0 : -1; });
      sio.observe($("#pdAdd", root));
      V8.onLeave(function () { sio.disconnect(); });
      updAdd();
    } };
  }
  V8.route("p/:id", product);
  D.order.cribs.concat(D.order.dressers).forEach(function (id) { V8.route(id, function () { return { redirect: "#/p/" + id }; }); V8.route("dressers/" + id, function () { return { redirect: "#/p/" + id }; }); });

  /* ---------- compare ---------- */
  /* ---------- dresser comparison (features from the live chart, prices from the catalogue) ---------- */
  V8.route("compare-dressers", function () {
    var C = D.dresserChart, ds = C.ids.map(function (k) { return P[k]; });
    var rows = [["Price", ds.map(function (d) { return (V8.hasRange(d) ? "From " : "") + money(V8.minPrice(d)); })], ["Rating", ds.map(function (d) { return d.rating ? d.rating + " · " + d.reviews + " reviews" : "—"; })]].concat(C.rows);
    var html = head({ crumbs: [["Home", "#/"], ["Dressers", "#/dressers"], ["Compare"]], h1: "Eight dressers. <b>Side by side.</b>", lede: "Every one is 34 inches tall with 15-inch-deep drawers and solid rubberwood legs and pulls. Here’s where they differ.", extra: '<label class="check"><input type="checkbox" id="cmpDiff"> Only show differences</label>' }) +
      '<section class="wrap" style="padding-bottom:var(--sec)"><div class="cmp-wrap"><table class="cmp" id="cmp"><thead><tr><th scope="col"><span class="sr">Feature</span></th>' + ds.map(function (d) { return '<th scope="col"><a href="' + V8.url(d) + '"><span class="im" style="display:block"><img src="' + d.finishes[0].img + '" alt=""></span><b class="h4" style="font-size:17px">' + esc(d.full) + "</b></a></th>"; }).join("") + "</tr></thead><tbody>" +
      rows.map(function (r) { var vals = r[1], same = vals.every(function (v) { return v === vals[0]; }); return '<tr data-same="' + same + '"><th scope="row">' + esc(r[0]) + "</th>" + vals.map(function (v) { return (vals.filter(function (x) { return x === v; }).length * 2 > vals.length ? "<td data-shared><span>" : "<td><span>") + esc(v) + "</span></td>"; }).join("") + "</tr>"; }).join("") +
      '<tr><th scope="row"></th>' + ds.map(function (d) { return '<td><a class="btn btn-primary sm" href="' + V8.url(d) + '">See ' + esc(d.name) + "</a></td>"; }).join("") + "</tr></tbody></table></div></section>" + quizBand();
    return { title: "Compare dressers", html: html, after: function (root) { $("#cmpDiff", root).addEventListener("change", function () { $("#cmp", root).classList.toggle("diff", this.checked); }); } };
  });

  /* ---------- reviews: live totals per piece, and what parents wrote ---------- */
  V8.route("reviews", function () {
    var rated = V8.all().filter(function (p) { return p.reviews; }).sort(function (a, b) { return b.reviews - a.reviews; });
    var total = rated.reduce(function (a, p) { return a + p.reviews; }, 0), avg = rated.reduce(function (a, p) { return a + p.reviews * +p.rating; }, 0) / total;
    var quotes = []; V8.all().forEach(function (p) { (p.quotes || []).forEach(function (q) { quotes.push({ p: p, t: q[0], who: q[1] }); }); });
    var html = head({ crumbs: [["Home", "#/"], ["Reviews"]], h1: "Parents <b>say it best.</b>", lede: "Honest reviews from the families who built a nursery around dadada." }) +
      '<section class="wrap" style="padding-bottom:clamp(32px,4vw,56px)"><div class="rv-top"><div class="rv-score"><b>' + avg.toFixed(1) + "</b><span>" + V8.stars(5) + '<br><span class="small muted">' + total + " verified reviews</span></span></div>" +
        '<ul class="rv-list" role="list">' + rated.map(function (p) { return '<li><a href="' + V8.url(p) + '"><span>' + esc(p.full) + '</span><span class="rv-bar" aria-hidden="true"><i style="width:' + Math.round(p.reviews / rated[0].reviews * 100) + '%"></i></span><span class="small muted">' + p.rating + " · " + p.reviews + "</span></a></li>"; }).join("") + "</ul></div></section>" +
      '<section class="sec bg-paper"><div class="wrap"><div class="revs-wall">' + quotes.map(function (q, i) { return '<figure class="rev rv" style="--d:' + (i % 6) * .05 + 's">' + V8.stars(5) + "<blockquote>" + esc(q.t) + "</blockquote><footer><b>" + esc(q.who) + '</b><a href="' + V8.url(q.p) + '">' + esc(q.p.full) + "</a></footer></figure>"; }).join("") + "</div></div></section>";
    return { title: "Reviews", html: html };
  });

  V8.route("compare", function () {
    var cribs = V8.list("crib"), keys = [];
    cribs.forEach(function (c) { (c.specs || []).forEach(function (s) { if (keys.indexOf(s[0]) < 0) keys.push(s[0]); }); });
    var rows = [["Price", function (c) { return V8.hasRange(c) ? "From " + money(V8.minPrice(c)) : money(V8.minPrice(c)); }], ["Type", function (c) { return c.kind; }], ["Rating", function (c) { return c.rating + " · " + c.reviews + " reviews"; }], ["Finishes", function (c) { return c.finishes.map(function (f) { return f.name; }).join(", "); }]]
      .concat(keys.map(function (k) { return [k, function (c) { var s = (c.specs || []).find(function (x) { return x[0] === k; }); return s ? s[1] : "—"; }]; }));
    var html = head({ crumbs: [["Home", "#/"], ["Cribs", "#/cribs"], ["Compare"]], h1: "Five cribs. <b>Side by side.</b>", lede: "All made in Italy, all solid beech, all GREENGUARD Gold. Here’s where they differ.", extra: '<label class="check"><input type="checkbox" id="cmpDiff"> Only show differences</label>' }) +
      '<section class="wrap" style="padding-bottom:var(--sec)"><div class="cmp-wrap"><table class="cmp" id="cmp"><thead><tr><th scope="col"><span class="sr">Feature</span></th>' + cribs.map(function (c) { return '<th scope="col"><a href="' + V8.url(c) + '"><span class="im" style="display:block"><img src="' + c.finishes[0].img + '" alt=""></span><b class="h4" style="font-size:17px">' + esc(c.full) + "</b></a></th>"; }).join("") + "</tr></thead><tbody>" +
      rows.map(function (r) { var vals = cribs.map(r[1]), same = vals.every(function (v) { return v === vals[0]; }); return '<tr data-same="' + same + '"><th scope="row">' + esc(r[0]) + "</th>" + vals.map(function (v) { return (vals.filter(function (x) { return x === v; }).length * 2 > vals.length ? "<td data-shared><span>" : "<td><span>") + esc(v) + "</span></td>"; }).join("") + "</tr>"; }).join("") +
      '<tr><th scope="row"></th>' + cribs.map(function (c) { return '<td><a class="btn btn-primary sm" href="' + V8.url(c) + '">See ' + esc(c.name) + "</a></td>"; }).join("") + "</tr></tbody></table></div></section>" + quizBand();
    return { title: "Compare cribs", html: html, after: function (root) { $("#cmpDiff", root).addEventListener("change", function () { $("#cmp", root).classList.toggle("diff", this.checked); }); } };
  });

  /* ---------- quiz ---------- */
  V8.route("quiz", function () {
    return { title: "Take the quiz", html: '<section class="qz" aria-live="polite"><div class="wrap qz-top"><a class="link" href="#/" style="border-color:transparent">' + svg.left.replace("<svg", '<svg width="18" height="18"') + ' Exit</a><div class="qz-bar" aria-hidden="true"><i id="qzBar" style="width:0"></i></div><span class="label" id="qzStep"></span></div><div class="wrap qz-body" id="qzBody"></div></section>', after: function (root) {
      var i = 0, picks = [], body = $("#qzBody", root);
      function step() {
        $("#qzBar", root).style.width = (i / D.quiz.length * 100) + "%";
        if (i >= D.quiz.length) return result();
        var q = D.quiz[i]; $("#qzStep", root).textContent = "Question " + (i + 1) + " of " + D.quiz.length;
        body.innerHTML = '<h1 class="disp d2" tabindex="-1" id="qzH">' + esc(q.q) + '</h1><p class="lede" style="color:rgba(255,255,255,.88)">' + esc(q.hint) + '</p><div class="qz-opts">' + q.o.map(function (o, k) { return '<button type="button" class="qz-opt" data-o="' + k + '" aria-pressed="' + (picks[i] === k) + '"><b>' + esc(o.t) + "</b><span>" + esc(o.s) + "</span></button>"; }).join("") + "</div>" + (i ? '<button type="button" class="link" id="qzBack" style="justify-self:start;color:#fff">← Back</button>' : "");
        $$(".qz-opt", body).forEach(function (b) { b.addEventListener("click", function () { picks[i] = +b.dataset.o; b.setAttribute("aria-pressed", "true"); setTimeout(function () { i++; step(); }, 220); }); });
        var bk = $("#qzBack", body); if (bk) bk.addEventListener("click", function () { i--; step(); });
        $("#qzH", body).focus({ preventScroll: true });
      }
      function result() {
        var score = {}; picks.forEach(function (k, qi) { var w = D.quiz[qi].o[k].w || {}; Object.keys(w).forEach(function (c) { score[c] = (score[c] || 0) + w[c]; }); });
        var ranked = D.order.cribs.slice().sort(function (a, b) { return (score[b] || 0) - (score[a] || 0); }), top = P[ranked[0]], next = P[ranked[1]];
        $("#qzStep", root).textContent = "Your match";
        // the crib, the dresser designed with it, and a way to put either or both in the bag
        var dr = P[D.sets[top.id]], cp = top.finishes[0].price, dp = dr ? dr.finishes[0].price : 0, both = Math.round((cp + dp) * .85);
        var pick = function (p, role, price, k) { return '<div class="qz-pick"><span class="qz-pick-im"><img src="' + p.finishes[0].img + '" alt=""></span><span class="qz-pick-tx"><small>' + role + "</small><b>" + esc(p.full) + '</b><span class="small">' + esc(p.finishes[0].name) + " · " + money(price) + ' · <a href="' + V8.url(p) + '">Details</a></span></span><button type="button" class="btn btn-light sm" data-qadd="' + k + '">Add</button></div>'; };
        body.innerHTML = '<div class="qz-result"><div class="qz-duo"><div class="im"><img src="' + top.finishes[0].img + '" alt="' + esc(top.full) + '"></div>' + (dr ? '<div class="im"><img src="' + dr.finishes[0].img + '" alt="' + esc(dr.full) + '"></div>' : "") + '</div><div class="stack" style="--s:20px"><span class="label">Your best fit</span><h1 class="disp d1" tabindex="-1" id="qzH">The <b>' + esc(top.name) + ".</b></h1><ul style=\"display:grid;gap:8px;padding-left:1.1em\">" + (top.why || []).map(function (w) { return "<li>" + esc(w) + "</li>"; }).join("") + "</ul>" +
          '<div class="qz-picks">' + pick(top, "Your crib", cp, "c") + (dr ? pick(dr, "The dresser that goes with it", dp, "d") : "") + "</div>" +
          '<div class="row" style="--s:12px">' + (dr ? '<button type="button" class="btn btn-lime lg" data-qadd="both">Add both · ' + money(both) + ' <s style="opacity:.6;font-weight:500;margin-left:6px">' + money(cp + dp) + "</s></button>" : '<button type="button" class="btn btn-lime lg" data-qadd="c">Add to bag · ' + money(cp) + "</button>") + '<button type="button" class="btn btn-light lg" id="qzAgain">Start over</button></div>' +
          (dr ? '<p class="small" style="color:rgba(255,255,255,.88)">Crib + dresser together are 15% off both, taken off in your bag.</p>' : "") +
          '<p>Close second: <a class="link" href="' + V8.url(next) + '" style="color:#fff">' + esc(next.full) + "</a></p></div></div>";
        $$("[data-qadd]", body).forEach(function (b) { b.addEventListener("click", function () { var k = b.dataset.qadd; if (k === "both") { V8.add(top.id, 0, 1, { silent: true }); V8.add(dr.id, 0, 1); } else V8.add(k === "c" ? top.id : dr.id, 0, 1); }); });
        $("#qzAgain", body).addEventListener("click", function () { i = 0; picks = []; step(); });
        $("#qzH", body).focus({ preventScroll: true });
      }
      step();
    } };
  });

  /* ---------- checkout ---------- */
  var STATES = ["Alabama", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
  function field(id, label, o) { o = o || {}; return '<div class="field' + (o.full ? " full" : "") + '"><label for="' + id + '">' + label + (o.opt ? ' <span class="muted" style="font-weight:400">Optional</span>' : "") + "</label>" + (o.select ? '<select class="select" id="' + id + '" ' + (o.opt ? "" : "required") + "><option value=\"\">Select</option>" + o.select.map(function (s) { return "<option>" + s + "</option>"; }).join("") + "</select>" : '<input class="input" id="' + id + '" type="' + (o.type || "text") + '" ' + (o.opt ? "" : "required") + (o.ac ? ' autocomplete="' + o.ac + '"' : "") + (o.ph ? ' placeholder="' + o.ph + '"' : "") + (o.im ? ' inputmode="' + o.im + '"' : "") + ">") + '<span class="err" hidden></span></div>'; }
  function summary() {
    var t = V8.totals(), S = V8.store;
    return '<div class="os-head"><h2 class="h4">Your order</h2><span class="muted small">' + t.count + (t.count === 1 ? " item" : " items") + '</span></div>' +
      '<ul class="os-lines" role="list">' + S.cart.map(function (c) { var l = V8.lineFor(c); return l ? '<li><span class="os-im"><img src="' + l.f.img + '" alt=""><i aria-label="Quantity">' + c.qty + '</i></span><span class="os-tx"><b>' + esc(l.p.full) + "</b><small>" + esc(l.f.name) + (c.b ? ' · <span class="li-tag">Bundle</span>' : "") + '</small></span><span class="os-p">' + money(l.price * c.qty) + "</span></li>" : ""; }).join("") + "</ul>" +
      V8.asmRow() +
      '<form class="os-code" onsubmit="return false"><label class="sr" for="coCode">Discount code</label><input class="input" id="coCode" placeholder="Discount code or gift card" autocomplete="off"><button type="button" class="btn btn-secondary sm" id="coApply">Apply</button></form>' +
      '<div class="os-rows"><div class="sum-row"><span>Subtotal</span><span>' + money(t.sub) + "</span></div>" + V8.discRows(t) +
      '<div class="sum-row"><span>Shipping</span><span>Free</span></div><div class="sum-row"><span>Taxes</span><span class="muted">Calculated at the next step</span></div></div>' +
      '<div class="os-total"><span>Total</span><span><small>USD</small> ' + money(t.total) + "</span></div>" +
      (t.disc ? '<p class="os-save">You’re saving ' + money(t.disc) + " on this order</p>" : "") +
      '<ul class="os-perks" role="list"><li>Free shipping to the 48 states</li><li>14-day returns</li><li>2-year crib warranty</li></ul>';
  }
  V8.route("checkout", function () {
    if (!V8.store.cart.length) return { title: "Checkout", html: head({ crumbs: [["Home", "#/"], ["Checkout"]], h1: "Your bag <b>is empty.</b>", lede: "Add a crib, a dresser or a set and come back here to check out.", extra: '<div class="row"><a class="btn btn-primary" href="#/cribs">Shop cribs</a><a class="btn btn-secondary" href="#/sets">Nursery sets</a></div>' }) + '<div style="height:var(--sec)"></div>' };
    var html = '<div class="wrap" style="padding-top:clamp(20px,2.4vw,36px)">' + crumbs([["Bag", "#/cribs"], ["Checkout"]]) + '<h1 class="disp d2 c-orange" style="margin-top:14px">Check<b>out.</b></h1></div>' +
      '<section class="wrap co" style="padding-block:clamp(24px,3vw,44px) var(--sec)"><form class="co-steps" id="coForm" novalidate>' +
        '<div class="co-step"><p class="label muted">Express checkout</p><div class="express"><button type="button" class="x-shop" data-x="Shop Pay">shop Pay</button><button type="button" class="x-pp" data-x="PayPal">PayPal</button><button type="button" class="x-gp" data-x="Google Pay">G Pay</button></div><p class="or">or pay with card</p></div>' +
        '<div class="co-step"><h2><span class="n">1</span>Contact</h2>' + field("coEmail", "Email", { type: "email", ac: "email", full: true }) + '<label class="check"><input type="checkbox" checked> Email me new pieces and nursery ideas, about once a month</label></div>' +
        '<div class="co-step"><h2><span class="n">2</span>Delivery</h2><p class="small muted">We ship to the contiguous 48 states.</p><div class="co-grid">' + field("coFirst", "First name", { ac: "given-name" }) + field("coLast", "Last name", { ac: "family-name" }) + field("coAddr", "Address", { ac: "address-line1", full: true }) + field("coApt", "Apartment, suite, floor", { opt: true, ac: "address-line2", full: true }) + field("coCity", "City", { ac: "address-level2" }) + field("coState", "State", { select: STATES }) + field("coZip", "ZIP code", { ac: "postal-code", im: "numeric" }) + field("coPhone", "Phone", { type: "tel", ac: "tel", opt: true }) + "</div>" +
          '<label class="ship-opt"><input type="radio" name="ship" checked> <span><b>Standard</b><br><span class="small muted">Ships in 1 business day · 3 to 7 days</span></span><span class="price">Free</span></label></div>' +
        '<div class="co-step"><h2><span class="n">3</span>Payment</h2><p class="small muted">All transactions are secure and encrypted.</p><div class="co-grid">' + field("coCard", "Card number", { ac: "cc-number", im: "numeric", ph: "1234 5678 9012 3456", full: true }) + field("coExp", "Expiry (MM / YY)", { ac: "cc-exp", ph: "MM / YY" }) + field("coCvc", "Security code", { ac: "cc-csc", im: "numeric" }) + field("coName", "Name on card", { ac: "cc-name", full: true }) + "</div></div>" +
        '<button class="btn btn-primary lg block" type="submit" id="coPay">Place order · ' + money(V8.totals().total) + '</button><p class="small muted">This is a prototype: no payment is taken and no order is sent.</p>' +
      '</form><aside class="co-sum" id="coSum" aria-label="Order summary">' + summary() + "</aside></section>";
    return { title: "Checkout", html: html, after: function (root) {
      var form = $("#coForm", root);
      $$(".express button", root).forEach(function (b) { b.addEventListener("click", function () { V8.toast(b.dataset.x + " isn’t connected in this prototype. Pay with a card below."); }); });
      form.addEventListener("submit", function (e) {
        e.preventDefault(); var bad = null;
        $$("input[required], select[required]", form).forEach(function (inp) {
          var ok = inp.value.trim() !== "" && (inp.type !== "email" || /^\S+@\S+\.\S+$/.test(inp.value)) && (inp.id !== "coZip" || /^\d{5}$/.test(inp.value.trim())) && (inp.id !== "coCard" || inp.value.replace(/\D/g, "").length >= 13);
          var err = inp.parentNode.querySelector(".err"); inp.setAttribute("aria-invalid", !ok); err.hidden = ok; err.textContent = ok ? "" : inp.type === "email" ? "Enter an email like name@example.com" : inp.id === "coZip" ? "Enter a 5-digit ZIP code" : inp.id === "coCard" ? "Enter the full card number" : "This field is required";
          if (!ok && !bad) bad = inp;
        });
        if (bad) { bad.focus(); return; }
        var t = V8.totals(), order = { no: "DD-" + String(Date.now()).slice(-6), email: $("#coEmail", root).value, name: $("#coFirst", root).value, total: t.total, count: t.count, asm: !!V8.store.asm };
        try { sessionStorage.setItem("dd8-order", JSON.stringify(order)); } catch (e2) {}
        V8.clearCart(); V8.setAssembly(false); location.hash = "#/thanks";
      });
      function wire() { var a = $("#coApply", root); if (a) a.addEventListener("click", function () { var v = $("#coCode", root).value.trim(); V8.toast(v ? "“" + v + "” isn’t a valid code in this prototype." : "Enter a code first."); }); }
      wire();
      V8.on("cart", function () { var s = $("#coSum", root); if (s && s.isConnected) { s.innerHTML = summary(); wire(); } });
    } };
  });
  V8.route("thanks", function () {
    var o = null; try { o = JSON.parse(sessionStorage.getItem("dd8-order")); } catch (e) {}
    return { title: "Thank you", html: '<section class="nf"><div class="wrap stack center">' + '<span class="label muted">' + (o ? "Order " + esc(o.no) : "Order received") + '</span><h1 class="disp d1 c-orange">Thank you' + (o && o.name ? ", <b>" + esc(o.name) + ".</b>" : "<b>.</b>") + '</h1><p class="lede" style="margin-inline:auto">' + (o ? "A confirmation is on its way to <b>" + esc(o.email) + "</b>. Your order ships within one business day, and we’ll email tracking as soon as it leaves." : "Your order is in.") + '</p>' + (o && o.asm ? '<div class="asm" style="max-width:520px;margin:8px auto 0;text-align:left"><span class="asm-ic" aria-hidden="true">' + svg.box + '</span><div><b>Book your assembly</b><span>Pick a time with a Taskrabbit pro, from $65. Have your order number handy.</span></div><a class="btn btn-primary sm" href="' + V8.TASKRABBIT + '" target="_blank" rel="noopener">Book a pro</a></div>' : "") + '<div class="row" style="justify-content:center"><a class="btn btn-primary" href="#/support/register">Register your crib</a><a class="btn btn-secondary" href="#/journal">Read the journal</a></div></div></section>' };
  });
})();
