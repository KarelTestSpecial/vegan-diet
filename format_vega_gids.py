import re

with open('legacy/vega-gids.md', 'r') as f:
    text = f.read()

# Replacements for image placeholders
image_map = {
    r'!\[\]\[image1\]': 'B12',
    r'!\[\]\[image2\]': 'K2',
    r'!\[\]\[image3\]': 'B12',
    r'!\[\]\[image4\]': 'B12',
    r'!\[\]\[image5\]': 'B12',
    r'!\[\]\[image6\]': 'B12',
    r'!\[\]\[image7\]': 'B12',
    r'!\[\]\[image8\]': 'µg',
    r'!\[\]\[image9\]': 'B12',
    r'!\[\]\[image10\]': 'µg',
    r'!\[\]\[image11\]': 'µg',
    r'!\[\]\[image12\]': 'B12',
    r'!\[\]\[image13\]': 'B12',
    r'!\[\]\[image14\]': 'B12',
    r'!\[\]\[image15\]': 'B12',
    r'!\[\]\[image16\]': 'alpha',
    r'!\[\]\[image17\]': 'Delta',
    r'!\[\]\[image18\]': 'Delta',
    r'!\[\]\[image19\]': 'alpha',
    r'!\[\]\[image20\]': 'K2',
    r'!\[\]\[image21\]': 'K1',
    r'!\[\]\[image22\]': 'K2',
    r'!\[\]\[image23\]': 'K1',
    r'!\[\]\[image24\]': 'K2',
    r'!\[\]\[image25\]': 'K2',
    r'!\[\]\[image26\]': 'K2',
    r'!\[\]\[image27\]': 'K2',
    r'!\[\]\[image28\]': 'K2',
    r'!\[\]\[image29\]': 'K2',
    r'!\[\]\[image30\]': 'µg',
    r'!\[\]\[image31\]': 'µg',
    r'!\[\]\[image32\]': 'µg',
    r'!\[\]\[image33\]': 'µg',
    r'!\[\]\[image34\]': 'Fe3+',
    r'!\[\]\[image35\]': 'Fe3+',
    r'!\[\]\[image36\]': 'Fe2+',
    r'!\[\]\[image37\]': 'T3',
    r'!\[\]\[image38\]': 'T4',
    r'!\[\]\[image39\]': 'µg',
    r'!\[\]\[image40\]': 'µg',
    r'!\[\]\[image41\]': 'µg',
    r'!\[\]\[image42\]': 'B12',
    r'!\[\]\[image43\]': 'K2',
    r'!\[\]\[image44\]': 'B12',
    r'!\[\]\[image45\]': 'K2',
}

for pattern, replacement in image_map.items():
    text = re.sub(pattern, replacement, text)

# Remove the base64 image definitions at the bottom
text = re.sub(r'\[image\d+\]: <data:image.*?>', '', text, flags=re.DOTALL)

# Clean up common markdown escapes
text = text.replace(r'\-', '-')
text = text.replace(r'\~', '~')
text = text.replace(r'\!', '!')

# The file already contains some HTML tables. Let's make sure they look good.
# I will wrap the content in a simple converter.
def clean_md(md):
    # Convert markdown headers to styled HTML
    md = re.sub(r'^# (.*)$', r'<h1 class="text-2xl md:text-3xl font-bold text-emerald-500 mb-6">\1</h1>', md, flags=re.M)
    md = re.sub(r'^## (.*)$', r'<h2 class="text-xl font-bold text-emerald-400 mt-10 mb-4 border-b border-emerald-900/30 pb-2">\1</h2>', md, flags=re.M)
    md = re.sub(r'^### (.*)$', r'<h3 class="text-lg font-semibold text-emerald-300/80 mt-6 mb-2">\1</h3>', md, flags=re.M)
    
    # Bold
    md = re.sub(r'\*\*(.*?)\*\*', r'<strong class="text-emerald-100">\1</strong>', md)
    
    # Lists
    md = re.sub(r'^\* (.*)$', r'<li class="ml-6 mb-2 text-slate-300 list-disc">\1</li>', md, flags=re.M)
    md = re.sub(r'^\d+\. (.*)$', r'<li class="ml-6 mb-2 text-slate-300 list-decimal">\1</li>', md, flags=re.M)

    # Paragraphs (excluding already formatted HTML and headers)
    lines = md.split('\n')
    final_lines = []
    in_list = False
    for line in lines:
        sline = line.strip()
        if not sline:
            if in_list: 
                final_lines.append('</ul>')
                in_list = False
            continue
        
        if sline.startswith('<li'):
            if not in_list:
                final_lines.append('<ul class="mb-6 space-y-1">')
                in_list = True
            final_lines.append(sline)
        elif sline.startswith('<') or sline.startswith('|'):
            if in_list:
                final_lines.append('</ul>')
                in_list = False
            final_lines.append(sline)
        else:
            if in_list:
                final_lines.append('</ul>')
                in_list = False
            final_lines.append(f'<p class="mb-4 text-slate-300 leading-relaxed text-sm">{sline}</p>')
            
    return "\n".join(final_lines)

# Handle remaining markdown tables (if any)
def convert_tables(md):
    def table_repl(match):
        rows = match.group(0).strip().split('\n')
        if len(rows) < 2: return match.group(0)
        html = '<div class="overflow-x-auto my-8"><table class="w-full text-xs text-left text-slate-300 border-collapse bg-slate-900/40 rounded-2xl overflow-hidden border border-slate-800/50">'
        for i, row in enumerate(rows):
            if i == 1 and '---' in row: continue
            cells = [c.strip() for c in row.split('|') if c.strip() or '|' in row]
            if not cells: continue
            tag = 'th' if i == 0 else 'td'
            row_class = 'bg-emerald-950/40 text-emerald-400 font-bold border-b border-emerald-900/30' if i == 0 else 'border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors'
            html += f'<tr class="{row_class}">'
            for cell in cells:
                html += f'<{tag} class="px-5 py-4">{cell}</{tag}>'
            html += '</tr>'
        html += '</table></div>'
        return html
    return re.sub(r'((?:\|.*\|(?:\n|$))+)', table_repl, md)

text = convert_tables(text)
html_body = clean_md(text)

# Final assembly
final_html = f"""
        <!-- GUIDE VIEW -->
        <div id="guide-view" class="space-y-6 hidden animate-fadeIn">
          <section class="glass-card p-6 md:p-10 rounded-[2rem] shadow-2xl border border-white/5">
            <div class="max-w-4xl mx-auto prose prose-invert prose-emerald">
              {html_body}
            </div>
          </section>
        </div>
"""

with open('guide_html_snippet.html', 'w') as f:
    f.write(final_html)

print("Snippet updated from vega-gids.md.")
