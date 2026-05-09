import re

css = open('app/globals.css', 'r').read()

replacements = [
    (r':root \{([\s\S]*?)\}', lambda m: m.group(0).replace(
        '--steel: #0a1628;', '--steel: #f8fafc;'
    ).replace(
        '--steel-2: #0d1f33;', '--steel-2: #f1f5f9;'
    ).replace(
        '--ink: #060f1a;', '--ink: #ffffff;'
    ).replace(
        '--charcoal: #1c2b3a;', '--charcoal: #e2e8f0;'
    ).replace(
        '--charcoal-2: #132235;', '--charcoal-2: #cbd5e1;'
    ).replace(
        '--white: #f0f4f8;', '--white: #0f172a;'
    ).replace(
        '--silver: #8fa3b1;', '--silver: #64748b;'
    ).replace(
        '--silver-2: #c8d4dc;', '--silver-2: #475569;'
    ).replace(
        '--shadow: 0 24px 80px rgba(0, 0, 0, 0.36);', '--shadow: 0 24px 80px rgba(0, 0, 0, 0.08);'
    )),
    (r'color: #fff;', 'color: #0f172a;'),
    (r'color: var\(--white\);', 'color: var(--white);'),
    (r'background: rgba\(10, 22, 40,', 'background: rgba(255, 255, 255,'),
    (r'rgba\(6, 15, 26,', 'rgba(255, 255, 255,'),
    (r'rgba\(255, 255, 255,', 'rgba(15, 23, 42,'), # dark color for borders
    (r'rgba\(15, 23, 42, 0\.06\)', 'rgba(15, 23, 42, 0.06)'),
    (r'rgba\(143, 163, 177,', 'rgba(15, 23, 42,'),
    (r'#081421', '#f8fafc'),
    (r'#07111e', '#f1f5f9'),
    (r'#081a2e', '#e2e8f0'),
]

for old, new_ in replacements:
    if callable(new_):
        css = re.sub(old, new_, css)
    else:
        css = re.sub(old, new_, css)

open('app/globals.css', 'w').write(css)
