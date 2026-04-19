import re

text = open('legacy/vegan-gids.txt').read()

html = """
        <!-- GUIDE VIEW -->
        <div id="guide-view" class="space-y-6 hidden animate-fadeIn">
          <section class="glass-card p-8 rounded-3xl text-slate-300 leading-relaxed text-sm">
"""

# Very basic parsing based on known structure of the txt file
# Since the text is just a single block of text (wait, is it a single line? Let's check view_file output.
# Yes! The view_file output showed "Total Lines: 1". The text file is a single line, stripped of newlines!
