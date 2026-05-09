import re

css = open('app/globals.css', 'r').read()

replacements = [
    # Re-map var(--white) definition just in case it got overwritten
    (r'--white: #0f172a;', '--white: #0f172a;'),
    
    # Fix the issue where I replaced var(--white) but some were missed. 
    # The user says they can't see the CSS loading, possibly due to a compilation error 
    # but the terminal says it compiled successfully. And 
pm run build had exit code 0.
    
    # Notice this rule: 
    # color: var(--white);
    # background: rgba(226, 232, 240, 0.72);
    # var(--white) is #0f172a which is dark blue. Against grey, it is visible.
    
    # Let's check for any actual syntactical errors that our python script might have introduced.
    # The prettier warning is just code style.
]

for old, new_ in replacements:
    css = re.sub(old, new_, css)

open('app/globals.css', 'w').write(css)
