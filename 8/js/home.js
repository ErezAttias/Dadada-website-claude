/* dadada V8 · home page */
(function () {
  "use strict";
  var V8 = window.V8, D = window.DD, P = V8.P, $ = V8.$, $$ = V8.$$, esc = V8.esc, money = V8.money, svg = V8.svg;

  var TOTAL_REVIEWS = V8.list("crib").reduce(function (a, p) { return a + (p.reviews || 0); }, 0);
  var TABS = { cribs: ["soho", "bliss", "lala", "spirit"], dressers: ["soho5", "merry", "bliss6", "cp"], kids: ["muse", "shelf", "tower", "fun"] };
  var LOGOS = [["brand-1", "Babylist"], ["brand-2", "Target"], ["brand-3", "Amazon"], ["brand-4", "Wayfair"], ["brand-5", "Albee Baby"], ["brand-6", "Modern Nursery"], ["brand-7", "Macklem's"]];
  var CERTS = [
    ["certs-bg", "55% 45%", "Clean air", "cert-gg", "GREENGUARD Gold", "Tested for more than 10,000 chemicals and VOCs, so the nursery air stays clean."],
    ["solid-bg", "28% 50%", "Solid wood", "cert-tree", "European beech", "Kiln-dried solid beech, all the way through. No MDF, particleboard or plastic fillers."],
    ["stage-1", "64% 50%", "Safe finish", "cert-leaf", "Non-toxic", "Water-based finishes, free of lead, phthalates and formaldehyde."],
    ["toddler", "50% 40%", "Safety tested", "cert-astm", "CPSC and ASTM", "Meets U.S. mandatory crib standards, and exceeds CPSC, ASTM and Health Canada."],
    ["room-4", "30% 50%", "Best crib", "cert-babylist", "Babylist 2023", "The Soho crib was named Best Modern Crib by Babylist."]
  ];
  // the V4 "happy homes" reel: films, photos and written reviews side by side
  // [kind, media or stars, caption or quote, product id, by]
  var ROOMS = [
    ["v", "ugc-bliss", "Her nursery reveal", "bliss"],
    ["q", 5, "Assembly was quick and straightforward, and the crib feels incredibly sturdy and well-made.", "soho", "Holly K."],
    ["p", "ugc-soho-photo", "Almond milk + walnut", "soho"],
    ["q", 5, "This is my second nursery using dadada Baby… The Jolly crib is even more beautiful in person.", "jolly", "Leah V. D."],
    ["v", "ugc-soho-build", "Build day, dog supervising", "soho"],
    ["q", 5, "I have this crib in walnut and absolutely love it! … I recommend to friends and will be repurchasing for next baby!", "bliss", "Jade L."],
    ["p", "ugc-bliss6-photo", "Changing station, sorted", "bliss6"],
    ["q", 5, "Even more beautiful in person than it looks online… the assembly instructions were clear and easy to follow.", "lalabig", "Chelsea"],
    ["v", "ugc-jolly", "A jungle nursery", "jolly"],
    ["q", 5, "I love that the crib grows with her as she gets older. The quality is great and it was super easy to put together.", "soho", "Megan"],
    ["v", "ugc-soho-nursery", "Leopard walls, calm crib", "soho"],
    ["q", 5, "We LOVE LOVE LOVE our LaLa crib. Absolutely beautiful, such high quality.", "lala", "Pamela L."],
    ["v", "ugc-lala", "Unboxed and built together", "lala"],
    ["q", 5, "We live in a small apartment, and I love how we managed to fit such a cute setup into our bedroom.", "spirit", "Aziza B."]
  ];
  // per-card size and line positions of the hover words, from the original V8 (--fs in px at a 314px card)
  var CERTFX = ["--fs:117.9;--t:38%;--bt:70%", "--fs:117.9;--t:35%;--bt:72%", "--fs:98.2;--t:42%;--bt:70%", "--fs:98.2;--t:34%;--bt:72%", "--fs:147.3;--t:40%;--bt:70%"];
  var FAN = [["ugc-jolly", -2, 30, -9, .82], ["ugc-bliss", -1, 12, -5, .92], ["ugc-soho-nursery", 0, 0, 0, 1], ["ugc-lala", 1, 12, 5, .92], ["ugc-soho-build", 2, 30, 9, .82]];
  var STAGES = [["stage-1", "62% 50%", "Newborn", "A safe space for all their first moments.", "Crib · included"], ["stage-2", "60% 50%", "Toddler", "One side comes down. Independence goes up.", "Conversion kit · $120"], ["stage-3", "52% 50%", "Day bed", "The crib years end. Their bed stays.", "Same kit · nothing extra"]];

  var CATS = [["cribs", "Cribs", "room-soho-brownstone.jpg", "crib"], ["dressers", "Dressers", "s-soho5.jpg", "dresser"], ["kids", "Toddler &amp; kids", "stl-kids.jpg", "kids"], ["sets", "Nursery sets", "mom-dr-soho.jpg", null]];
  function tabCards(key) { return TABS[key].map(function (id, i) { return V8.card(P[id], { d: i * .06 }); }).join(""); }

  V8.pages.home = function () {
    var soho = P.soho, soho5 = P.soho5, setSub = soho.finishes[0].price + soho5.finishes[0].price, setTot = setSub * .85;
    var quotes = [["soho", 1], ["soho", 0], ["bliss", 0]].map(function (q) { var p = P[q[0]]; var qq = (p.quotes || [])[q[1]] || p.quote; return qq ? { p: p, t: qq[0], who: qq[1] } : null; }).filter(Boolean);
    var faq = D.faqs[0].items.concat(D.faqs[1] ? D.faqs[1].items.slice(0, 1) : []);
    var html =
      // hero
      '<section class="hero" aria-label="Introduction">' +
        '<div class="hero-media"><img src="../img/mom-first.jpg" alt="" fetchpriority="high"><video id="heroVid" muted loop playsinline preload="none" poster="../img/mom-first.jpg" aria-label="A dadada film: expectant mothers at home with their cribs"><source data-src="../video/mom.webm" type="video/webm"><source data-src="../video/mom.mp4" type="video/mp4"></video></div>' +
        '<div class="wrap hero-in">' +
          '<h1 class="disp d1"><span class="ln">Bring your <b>personality.</b></span><span class="ln">We’ll bring <b>the crib.</b></span></h1>' +
          '<div class="hero-foot"><p class="lede">Italian made cribs, made from solid beechwood. <br>Designed to look as good as the home around them.</p>' +
          '<div class="hero-cta"><span class="rating">' + V8.stars(5) + "4.9 · " + TOTAL_REVIEWS + ' reviews</span><a class="btn btn-lime lg" href="#/cribs">Shop cribs <span class="ar" aria-hidden="true">→</span></a></div></div>' +
        "</div>" +
      "</section>" +
      // retailers
      '<section class="logos" aria-label="Also sold at"><div class="logos-row">' + [0, 1].map(function (k) { return LOGOS.map(function (l) { return '<img src="assets/' + l[0] + '.png" alt="' + (k ? "" : l[1]) + '"' + (k ? ' aria-hidden="true"' : "") + ' loading="lazy">'; }).join(""); }).join("") + "</div></section>" +
      // manifesto
      '<section class="sec"><div class="wrap mani"><div><h2 id="mani">A room without a <em>crib</em> is not a <em>nursery</em>, and a nursery without <em>you</em> isn’t your child’s <span class="nowrap"><em>home</em>.' + V8.doodle("dd-heart-o") + '</span></h2></div><div class="mani-img rv"><img src="assets/nursery.webp" alt="A mother-to-be playing records on the floor of her nursery, a natural crib behind her" loading="lazy"></div></div></section>' +
      // best sellers
      '<section class="sec" id="best" aria-labelledby="best-h"><div class="wrap">' +
        '<div class="modes" role="tablist" aria-label="Browse by"><button type="button" role="tab" aria-selected="true" aria-controls="bestPanel" data-mode="best" data-h="Our <b>best sellers.</b>">Best sellers</button><button type="button" role="tab" aria-selected="false" aria-controls="catPanel" data-mode="cats" data-h="Shop by <b>category.</b>" tabindex="-1">Shop by category</button></div>' +
        '<div class="sec-head"><h2 class="disp d2 c-orange" id="best-h" aria-live="polite">Our <b>best sellers.</b></h2>' +
        '<div class="row" style="--s:18px" id="bestCtl"><div class="seg" role="tablist" aria-label="Best sellers by category" id="bestTabs"><button type="button" role="tab" aria-selected="true" data-tab="cribs">Cribs</button><button type="button" role="tab" aria-selected="false" data-tab="dressers">Dressers</button><button type="button" role="tab" aria-selected="false" data-tab="kids">Kids</button></div></div></div>' +
        '<div id="bestPanel" role="tabpanel"><div class="pgrid" id="bestGrid">' + tabCards("cribs") + "</div></div>" +
        '<div id="catPanel" role="tabpanel" hidden><div class="pgrid">' + CATS.map(function (c) { var ps = c[3] ? V8.list(c[3]) : null; return '<a class="ccard" href="#/' + c[0] + '"><span class="ccard-im"><img src="../img/' + c[2] + '" alt="" loading="lazy"></span><span class="ccard-body"><span class="ccard-kick">' + (ps ? ps.length + (ps.length === 1 ? " piece" : " pieces") : "Crib + dresser") + '</span><b class="ccard-name">' + c[1] + '</b><span class="ccard-sub">' + (ps ? "From " + money(Math.min.apply(null, ps.map(V8.minPrice))) : "15% off both") + ' <span aria-hidden="true">→</span></span></span></a>'; }).join("") + "</div></div>" +
      "</div></section>" +
      // promises
      '<section class="sec tight promise-sec" aria-label="Our promises"><div class="wrap"><ul class="promise" role="list">' +
        [[svg.truck, "Free shipping", "To the contiguous 48 states"], [svg.box, "Ships in 1 business day", "From our U.S. warehouse"], [svg.back, "14-day returns", "From delivery, in new condition"], [svg.shield, "2-year crib warranty", "Built to be handed down"]].map(function (x, i) { return '<li class="rv" style="--d:' + i * .06 + 's"><span class="pi">' + x[0] + "</span><span><b>" + x[1] + "</b><span>" + x[2] + "</span></span></li>"; }).join("") +
      "</ul></div></section>" +
      // shop the look
      '<section class="stl" id="stl" aria-roledescription="carousel" aria-labelledby="stl-h">' +
        '<div class="stl-head"><h2 class="disp d3" id="stl-h">Shop <b>the look.</b></h2><p>Pick a dot to see the piece</p></div>' +
        '<div class="stl-track" id="stlTrack">' + D.looks.map(function (l, i) {
          return '<div class="stl-room" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + " of " + D.looks.length + ": " + esc(l.name) + '"' + (i ? ' aria-hidden="true"' : "") + '><img src="' + l.img + '" alt="' + esc(l.alt) + '" loading="' + (i ? "lazy" : "eager") + '"><div class="hots">' +
            l.items.map(function (it, j) { var p = P[it.id]; return p ? '<button type="button" class="hot" style="left:' + it.x + "%;top:" + it.y + '%" data-look="' + i + '" data-item="' + j + '" aria-label="' + esc(p.full) + '" aria-expanded="false"' + (i ? ' tabindex="-1"' : "") + "></button>" : ""; }).join("") + "</div></div>";
        }).join("") + "</div>" +
        '<div class="hot-card" id="hotCard" hidden></div>' +
        '<div class="stl-ui"><span class="stl-cap" aria-live="polite"><span class="n" id="stlNum">01 / 0' + D.looks.length + '</span><span id="stlName">' + esc(D.looks[0].name) + '</span></span><div class="stl-arrows"><button type="button" class="round" id="stlPrev" aria-label="Previous room">' + svg.left + '</button><button type="button" class="round" id="stlNext" aria-label="Next room">' + svg.right + "</button></div></div>" +
      "</section>" +
      // certifications
      '<section class="sec" id="safe" aria-labelledby="safe-h"><div class="wrap">' +
        '<div class="sec-head"><div><h2 class="disp d2 c-orange" id="safe-h">Made safe,<br><b>made to last.</b></h2></div><div class="stack" style="--s:14px;max-width:44ch"><p class="lede">Every dadada crib is built by hand from solid beech, then tested by the people whose job is to be picky.</p><a class="link" href="#/safety">How we test <span class="ar" aria-hidden="true">→</span></a></div></div>' +
        '<ul class="certs-row" role="list">' + CERTS.map(function (c, i) { return '<li class="cert rv" style="--d:' + i * .07 + 's;' + CERTFX[i] + '"><div class="cert-arch"><img class="cert-pic" src="assets/' + c[0] + '.webp" alt="" style="object-position:' + c[1] + '" loading="lazy"><span class="cert-big" aria-hidden="true"><span class="w1">' + c[2].split(" ")[0] + '</span><img class="cert-cut" src="assets/' + (c[0] === "solid-bg" ? "cut-solid" : "cut-" + c[0]) + '.webp" alt="" style="object-position:' + c[1] + '" loading="lazy"><span class="w2">' + c[2].split(" ").slice(1).join(" ") + '</span></span></div><span class="cert-mark"><img src="assets/' + c[3] + '.png" alt=""></span><h3 class="label">' + c[4] + '</h3><p class="body small">' + c[5] + "</p></li>"; }).join("") + "</ul>" +
        '<p class="scroll-hint">Swipe for more ' + svg.right.replace("<svg", '<svg width="16" height="16"') + "</p>" +
      "</div></section>" +
      // nursery set offer
      '<section class="sec joined" aria-labelledby="set-h"><div class="wrap"><div class="setband rv">' +
        '<div class="setband-img"><img src="../img/mom-dr-soho.jpg" alt="An expecting mother folding tiny clothes into a Soho dresser beside a Soho crib" loading="lazy"></div>' +
        '<div class="setband-copy"><span class="label" style="color:var(--lime)">Nursery sets</span><h2 class="disp d2" id="set-h">Crib + dresser.<br><b>15% off both.</b></h2><p class="lede">Pair any crib with any dresser and the saving comes off both pieces at checkout. Matching woods, one delivery.</p>' +
        '<ul role="list"><li><span>Soho crib, Natural</span><span>' + money(soho.finishes[0].price) + "</span></li><li><span>Soho 5-drawer dresser</span><span>" + money(soho5.finishes[0].price) + '</span></li><li class="tot"><span>The Soho set</span><span><s>' + money(setSub) + "</s>" + money(setTot, true) + "</span></li></ul>" +
        '<div class="row" style="--s:14px"><button type="button" class="btn btn-lime" id="addSet">Add the Soho set</button><a class="btn btn-light" href="#/sets">See all sets</a></div></div>' +
      "</div></div></section>" +
      // 10,000 homes
      '<section class="sec homes bg-paper" id="homes" aria-labelledby="homes-h"><div class="wrap homes-head"><h2 class="disp d2 c-orange" id="homes-h">+<span id="homesN">10,000</span> homes<br><b>made room for dadada.</b></h2></div>' +
        '<div class="fan" id="fan">' + FAN.map(function (f) { var r = ROOMS.find(function (x) { return x[1] === f[0]; }); return '<button type="button" class="fc" data-reel="' + f[0] + '" aria-label="Watch: ' + esc(r ? r[2] : "a dadada nursery") + '" style="--x:calc(' + f[1] + ' * clamp(120px, 15vw, 270px));--y:' + f[2] + "px;--r:" + f[3] + "deg;--s:" + f[4] + ";z-index:" + (10 - Math.abs(f[1])) + '"><video muted loop playsinline preload="none" poster="../img/' + f[0] + '.jpg" aria-hidden="true"><source data-src="../video/' + f[0] + '.webm" type="video/webm"><source data-src="../video/' + f[0] + '.mp4" type="video/mp4"></video><span class="fc-play" aria-hidden="true"></span></button>'; }).join("") + "</div>" +
        rowHTML() +
        '<div class="center mt-l" style="display:grid" id="fanCtl"><button type="button" class="btn btn-secondary sm" id="fanToggle" aria-pressed="false">Pause the films</button></div>' +
      "</section>" +
      // reviews
      '<section class="sec" aria-labelledby="rev-h"><div class="wrap"><div class="sec-head"><h2 class="disp d2 c-orange" id="rev-h">Parents <b>say it best.</b></h2><div class="revs-sum"><b>4.9</b><span>' + V8.stars(5) + '<br><span class="small muted">' + TOTAL_REVIEWS + " reviews across our cribs</span></span></div></div>" +
        '<div class="revs">' + quotes.map(function (q, i) { return '<figure class="rev rv" style="--d:' + i * .08 + 's">' + V8.stars(5) + "<blockquote>" + esc(q.t) + '</blockquote><footer><b>' + esc(q.who) + '</b><a href="' + V8.url(q.p) + '">' + esc(q.p.full) + "</a></footer></figure>"; }).join("") + "</div>" +
      "</div></section>" +
      // toddler stages
      '<section class="sec bg-paper" id="toddler" aria-labelledby="tod-h"><div class="wrap tod">' +
        '<div class="tod-imgs rv" id="todImgs">' + STAGES.map(function (s, i) { return '<img class="' + (i ? "" : "on") + '" src="assets/' + s[0] + '.webp" alt="' + s[2] + ' stage" style="object-position:' + s[1] + '" loading="lazy">'; }).join("") + "</div>" +
        '<div><h2 class="disp d2 c-orange" id="tod-h">The toddler bed<br><b class="nowrap">you don’t buy.</b></h2><p class="lede mt-m">One crib, three stages. When they’re ready, a $120 kit turns it into a toddler bed, and later a day bed.</p>' +
        '<div class="stages" role="tablist" aria-label="Crib stages">' + STAGES.map(function (s, i) { return '<button type="button" class="stage" role="tab" aria-selected="' + !i + '" data-stage="' + i + '"><b>' + s[2] + "</b><em>" + s[4] + "</em><span>" + s[3] + "</span></button>"; }).join("") + "</div>" +
        '<div class="row mt-m" style="--s:18px"><a class="btn btn-primary" href="#/cribs">Shop convertible cribs</a></div></div>' +
      "</div></section>" +
      // journal
      '<section class="sec" aria-labelledby="jr-h"><div class="wrap"><div class="sec-head"><h2 class="disp d2 c-orange" id="jr-h">Read up. <b>Rest easy.</b></h2><a class="link" href="#/journal">All stories</a></div><div class="jgrid scroll">' +
        D.journal.slice(0, 3).map(function (j, i) { return V8.jcard(j, i); }).join("") + "</div></div>" +
      // faq, in the same white section as the journal
      '<div class="wrap faqblock"><div class="stack" style="--s:18px"><h2 class="disp d2 c-orange" id="fq-h">Little questions.<br><b class="nowrap">Straight answers.</b></h2><p class="lede">Mattresses, conversions, delivery. The things parents ask us most.</p></div>' +
        '<div class="acc">' + faq.map(function (x) { return "<details><summary>" + esc(x.q) + '</summary><div class="acc-body">' + esc(x.a) + "</div></details>"; }).join("") + "</div></div></section>" +
      // quiz band
      '<section class="bg-orange quizband" aria-labelledby="qz-h">' + V8.doodle("dd-sun", "dd-sun") + V8.doodle("dd-star", "dd-star") +
        '<h2 class="disp d2" id="qz-h">Not sure <b>which crib?</b></h2><p>Four quick questions about your space and style.</p><a class="btn btn-lime lg" href="#/quiz">Take the 60-second quiz</a></section>';
    return { home: true, html: html, after: homeAfter };
  };

  V8.jcard = function (j, i) { return '<article class="jcard rv" style="--d:' + (i || 0) * .07 + 's"><div class="im"><img src="' + j.hero + '" alt="' + esc(j.alt) + '" style="object-position:' + (j.pos || "50% 50%") + '" loading="lazy"></div><div class="meta"><span class="chip line">' + esc(j.cat) + "</span><span>" + j.read + ' min read</span></div><h3><a href="#/journal/' + j.id + '">' + esc(j.title) + "</a></h3></article>"; };

  function loadVideo(v) { if (v.dataset.loaded) return; $$("source", v).forEach(function (s) { s.src = s.dataset.src; }); v.load(); v.dataset.loaded = 1; }
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // the films unfold in place into a row of films, photos and reviews (from V4)
  function rowHTML() {
    var P = V8.P;
    return '<div class="hrow" id="hrow" hidden><div class="wrap hrow-bar"><span class="small muted"><b>' + V8.stars(5) + ' 4.9</b> · ' + TOTAL_REVIEWS + ' verified reviews</span><div class="hrow-nav"><button type="button" class="icon-btn" data-rv="-1" aria-label="Previous" aria-controls="hrowTrack">' + V8.svg.left + '</button><button type="button" class="icon-btn" data-rv="1" aria-label="Next" aria-controls="hrowTrack">' + V8.svg.right + '</button><button type="button" class="btn btn-secondary sm" id="hrowFold">Fold the films</button></div></div>' +
      '<div class="hrow-track" id="hrowTrack" tabindex="0" aria-label="Films and reviews from dadada homes">' + ROOMS.map(function (r, i) {
        var p = P[r[3]];
        if (r[0] === "q") return '<figure class="hrow-it q' + (i % 8 === 3 ? " lime" : "") + '">' + V8.stars(r[1]) + "<blockquote>“" + esc(r[2]) + '”</blockquote><figcaption><b>' + esc(r[4]) + '</b><a href="' + V8.url(p) + '">on the ' + esc(p.full) + "</a></figcaption></figure>";
        var media = r[0] === "v" ? '<video muted loop playsinline preload="none" poster="../img/' + r[1] + '.jpg" aria-label="' + esc(r[2]) + '"><source data-src="../video/' + r[1] + '.webm" type="video/webm"><source data-src="../video/' + r[1] + '.mp4" type="video/mp4"></video>' : '<img src="../img/' + r[1] + '.jpg" alt="' + esc(r[2]) + '" loading="lazy">';
        return '<figure class="hrow-it ' + r[0] + '" data-id="' + r[1] + '"><div class="ph">' + media + '</div><figcaption><span>' + esc(r[2]) + '</span><a href="' + V8.url(p) + '">Shop ' + esc(p.name) + ' <span aria-hidden="true">→</span></a></figcaption></figure>';
      }).join("") + '</div><div class="wrap hrow-foot"><span class="hrow-prog"><i id="hrowBar"></i></span></div></div>';
  }

  function homeAfter(root) {
    // hero film: load after first paint, show once it plays
    var vid = $("#heroVid", root);
    if (!reduce && !(navigator.connection && navigator.connection.saveData)) {
      var startHero = function () { loadVideo(vid); vid.play().catch(function () {}); };
      if ("requestIdleCallback" in window) requestIdleCallback(startHero, { timeout: 1500 }); else setTimeout(startHero, 600);
    }
    vid.addEventListener("playing", function () { vid.classList.add("on"); });

    // manifesto: words light up as it scrolls through
    var mh = $("#mani", root);
    (function split(node) { [].slice.call(node.childNodes).forEach(function (n) { if (n.nodeType === 3) { var frag = document.createDocumentFragment(); n.textContent.split(/(\s+)/).forEach(function (part) { if (!part) return; if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part)); else { var sp = document.createElement("span"); sp.className = "wd"; sp.textContent = part; frag.appendChild(sp); } }); n.parentNode.replaceChild(frag, n); } else if (n.nodeType === 1 && n.tagName !== "svg") split(n); }); })(mh);
    var words = $$(".wd", mh);
    function lightWords() { var r = mh.getBoundingClientRect(), vh = innerHeight; var prog = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.25))); var lit = Math.ceil(prog * words.length); words.forEach(function (w, i) { w.classList.toggle("lit", i < lit); }); }
    addEventListener("scroll", lightWords, { passive: true }); lightWords();
    V8.onLeave(function () { removeEventListener("scroll", lightWords); });

    // best sellers tabs
    var tabs = $("#bestTabs", root), grid = $("#bestGrid", root);
    var tabBtns = $$("[role=tab]", tabs);
    function pick(b) { tabBtns.forEach(function (t) { var on = t === b; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; }); grid.innerHTML = tabCards(b.dataset.tab); V8.reveal(grid); }
    tabBtns.forEach(function (b, i) { b.tabIndex = i ? -1 : 0; b.addEventListener("click", function () { pick(b); }); b.addEventListener("keydown", function (e) { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); var n = tabBtns[(i + (e.key === "ArrowRight" ? 1 : tabBtns.length - 1)) % tabBtns.length]; n.focus(); pick(n); } }); });

    // the section switches between best sellers and categories
    var modes = $$(".modes [role=tab]", root), bestCtl = $("#bestCtl", root);
    function mode(b) {
      modes.forEach(function (t) { var on = t === b; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; $("#" + t.getAttribute("aria-controls"), root).hidden = !on; });
      bestCtl.hidden = b.dataset.mode !== "best";
      $("#best-h", root).innerHTML = b.dataset.h;
      V8.reveal($("#" + b.getAttribute("aria-controls"), root));
    }
    modes.forEach(function (b, i) { b.addEventListener("click", function () { mode(b); }); b.addEventListener("keydown", function (e) { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); var n = modes[1 - i]; n.focus(); mode(n); } }); });

    // shop the look carousel + hotspots
    var track = $("#stlTrack", root), rooms = $$(".stl-room", track), cur = 0, timer, hc = $("#hotCard", root), stl = $("#stl", root), openHot = null;
    function go(n) {
      cur = (n + rooms.length) % rooms.length; track.style.transform = "translateX(" + -100 * cur + "%)";
      rooms.forEach(function (r, k) { var on = k === cur; r.toggleAttribute("aria-hidden", !on); $$(".hot", r).forEach(function (h) { h.tabIndex = on ? 0 : -1; }); });
      $("#stlNum", root).textContent = "0" + (cur + 1) + " / 0" + rooms.length; $("#stlName", root).textContent = D.looks[cur].name; closeHot();
    }
    function auto() { clearInterval(timer); if (!reduce) timer = setInterval(function () { if (!openHot) go(cur + 1); }, 7000); }
    $("#stlPrev", root).addEventListener("click", function () { go(cur - 1); auto(); });
    $("#stlNext", root).addEventListener("click", function () { go(cur + 1); auto(); });
    var sx = null; track.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true }); track.addEventListener("touchend", function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) { go(cur + (dx < 0 ? 1 : -1)); auto(); } sx = null; });
    function closeHot() { if (openHot) openHot.setAttribute("aria-expanded", "false"); openHot = null; hc.hidden = true; }
    track.addEventListener("click", function (e) {
      var h = e.target.closest(".hot"); if (!h) return; e.stopPropagation();
      if (openHot === h) return closeHot(); closeHot(); openHot = h; h.setAttribute("aria-expanded", "true");
      var it = D.looks[+h.dataset.look].items[+h.dataset.item], p = P[it.id], f = 0;
      if (it.finish) p.finishes.forEach(function (x, i) { if (x.k === it.finish) f = i; });
      hc.innerHTML = '<span class="im"><img src="' + p.finishes[f].img + '" alt=""></span><span><b>' + esc(p.full) + "</b><span>" + esc(p.finishes[f].name) + " · " + money(p.finishes[f].price) + '</span><span class="row"><button type="button" class="btn btn-primary sm" data-add="' + p.id + '" data-f="' + f + '">Add to bag</button><a class="link small" href="' + V8.url(p) + '">Details</a></span></span>' + V8.wishBtn(p, "hot-wish");
      hc.hidden = false;
      var sr = stl.getBoundingClientRect(), hr = h.getBoundingClientRect(), w = hc.offsetWidth, cx = hr.left + hr.width / 2 - sr.left;
      hc.style.left = Math.max(16, Math.min(sr.width - w - 16, cx - w / 2)) + "px";
      var below = hr.top - sr.top < sr.height * 0.5;
      hc.style.top = below ? hr.bottom - sr.top + 10 + "px" : ""; hc.style.bottom = below ? "" : sr.bottom - hr.top + 10 + "px";
      clearInterval(timer);
    });
    document.addEventListener("click", docClose); function docClose(e) { if (openHot && !e.target.closest("#hotCard") && !e.target.closest(".hot")) { closeHot(); auto(); } }
    function escHot(e) { if (e.key === "Escape" && openHot) { var h = openHot; closeHot(); h.focus(); } }
    document.addEventListener("keydown", escHot);
    auto();
    V8.onLeave(function () { clearInterval(timer); document.removeEventListener("click", docClose); document.removeEventListener("keydown", escHot); });

    // set offer
    $("#addSet", root).addEventListener("click", function () { V8.add("soho", 0, 1, { silent: true }); V8.add("soho5", 0, 1); });

    // homes: fan opens and films play only while on screen
    var fan = $("#fan", root), paused = reduce, ft = $("#fanToggle", root);
    function playFan(on) { $$("video", fan).forEach(function (v) { if (on) { loadVideo(v); v.play().catch(function () {}); } else v.pause(); }); }
    var fio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { fan.classList.add("in"); countUp(); if (!paused) playFan(true); } else playFan(false); }); }, { threshold: .25 });
    fio.observe(fan);
    ft.textContent = paused ? "Play the films" : "Pause the films"; ft.setAttribute("aria-pressed", paused);
    ft.addEventListener("click", function () { paused = !paused; playFan(!paused); ft.textContent = paused ? "Play the films" : "Pause the films"; ft.setAttribute("aria-pressed", paused); });
    function countUp() { var el = $("#homesN", root); if (!el || el.dataset.done || reduce) return; el.dataset.done = 1; var t0 = performance.now(); (function st(t) { var k = Math.min(1, (t - t0) / 1500), e = 1 - Math.pow(1 - k, 4); el.textContent = Math.round(10000 * e).toLocaleString("en-US"); if (k < 1) requestAnimationFrame(st); })(t0); }
    V8.onLeave(function () { fio.disconnect(); });
    var row = $("#hrow", root), track = $("#hrowTrack", root), bar = $("#hrowBar", root), ctl = $("#fanCtl", root);
    // row films play while on screen; the slot may hold the fan's own film (moved in on unfold)
    var rio = new IntersectionObserver(function (es) { es.forEach(function (e) { var v = $("video", e.target); if (!v) return; if (e.isIntersecting && !row.hidden) { loadVideo(v); v.play().catch(function () {}); } else v.pause(); }); }, { threshold: .6 });
    $$(".hrow-it.v .ph", track).forEach(function (ph) { rio.observe(ph); });
    function swapFilms(intoRow) {
      $$("[data-reel]", fan).forEach(function (b) {
        var ph = $('[data-id="' + b.dataset.reel + '"] .ph', track); if (!ph) return;
        var fv = intoRow ? $("video", b) : $("video", ph), rv = intoRow ? $("video", ph) : null;
        if (intoRow) { b._own = rv; ph.replaceChild(fv, rv); b._film = fv; }
        else if (b._film) { ph.replaceChild(b._own, b._film); b.insertBefore(b._film, b.firstChild); b._film = null; }
      });
    }
    V8.onLeave(function () { rio.disconnect(); });
    function prog() { var m = track.scrollWidth - track.clientWidth; bar.style.transform = "scaleX(" + (m > 0 ? Math.max(.06, track.scrollLeft / m) : 1) + ")"; }
    track.addEventListener("scroll", prog, { passive: true });
    row.addEventListener("click", function (e) { var n = e.target.closest("[data-rv]"); if (n) track.scrollBy({ left: +n.dataset.rv * track.clientWidth * .6, behavior: reduce ? "auto" : "smooth" }); });
    track.addEventListener("keydown", function (e) { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); track.scrollBy({ left: (e.key === "ArrowRight" ? 1 : -1) * track.clientWidth * .5, behavior: "smooth" }); } });
    function unfold(id) {
      // remember where each film sits in the fan, swap the fan for the row, then fly each film to its slot.
      // The row is fully visible without the animation; the animation only plays on top of it.
      var from = {};
      $$("[data-reel]", fan).forEach(function (b) { from[b.dataset.reel] = b.getBoundingClientRect(); });
      var head = $(".homes-head", root), y0 = head.getBoundingClientRect().top;
      swapFilms(true);
      fan.hidden = true; ctl.hidden = true; row.hidden = false;
      try { window.scrollBy(0, head.getBoundingClientRect().top - y0); } catch (e) {} // keep the heading where it was
      var it = $('[data-id="' + id + '"]', track);
      if (it) { var tr = track.getBoundingClientRect(), ir = it.getBoundingClientRect(); track.scrollLeft += ir.left - tr.left - (tr.width - ir.width) / 2; }
      prog();
      var v = it && $("video", it); if (v) { loadVideo(v); v.muted = true; var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); }
      if (reduce || !Element.prototype.animate) return;
      try {
        var c = it ? it.getBoundingClientRect() : null;
        $$(".hrow-it", track).forEach(function (el) {
          var ph = $(".ph", el), f = from[el.dataset.id], r = (ph || el).getBoundingClientRect();
          if (r.right < -200 || r.left > innerWidth + 200) return;
          if (f && ph && r.width && r.height) {
            ph.animate([{ transformOrigin: "0 0", transform: "translate(" + (f.left - r.left) + "px," + (f.top - r.top) + "px) scale(" + f.width / r.width + "," + f.height / r.height + ")" }, { transformOrigin: "0 0", transform: "none" }], { duration: 850, easing: "cubic-bezier(.2,.7,.2,1)" });
            var cap = $("figcaption", el); if (cap) cap.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 500, fill: "backwards" });
          } else {
            var d = c ? Math.min(6, Math.abs(r.left - c.left) / 300) : 0;
            el.animate([{ opacity: 0, transform: "translateY(28px) scale(.96)" }, { opacity: 1, transform: "none" }], { duration: 700, delay: 120 + d * 60, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
          }
        });
      } catch (e) {}
    }
    function fold() {
      var head = $(".homes-head", root), y0 = head.getBoundingClientRect().top;
      $$("video", track).forEach(function (v) { v.pause(); });
      swapFilms(false);
      row.hidden = true; fan.hidden = false; ctl.hidden = false;
      window.scrollBy({ top: head.getBoundingClientRect().top - y0, behavior: "instant" });
      fan.classList.remove("in"); void fan.offsetWidth; fan.classList.add("in");
      if (!paused) playFan(true);
      var first = $("[data-reel]", fan); if (first) first.focus({ preventScroll: true });
    }
    $$("[data-reel]", fan).forEach(function (b) { b.addEventListener("click", function () { unfold(b.dataset.reel); }); });
    $("#hrowFold", root).addEventListener("click", fold);

    // toddler stages: click, hover or auto-advance
    var stages = $$(".stage", root), imgs = $$("#todImgs img", root), si = 0, sti;
    function setStage(n) { si = n; stages.forEach(function (s, k) { s.setAttribute("aria-selected", k === n); }); imgs.forEach(function (im, k) { im.classList.toggle("on", k === n); }); }
    function autoStage() { clearInterval(sti); if (!reduce) sti = setInterval(function () { setStage((si + 1) % 3); }, 5000); }
    stages.forEach(function (s, k) { s.addEventListener("click", function () { setStage(k); autoStage(); }); s.addEventListener("mouseenter", function () { if (matchMedia("(hover:hover)").matches) { setStage(k); autoStage(); } }); });
    var tio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) autoStage(); else clearInterval(sti); }); }); tio.observe($("#toddler", root));
    V8.onLeave(function () { clearInterval(sti); tio.disconnect(); });
  }

  V8.route("", V8.pages.home);
})();
