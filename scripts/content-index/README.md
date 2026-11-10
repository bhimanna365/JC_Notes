# Content Indexing Scripts

This folder contains automated scripts for scanning, indexing, and categorizing academic materials from the `content/` repository.

## Adding New Materials
You can drop new files or folders into `content/` at any time without modifying any React components:
- New subject notes: `content/notes/<SUBJECT_CODE>/<Unit>/<file.pdf>`
- New exam papers: `content/pyq/PYQ-25/<file.pdf>` or `content/pyq/PYQ-24/<file.pdf>`
- New syllabus files: `content/syllabus/2026/<file.pdf>`
- New lab manuals/records: `content/laboratory/<Lab-Name>/<file.pdf>`

## Running Content Indexing
To re-generate the manifest:
```bash
npm run index-content
# OR
python scripts/content-index/index_content.py
```
This updates `frontend/src/data/pdfManifest.ts` and `all_pdfs_inventory.json` automatically.
