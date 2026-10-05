# dadada website (prototype)

A single-page prototype of the new dadada nursery-furniture site: home, crib and dresser product pages, toddler & kids, nursery sets, compare, story, support, the Find-your-fit quiz and the blog.

- `index.html` holds the markup, styles and scripts (hash routing: `#/soho`, `#/dressers/soho5`, `#/journal/safety101`, …).
- `img/`, `video/` and `fonts/` hold the assets; `pl-*.jpg` are the uniform product plates (13.8 px per inch, shared baseline).
- `vendor/` holds local copies of GSAP, ScrollTrigger and Lenis for offline runs; the page itself loads them from jsDelivr.

## Run it

Serve the folder with any static server and open `index.html`:

```
python3 -m http.server 8765
```
