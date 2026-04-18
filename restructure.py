import re

with open('index.html', 'r') as f:
    content = f.read()

# 1. Extract header
header_match = re.search(r'(<header class="mb-12 text-center">.*?</header>)', content, re.DOTALL)
header_html = header_match.group(1)

# Remove old header
content = content.replace(header_html, '')

# Modify header HTML for sidebar
new_header_html = header_html.replace('mb-12 text-center', 'mb-8 text-left')
new_header_html = new_header_html.replace('text-4xl md:text-5xl', 'text-2xl md:text-3xl')
new_header_html = new_header_html.replace('max-w-2xl mx-auto text-lg', 'text-sm mt-2')

# 2. Extract custom food card
custom_card_match = re.search(r'(<!-- Custom Food Database Card -->\s*<section class="glass-card p-6 rounded-3xl" id="custom-food-card">.*?</section>\s*)', content, re.DOTALL)
custom_card_html = custom_card_match.group(1)

# Remove old custom food card
content = content.replace(custom_card_html, '')

# 3. Insert new header into aside
aside_marker = '<aside class="lg:col-span-4 space-y-6">'
content = content.replace(aside_marker, aside_marker + '\n        ' + new_header_html)

# 4. Insert custom food card into main
main_marker_end = '<!-- Insights & Tips -->'
content = content.replace(main_marker_end, custom_card_html + '\n        ' + main_marker_end)

with open('index.html', 'w') as f:
    f.write(content)
