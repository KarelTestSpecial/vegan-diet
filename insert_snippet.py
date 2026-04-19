with open('index.html', 'r') as f:
    content = f.read()

with open('guide_html_snippet.html', 'r') as f:
    snippet = f.read()

# Replace "        </div> <!-- End Database View -->\n\n      </main>" 
# with "        </div> <!-- End Database View -->\n" + snippet + "\n      </main>"

target = "        </div> <!-- End Database View -->\n\n      </main>"
if target in content:
    new_content = content.replace(target, "        </div> <!-- End Database View -->\n\n" + snippet + "\n      </main>")
    with open('index.html', 'w') as f:
        f.write(new_content)
    print("Success")
else:
    print("Target not found")
