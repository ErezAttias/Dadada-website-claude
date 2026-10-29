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
    dressers: { t: "Dressers", h1: "Bring the tiny socks.<br><b>We’ll bring the drawers.</b>", lede: "Eight dressers, every one 34 inches tall. Add a tray and it becomes your changing table.", items: function () { return V8.list("dresser"); },
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
      '<div class="pgrid" id="collGrid"></div><p class="coll-count mt-m" id="collCount" aria-live="polite"></p></section>' +
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
  function trays() { return '<section class="sec"><div class="wrap split"><div class="im rv"><img src="media/tray-detail.webp" alt="A beech changing tray with a linen pad and folded muslins on a cream dresser" loading="lazy"></div><div class="stack rv" style="--s:20px"><h2 class="disp d2 c-orange">Every dresser is a <b>changing table in waiting.</b></h2><p class="lede">All eight stand 34 inches tall. Add a tray on top for the diaper years, then lift it off and keep the dresser.</p><ul class="acc" role="list" style="list-style:none;padding:0"><li class="sum-row" style="padding:14px 0;border-bottom:1px solid var(--line)"><span>Soho, Bliss, Merry tray</span><b>$119</b></li><li class="sum-row" style="padding:14px 0;border-bottom:1px solid var(--line)"><span>Austin, Central Park, LaLa Big</span><b>$99</b></li><li class="sum-row" style="padding:14px 0;border-bottom:1px solid var(--line)"><span>LaLa Little</span><b>$69</b></li></ul></div></div></section>'; }
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
    var reviews = (p.quotes || []).slice(0, 3);
    var html = '<div class="wrap" style="padding-top:clamp(20px,2.4vw,36px)">' + crumbs([["Home", "#/"], coll, [p.full]]) + "</div>" +
      '<section class="wrap pdp" style="padding-block:clamp(20px,2.4vw,36px) var(--sec)" aria-labelledby="pd-h">' +
        '<div class="gal"><div class="gal-main" id="galMain"><img id="galImg" src="' + gallery[0].img + '" alt="' + esc(gallery[0].alt) + '"><video id="galVid" class="gal-vid" muted loop playsinline preload="none" hidden></video>' +
          "</div>" +
          '<div class="gal-thumbs" role="group" aria-label="Images">' + gallery.slice(0, 10).map(function (g, i) { return '<button type="button" aria-pressed="' + !i + '" data-g="' + i + '" aria-label="' + esc(g.alt) + '"' + (g.video ? ' class="is-vid"' : "") + '><img class="' + (g.cut ? "cut" : "") + '" src="' + g.img + '" alt="" loading="lazy"></button>'; }).join("") + "</div></div>" +
        '<div class="buy" id="buy">' +
          (p.awards ? '<div class="row" style="--s:6px">' + p.awards.map(function (a) { return '<span class="chip lime">' + esc(a) + "</span>"; }).join("") + "</div>" : p.was ? '<div class="row"><span class="chip orange">Sale</span></div>' : "") +
          '<h1 class="disp d2" id="pd-h">' + esc(p.full) + "</h1>" +
          '<p class="lede" style="margin-top:-8px">' + esc(p.tag || p.line || p.kind) + "</p>" +
          '<div class="buy-meta"><span id="pdPrice">' + V8.priceHTML(p, 0) + "</span>" + (p.rating ? '<a class="rating" href="#reviews">' + V8.stars(p.rating) + p.rating + " · " + p.reviews + " reviews</a>" : "") + "</div>" +
          (p.finishes.length > 1 ? '<div class="stack" style="--s:10px"><div class="fin-pills" role="group" aria-label="' + esc(p.opt || "Finish") + '">' + p.finishes.map(function (f, i) { return '<button type="button" class="fin-pill" aria-pressed="' + !i + '" data-pf="' + i + '">' + (f.sw ? '<i style="background:' + f.sw + '"></i>' : "") + esc(f.name) + (V8.hasRange(p) && p.type !== "gift" ? " · " + money(f.price) : "") + "</button>"; }).join("") + "</div></div>" : "") +
          (isCrib ? '<label class="addon"><input type="checkbox" id="addKit"><span><b>Add the toddler conversion kit</b><br><span class="small muted">Turns it into a toddler bed, then a daybed</span></span><span class="price">+' + money(p.kit || 120) + "</span></label>" : "") +
          '<div class="buy-row"><div class="qty lg" role="group" aria-label="Quantity"><button type="button" data-pq="-1" aria-label="Decrease">−</button><span id="pdQty">1</span><button type="button" data-pq="1" aria-label="Increase">+</button></div><button type="button" class="btn btn-primary lg" id="pdAdd">Add to bag</button>' + V8.wishBtn(p) + "</div>" +
          (set ? '<a class="addon" href="' + V8.url(set) + '" style="background:var(--paper);border-color:transparent"><img src="' + set.finishes[0].img + '" alt="" style="width:56px;height:56px;object-fit:contain;mix-blend-mode:multiply"><span><b>Make it a set · 15% off both</b><br><span class="small muted">With the ' + esc(set.full) + "</span></span><span class=\"price\">" + money(set.finishes[0].price) + "</span></a>" : "") +
          (p.fits ? '<p class="small">Fits the ' + p.fits.map(function (k) { return '<a class="link" href="' + V8.url(P[k]) + '">' + esc(P[k].full) + "</a>"; }).join(", ") + "</p>" : "") + (p.parts ? '<p class="small">Includes the ' + p.parts.map(function (k) { return '<a class="link" href="' + V8.url(P[k]) + '">' + esc(P[k].full) + "</a>"; }).join(" and ") + "</p>" : "") + (p.finalSale ? '<p class="small"><b>Final sale.</b> This item can’t be returned.</p>' : "") +
          (isTouch ? (p.priceNote ? '<p class="small muted">' + esc(p.priceNote) + "</p>" : "") : '<ul class="buy-perks" role="list"><li>Free shipping to the contiguous 48 states</li><li>Ships in 1 business day</li><li>14-day returns · ' + (isCrib ? "2-year" : "1-year") + " warranty</li><li>Made in Italy · solid wood</li></ul>") +
          '<div class="acc">' + (p.why && p.why.length ? '<details open><summary>Why parents pick it</summary><div class="acc-body"><ul>' + p.why.map(function (w) { return "<li>" + esc(w) + "</li>"; }).join("") + "</ul></div></details>" : p.feats && p.feats.length ? '<details open><summary>Details</summary><div class="acc-body"><ul>' + p.feats.map(function (w) { return "<li>" + esc(w) + "</li>"; }).join("") + "</ul></div></details>" : "") +
          (isTouch ? "" : '<details><summary>Shipping &amp; returns</summary><div class="acc-body">Free delivery to the contiguous 48 states, shipped within one business day. Return within 14 days of delivery, unused and in the original packaging; a 20% restocking fee applies. <a class="link" href="#/support/returns">Full policy</a></div></details>') +
          (isCrib ? '<details><summary>Safety</summary><div class="acc-body">' + esc(D.safe) + "</div></details>" : "") + "</div>" +
        "</div>" +
      "</section>" +
      (isCrib && p.modes ? '<section class="sec bg-paper" aria-labelledby="lv-h"><div class="wrap"><div class="sec-head"><h2 class="disp d2 c-orange" id="lv-h">' + esc(p.lives || "Every stage") + '. <b>One crib.</b></h2><a class="link" href="#/p/kit">The conversion kit</a></div><ol class="lives" role="list">' + p.modes.map(function (m, i) { return '<li class="rv" style="--d:' + i * .06 + 's"><img src="assets/stage-' + (i % 3 + 1) + '.webp" alt="" loading="lazy"><span class="n">0' + (i + 1) + '</span><b class="h4">' + esc(m.name) + '</b><span class="muted">' + esc(m.note) + "</span></li>"; }).join("") + "</ol></div></section>" : "") +
      (specList(p).length ? '<section class="sec' + (isCrib && p.modes ? "" : " bg-paper") + '" aria-labelledby="sp-h"><div class="wrap specs"><div class="stack" style="--s:16px"><h2 class="disp d2 c-orange" id="sp-h">The <b>details.</b></h2>' + (p.specLede ? '<p class="lede">' + esc(p.specLede) + "</p>" : "") + '</div><dl class="spec-table">' + specList(p).map(function (s) { return "<div><dt>" + esc(s[0]) + "</dt><dd>" + esc(s[1]) + "</dd></div>"; }).join("") + "</dl></div></section>" : "") +
      (reviews.length ? '<section class="sec bg-paper" id="reviews" aria-labelledby="rv-h"><div class="wrap"><div class="sec-head"><h2 class="disp d2 c-orange" id="rv-h">Parents on <b>' + esc(p.name) + '.</b></h2><div class="revs-sum"><b>' + esc(p.rating) + "</b><span>" + V8.stars(p.rating) + '<br><span class="small muted">' + esc(p.reviewsNote || p.reviews + " reviews") + '</span></span></div></div>' +
        '<div class="rev-slider" role="region" aria-roledescription="carousel" aria-label="Reviews"><div class="rev-track" id="revTrack">' + reviews.map(function (q, i) { return '<figure class="rev-slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + " of " + reviews.length + '">' + V8.stars(5) + "<blockquote>" + esc(q[0]) + "</blockquote><footer>" + esc(q[1]) + "</footer></figure>"; }).join("") + "</div>" +
        (reviews.length > 1 ? '<div class="rev-nav"><button type="button" class="round" id="revPrev" aria-label="Previous review">' + svg.left + '</button><span class="rev-count" id="revCount" aria-live="polite">1 / ' + reviews.length + '</span><button type="button" class="round" id="revNext" aria-label="Next review">' + svg.right + "</button></div>" : "") + "</div></div></section>" : "") +
      (p.faq ? '<section class="sec bg-paper" aria-labelledby="pf-h"><div class="wrap faqblock"><h2 class="disp d2 c-orange" id="pf-h">Good <b>to know.</b></h2><div class="acc">' + p.faq.map(function (f) { return "<details><summary>" + esc(f[0]) + '</summary><div class="acc-body">' + esc(f[1]) + "</div></details>"; }).join("") + "</div></div></section>" : "") +
      '<section class="sec" aria-labelledby="rl-h"><div class="wrap"><div class="sec-head"><h2 class="disp d2 c-orange" id="rl-h">You might <b>also like.</b></h2>' + (isCrib ? '<a class="link" href="#/compare">Compare all cribs</a>' : "") + '</div><div class="pgrid">' + related.map(function (x, i) { return V8.card(x, { d: i * .05 }); }).join("") + "</div></div></section>" +
      '<div class="sticky-buy" id="stickyBuy" aria-hidden="true"><span><b>' + esc(p.full) + '</b><span class="small muted" id="sbMeta">' + esc(p.finishes[0].name) + " · " + money(p.finishes[0].price) + '</span></span><button type="button" class="btn btn-primary" id="sbAdd" tabindex="-1">Add to bag</button></div>';
    return { title: p.full, html: html, after: function (root) {
      // reviews: one per slide; arrows, swipe or scroll, with a counter
      var rt = $("#revTrack", root);
      if (rt && $("#revNext", root)) {
        var rn = rt.children.length, ri = function () { return Math.round(rt.scrollLeft / rt.clientWidth); };
        var rgo = function (d) { var i = (ri() + d + rn) % rn; rt.scrollTo({ left: i * rt.clientWidth, behavior: "smooth" }); };
        $("#revPrev", root).addEventListener("click", function () { rgo(-1); });
        $("#revNext", root).addEventListener("click", function () { rgo(1); });
        rt.addEventListener("scroll", function () { $("#revCount", root).textContent = ri() + 1 + " / " + rn; }, { passive: true });
      }
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
      function updAdd() { var kit = $("#addKit", root), t = p.finishes[st.f].price * st.qty + (kit && kit.checked ? (p.kit || 120) : 0); $("#pdAdd", root).textContent = "Add to bag · " + money(t); }
      $$("[data-pf]", root).forEach(function (b) { b.addEventListener("click", function () { setF(+b.dataset.pf); }); });
      $$("[data-pq]", root).forEach(function (b) { b.addEventListener("click", function () { st.qty = Math.max(1, Math.min(9, st.qty + +b.dataset.pq)); $("#pdQty", root).textContent = st.qty; updAdd(); }); });
      var kit = $("#addKit", root); if (kit) kit.addEventListener("change", updAdd);
      function add() { var k = $("#addKit", root); if (k && k.checked) { var kf = { natural: 0, white: 1, walnut: 2 }[p.finishes[st.f].k] || 0; V8.add(kitId, kitId === "kit" ? kf : 0, st.qty, { silent: true }); } V8.add(p.id, st.f, st.qty); }
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
        body.innerHTML = '<div class="qz-result"><div class="im"><img src="' + top.finishes[0].img + '" alt="' + esc(top.full) + '"></div><div class="stack" style="--s:20px"><span class="label">Your best fit</span><h1 class="disp d1" tabindex="-1" id="qzH">The <b>' + esc(top.name) + ".</b></h1><ul style=\"display:grid;gap:8px;padding-left:1.1em\">" + (top.why || []).map(function (w) { return "<li>" + esc(w) + "</li>"; }).join("") + '</ul><p class="price" style="font-size:24px">' + V8.priceHTML(top) + '</p><div class="row" style="--s:12px"><a class="btn btn-lime lg" href="' + V8.url(top) + '">See the ' + esc(top.name) + '</a><button type="button" class="btn btn-light lg" id="qzAgain">Start over</button></div><p>Close second: <a class="link" href="' + V8.url(next) + '" style="color:#fff">' + esc(next.full) + "</a></p></div></div>";
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
    return '<h2 class="h4">Your order</h2>' + S.cart.map(function (c) { var l = V8.lineFor(c); return l ? '<div class="line-item" style="grid-template-columns:64px 1fr auto"><span class="li-img" style="width:64px;height:64px;background:#fff"><img src="' + l.f.img + '" alt=""></span><div><b class="li-name">' + esc(l.p.full) + '</b><div class="li-meta">' + esc(l.f.name) + " · Qty " + c.qty + '</div></div><b class="price">' + money(l.price * c.qty) + "</b></div>" : ""; }).join("") +
      '<div class="sum-row"><span>Subtotal</span><span class="price">' + money(t.sub) + "</span></div>" + (t.disc ? '<div class="sum-row" style="color:var(--orange-ink);font-weight:700"><span>Nursery set · 15% off</span><span>−' + money(t.disc) + "</span></div>" : "") +
      '<div class="sum-row"><span>Shipping</span><span>Free</span></div><div class="sum-row"><span>Taxes</span><span class="muted">Added at confirmation</span></div><div class="sum-row total"><span>Total</span><span class="price">' + money(t.total) + "</span></div>" +
      (t.disc ? '<p class="small" style="color:var(--orange-ink);font-weight:700">You’re saving ' + money(t.disc) + " with the nursery set.</p>" : "") +
      '<ul class="buy-perks" role="list" style="background:#fff"><li>Free shipping to the 48 states</li><li>14-day returns</li><li>2-year crib warranty</li></ul>';
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
        var t = V8.totals(), order = { no: "DD-" + String(Date.now()).slice(-6), email: $("#coEmail", root).value, name: $("#coFirst", root).value, total: t.total, count: t.count };
        try { sessionStorage.setItem("dd8-order", JSON.stringify(order)); } catch (e2) {}
        V8.clearCart(); location.hash = "#/thanks";
      });
      V8.on("cart", function () { var s = $("#coSum", root); if (s && s.isConnected) s.innerHTML = summary(); });
    } };
  });
  V8.route("thanks", function () {
    var o = null; try { o = JSON.parse(sessionStorage.getItem("dd8-order")); } catch (e) {}
    return { title: "Thank you", html: '<section class="nf"><div class="wrap stack center">' + '<span class="label muted">' + (o ? "Order " + esc(o.no) : "Order received") + '</span><h1 class="disp d1 c-orange">Thank you' + (o && o.name ? ", <b>" + esc(o.name) + ".</b>" : "<b>.</b>") + '</h1><p class="lede" style="margin-inline:auto">' + (o ? "A confirmation is on its way to <b>" + esc(o.email) + "</b>. Your order ships within one business day, and we’ll email tracking as soon as it leaves." : "Your order is in.") + '</p><div class="row" style="justify-content:center"><a class="btn btn-primary" href="#/support/register">Register your crib</a><a class="btn btn-secondary" href="#/journal">Read the journal</a></div></div></section>' };
  });
})();
