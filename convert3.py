import re

css = open('app/globals.css', 'r').read()

replacements = [
    # Feature pills background
    (r'background: rgba\(28, 43, 58, 0\.72\);', 'background: rgba(226, 232, 240, 0.72);'),
    
    # Form success/error messages
    (r'color: #9ee6b1;', 'color: #166534;'),
    (r'color: #ffb1a2;', 'color: #991b1b;'),
    
    # Random light grays text that should be dark
    (r'color: rgba\(200, 212, 220, 0\.82\);', 'color: rgba(15, 23, 42, 0.82);'),
    
    # Fix the ghost button explicitly
    (r'\.button--ghost \{\s*color: #0f172a;\s*border-color: rgba\(15, 23, 42, 0\.42\);\s*background: rgba\(15, 23, 42, 0\.28\);\s*backdrop-filter: blur\(18px\);\s*\}', 
     '.button--ghost {\\n  color: #0f172a;\\n  border-color: rgba(15, 23, 42, 0.42);\\n  background: rgba(255, 255, 255, 0.58);\\n  backdrop-filter: blur(18px);\\n}'),
     
    # Fix the hero text shade if it is illegible. Wait, if hero text has no background, it sits on the hero. The hero is dark. Let's rely on the hero poster gradient we changed:
    # background: linear-gradient(90deg, rgba(255, 255, 255, 0.78) 0%, rgba(255, 255, 255, 0.24) 54%, rgba(255, 255, 255, 0.78) 100%), ...
]

for old, new_ in replacements:
    css = re.sub(old, new_, css)

open('app/globals.css', 'w').write(css)
