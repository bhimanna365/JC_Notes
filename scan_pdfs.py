import os
import json
import datetime
workspace = os.path.dirname(os.path.abspath(__file__))
pdf_list = []

for root, dirs, files in os.walk(workspace):
    if any(x in root for x in ['node_modules', '.git', 'dist', '.system_generated']):
        continue
    for f in files:
        if f.lower().endswith('.pdf'):
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, workspace).replace('\\', '/')
            stat = os.stat(full_path)
            
            # Format size nicely
            size_kb = round(stat.st_size / 1024, 1)
            size_str = f"{size_kb} KB" if size_kb < 1024 else f"{round(size_kb/1024, 2)} MB"
            mod_date = datetime.datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d')
            
            parts = rel_path.split('/')
            folder = parts[0] if len(parts) > 1 else 'Root'
            subfolder = '/'.join(parts[:-1]) if len(parts) > 1 else ''

            pdf_list.append({
                'id': 'pdf-' + rel_path.lower().replace('/', '-').replace(' ', '-').replace('.pdf', ''),
                'filename': f,
                'rel_path': rel_path,
                'folder': folder,
                'subfolder': subfolder,
                'size_bytes': stat.st_size,
                'size_formatted': size_str,
                'last_modified': mod_date
            })

print(f"Total PDFs found: {len(pdf_list)}")
for p in pdf_list:
    print(f"[{p['folder']}] {p['filename']} ({p['size_formatted']}) -> {p['rel_path']}")

with open('all_pdfs_inventory.json', 'w', encoding='utf-8') as out:
    json.dump(pdf_list, out, indent=2)
