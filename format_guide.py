import re

with open('legacy/vegan-gids.txt', 'r') as f:
    text = f.read()

# Try to insert newlines before known headers
headers = [
    "De Biochemische Noodzaak van Vitamine $B_{12}$",
    "Metabolisme, Absorptie en Biomarkers",
    "Analyse van Plantaardige \"Bronnen\" en Pseudo-B12",
    "Omega-3 Vetzuren: De Enzymatische Strijd om Conversie",
    "Het Conversiepad en de Impact van Omega-6",
    "Algenolie: De Directe Oplossing",
    "Eiwitmetabolisme en Aminozuurprofielen",
    "De 30% Verhogingsregel voor Veganisten",
    "No-Cook Strategieën voor Maximale Eiwitinname",
    "Vitamine $K_{2}$: De Regulator van de Calciumhuishouding",
    "Het Mechanisme van de Calciumdistributie",
    "Fermentatie als Bron van MK-7",
    "IJzer- en Zinkhomeostase: Synergie en Inhibitie",
    "De Katalytische Rol van Vitamine C",
    "Beheer van Inhibitors",
    "Jodium en Selenium: De Bodemafhankelijke Elementen",
    "Jodium: Brood en Zeewier",
    "Selenium en de Kracht van Paranoten",
    "Implementatie en Retail-Logistiek: Het Colruyt-Model",
    "Optimalisatie van de Soja-inname en Omega-Balans",
    "No-Cook Maaltijdplan voor de Veganist",
    "Conclusie"
]

formatted = text
for h in headers:
    formatted = formatted.replace(h, f"\n\n## {h}\n\n")

# Tables are a mess. Let's just wrap the whole thing in a pre-wrap div or prose.
# Since it's going into HTML, we should replace newlines with <br><br>

html_content = ""
for line in formatted.split('\n\n'):
    line = line.strip()
    if not line: continue
    if line.startswith('## '):
        html_content += f'<h2 class="text-xl font-bold text-emerald-400 mt-8 mb-3">{line[3:]}</h2>\n'
    else:
        html_content += f'<p class="mb-4 text-slate-300 leading-relaxed text-sm">{line}</p>\n'

final_html = f"""
        <!-- GUIDE VIEW -->
        <div id="guide-view" class="space-y-6 hidden animate-fadeIn">
          <section class="glass-card p-6 md:p-8 rounded-3xl">
            <h1 class="text-2xl md:text-3xl font-bold text-emerald-500 mb-6">Vegan Dieet Gids</h1>
            <div class="max-w-4xl">
              {html_content}
            </div>
          </section>
        </div>
"""

with open('guide_html_snippet.html', 'w') as f:
    f.write(final_html)

print("Snippet created.")
