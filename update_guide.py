import re

with open('index.html', 'r') as f:
    content = f.read()

with open('guide_html_snippet.html', 'r') as f:
    new_guide = f.read()

# Pattern to find the guide-view div
# <div id="guide-view" ... > ... </div>
pattern = r'<!-- GUIDE VIEW -->\s*<div id="guide-view".*?</div>\s*(?=</main>)'
replacement = "<!-- GUIDE VIEW -->\n" + new_guide.strip() + "\n        "

if re.search(pattern, content, re.DOTALL):
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    with open('index.html', 'w') as f:
        f.write(new_content)
    print("Success")
else:
    print("Pattern not found")
