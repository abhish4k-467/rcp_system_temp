import re

css = open('app/globals.css', 'r').read()

replacements = [
    # Button and generic text colors that became light when they should be dark
    (r'color: #f8fafc;', 'color: #0f172a;'),
    
    # Let's fix testimonial-card colors that might have gone invisible
    (r'\.testimonial-card p \{\s*color: var\(--white\);', '.testimonial-card p {\\n  color: #0f172a;'),
    
    # .button--primary had color: #081421, which became #f8fafc. We just turned all #f8fafc to #0f172a, except inside backgrounds it might matter... Wait!
    # If I just replaced all color: #f8fafc; with color: #0f172a;, what does that break?
    # Maybe backgrounds got replaced? No, the regex only hit color: #f8fafc;. Let's also check for color: var(--white); on pills.
    (r'\.feature-pills span \{\s*border: 1px solid rgba\(15, 23, 42, 0\.28\);\s*border-radius: 999px;\s*color: var\(--white\);',
     '.feature-pills span {\\n  border: 1px solid rgba(15, 23, 42, 0.28);\\n  border-radius: 999px;\\n  color: #0f172a;'),
]

for old, new_ in replacements:
    css = re.sub(old, new_, css)

open('app/globals.css', 'w').write(css)
