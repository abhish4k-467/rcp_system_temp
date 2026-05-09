import re

css = open('app/globals.css', 'r').read()

replacements = [
    (r'rgba\(28, 43, 58, 0\.94\)', 'rgba(255, 255, 255, 0.94)'),
    # Fix the missing semicolon problem if the previous search/replace broke something
]

for old, new_ in replacements:
    css = re.sub(old, new_, css)

open('app/globals.css', 'w').write(css)
