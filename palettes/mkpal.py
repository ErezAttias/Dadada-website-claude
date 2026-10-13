import sys, re
# usage: mkpal.py name out.html  — palette defined below by name
P = {
 "denim": dict(title="dadada Denim",
   blue="#2a64d6", lime="#fff0a6", blush="#ffeee8", cream="#fff6c9", navy="#1e2540",
   lav="#ff4d2d", lavt="#ffe3da", sky="#e1ebfb", line="#ecdfae",
   blue_rgb="42, 100, 214", lime_rgb="255, 240, 166"),
 "vinyl": dict(title="dadada Vinyl",
   blue="#022e40", lime="#f28111", blush="#f3e4d3", cream="#fbf5ea", navy="#022e40",
   lav="#f2441d", lavt="#fbd9cc", sky="#e9dccd", line="#e2d3c1",
   blue_rgb="2, 46, 64", lime_rgb="242, 129, 17"),
 "pantone": dict(title="dadada Pantone",
   blue="#233563", lime="#fbeda4", blush="#f7e2d6", cream="#fefbed", navy="#18233f",
   lav="#d52d32", lavt="#f5e3df", sky="#e4e7ef", line="#d9d7d5",
   blue_rgb="35, 53, 99", lime_rgb="251, 237, 164"),
 "fresh": dict(title="dadada Fresh",
   blue="#14160f", lime="#e2583a", blush="#cfe6f2", cream="#fff6c4", navy="#14160f",
   lav="#0199c6", lavt="#d7ecf5", sky="#d7ecf5", line="#e8dc9e",
   blue_rgb="20, 22, 15", lime_rgb="226, 88, 58"),
 "vitame": dict(title="dadada Vitame",
   blue="#43649f", lime="#dce7ad", blush="#ec643a", cream="#fcfbec", navy="#242f35",
   lav="#5d81bf", lavt="#dde5f3", sky="#e9efcf", line="#dcdfe6",
   blue_rgb="67, 100, 159", lime_rgb="220, 231, 173"),
 "tropina": dict(title="dadada Tropina",
   blue="#b8321a", lime="#d2ea4c", blush="#fad8c6", cream="#fefbed", navy="#ea532f",
   lav="#ea532f", lavt="#fbe1d2", sky="#eef4cf", line="#efd2c2",
   blue_rgb="184, 50, 26", lime_rgb="210, 234, 76"),
}
name, out = sys.argv[1], sys.argv[2]; c = P[name]
s = open('/home/claude/proto/index.html').read()
s = s.replace('<title>dadada — Room to be you</title>', f'<title>{c["title"]}</title>', 1)
root = {"--blue": c["blue"], "--lime": c["lime"], "--blush": c["blush"], "--cream": c["cream"], "--navy": c["navy"], "--lav": c["lav"], "--lav-t": c["lavt"], "--sky": c["sky"], "--line": c["line"]}
a = s.index(':root {'); b = s.index('}', a)
blk = s[a:b]
for k, v in root.items():
    blk = re.sub(rf'{k}: #[0-9a-fA-F]{{6}};', f'{k}: {v};', blk, count=1)
s = s[:a] + blk + s[b:]
for old, new in [("#1f25f5", c["blue"]), ("#eefe53", c["lime"]), ("#10233f", c["navy"]), ("#b5a8e1", c["lav"])]:
    s = s.replace(old, new)
s = s.replace("rgba(31, 37, 245", "rgba(" + c["blue_rgb"]).replace("rgba(238, 254, 83", "rgba(" + c["lime_rgb"])
extra = open(f'/home/claude/qa/pal-{name}.css').read()
sys.path.insert(0, '/home/claude/qa')
from btnrule import css as btncss
extra += btncss(name)
i = s.rindex('</style>'); s = s[:i] + extra + s[i:]
open(out, 'w').write(s); print("ok", out)
