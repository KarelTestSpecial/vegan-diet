with open('index.html', 'r') as f:
    content = f.read()

replacements = {
    r'$B_{12}$': 'B12',
    r'$\mu g$': 'µg',
    r'$K_{2}$': 'K2',
    r'$K_{1}$': 'K1',
    r'$Fe^{3+}$': 'Fe3+',
    r'$Fe^{2+}$': 'Fe2+',
    r'$\alpha$-': 'Alpha-',
    r'$T_{3}$': 'T3',
    r'$T_{4}$': 'T4',
    r'\mu g': 'µg',
    r'$\Delta$': 'Delta'
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open('index.html', 'w') as f:
    f.write(content)

print("Text replaced successfully.")
