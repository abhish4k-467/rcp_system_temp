import re

css = open('app/globals.css', 'r').read()

replacements = [
    # General inverted colors: text dark, backgrounds light

    # Fix the Nav that got dark text on dark bg or light text on light bg
    (r'color: rgba\(240, 244, 248, 0\.82\);', 'color: rgba(15, 23, 42, 0.82);'),
    
    # Fix the site nav backgrounds going dark
    (r'background: rgba\(15, 23, 42, 0\.12\);', 'background: rgba(255, 255, 255, 0.72);'),
    (r'background: rgba\(15, 23, 42, 0\.96\);', 'background: rgba(255, 255, 255, 0.96);'),
    
    # Fix border colors in nav
    (r'border-color: rgba\(15, 23, 42, 0\.22\);', 'border-color: rgba(15, 23, 42, 0.1);'),
    
    # Mobile menu fixes
    (r'background: rgba\(15, 23, 42, 0\);', 'background: rgba(255, 255, 255, 0);'),
    (r'background: rgba\(15, 23, 42, 0\.72\);', 'background: rgba(255, 255, 255, 0.72);'),
    (r'background: rgba\(15, 23, 42, 0\.98\);', 'background: rgba(255, 255, 255, 0.98);'),
    
    # Text colors that might be white but should be dark
    (r'color: #fff;', 'color: #0f172a;'),
    
    # Hero poster and shades: originally they were dark to show white text.
    # If we made them dark, they overlay the video. Let's make them light and translucent.
    (r'rgba\(15, 23, 42, 0\.78\)', 'rgba(255, 255, 255, 0.78)'),
    (r'rgba\(15, 23, 42, 0\.24\)', 'rgba(255, 255, 255, 0.24)'),
    (r'rgba\(15, 23, 42, 0\.92\)', 'rgba(255, 255, 255, 0.85)'),
    (r'rgba\(15, 23, 42, 0\.58\)', 'rgba(255, 255, 255, 0.58)'),
    (r'rgba\(15, 23, 42, 0\.32\)', 'rgba(255, 255, 255, 0.32)'),
    (r'rgba\(15, 23, 42, 0\.88\)', 'rgba(255, 255, 255, 0.88)'),
    
    # Grid lines - should be dark on light
    (r'rgba\(15, 23, 42, 0\.14\)', 'rgba(15, 23, 42, 0.14)'), 
    
    # Problem section
    (r'rgba\(15, 23, 42, 0\.12\)', 'rgba(15, 23, 42, 0.05)'),
    (r'rgba\(15, 23, 42, 0\.04\)', 'rgba(15, 23, 42, 0.03)'),
]

for old, new_ in replacements:
    css = re.sub(old, new_, css)

open('app/globals.css', 'w').write(css)
