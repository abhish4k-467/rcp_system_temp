import re

css = open('app/globals.css', 'r').read()

replacements = [
    # Testimonials section background overlay
    (r'rgba\(10, 22, 40, 0\.94\)', 'rgba(255, 255, 255, 0.94)'),
    (r'rgba\(15, 23, 42, 0\.98\)', 'rgba(255, 255, 255, 0.98)'),
    
    # Logo background inside case card/testimonial
    (r'background: rgba\(15, 23, 42, 0\.9\);', 'background: rgba(255, 255, 255, 0.9);'),
    
    # Fix .field input background from dark back to translucent light/barely gray
    (r'background: rgba\(15, 23, 42, 0\.68\);', 'background: transparent;'),
    
    # For lead form amber inputs
    (r'background: rgba\(15, 23, 42, 0\.55\);', 'background: rgba(255, 255, 255, 0.55);'),
    
    # Fix the environment shades that became dark slate, they should be translucent white
    (r'rgba\(15, 23, 42, 0\.85\)', 'rgba(255, 255, 255, 0.85)'),
    (r'rgba\(15, 23, 42, 0\.76\)', 'rgba(255, 255, 255, 0.76)'),
]

for old, new_ in replacements:
    css = re.sub(old, new_, css)

open('app/globals.css', 'w').write(css)
