import os
import json
import datetime
import urllib.parse

# Setup paths relative to script location
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, '..', '..'))
content_root = os.path.join(project_root, 'content')

output_ts_frontend = os.path.join(project_root, 'frontend', 'src', 'data', 'pdfManifest.ts')
output_ts_root = os.path.join(project_root, 'src', 'data', 'pdfManifest.ts')
inventory_json = os.path.join(project_root, 'all_pdfs_inventory.json')

# Subject mapping dictionary
SUBJECT_MAP = {
    '24CS310-OOP': {'code': '24CS310', 'name': 'Object Oriented Programming using C++', 'category': 'OOP with C++', 'displayOrder': 3},
    '24CS320-DSD': {'code': '24CS320', 'name': 'Digital System Design', 'category': 'Digital System Design', 'displayOrder': 1},
    '24CS330-DS': {'code': '24CS330', 'name': 'Data Structures', 'category': 'Data Structures', 'displayOrder': 2},
    '24CS340-CO': {'code': '24CS340', 'name': 'Computer Organization', 'category': 'Computer Organization', 'displayOrder': 4},
    '24CS350-DMS': {'code': '24CS350', 'name': 'Discrete Mathematical Structures', 'category': 'Discrete Mathematics', 'displayOrder': 5},
    '24HU311-UHV': {'code': '24HU311', 'name': 'Universal Human Values - II', 'category': 'Universal Human Values', 'displayOrder': 7},
    '24MA313-M3': {'code': '24MA313', 'name': 'Engineering Mathematics - III', 'category': 'Mathematics III', 'displayOrder': 6},
    'DS-Lab': {'code': '24CS36L', 'name': 'Data Structures Lab', 'category': 'DS Lab', 'displayOrder': 99},
    'DSD-Lab': {'code': '24CS320', 'name': 'Digital System Design Lab', 'category': 'DSD Lab', 'displayOrder': 98},
    'OOP-Lab': {'code': '24CS310', 'name': 'OOP Lab', 'category': 'OOP Lab', 'displayOrder': 97},
    '2026': {'code': 'SYLLABUS', 'name': 'Official Curriculum & Syllabi 2026', 'category': 'Syllabus & Scheme', 'displayOrder': 8},
    'PYQ-24': {'code': 'PYQ-2024', 'name': 'Previous Year Papers 2024', 'category': 'PYQ 2024', 'displayOrder': 90},
    'PYQ-25': {'code': 'PYQ-2025', 'name': 'Previous Year Papers 2025', 'category': 'PYQ 2025', 'displayOrder': 91},
    'other': {'code': 'OTHER', 'name': 'Academic Scheme & Calendars', 'category': 'Calendars & Scheme', 'displayOrder': 9}
}

NOTE_MAPPING = {
    '24CS310': 'note-dma-cpp',
    '24CS320': 'note-dsd-kmaps',
    '24CS330': 'note-ds-stacks',
    '24CS340': 'note-co-memory',
    '24CS350': 'note-dms-logic',
    '24MA313': 'note-m3-curve',
    '24HU311': 'note-uhv-harmony',
}

pdf_list = []

for root, dirs, files in os.walk(content_root):
    for f in files:
        if f.lower().endswith('.pdf'):
            full_path = os.path.join(root, f)
            rel_content = os.path.relpath(full_path, content_root).replace('\\', '/')
            rel_path = f"content/{rel_content}"
            stat = os.stat(full_path)
            
            size_kb = round(stat.st_size / 1024, 1)
            size_str = f"{size_kb} KB" if size_kb < 1024 else f"{round(size_kb/1024, 2)} MB"
            mod_date = datetime.datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d')
            
            parts = rel_content.split('/')
            top_section = parts[0] if len(parts) > 0 else 'other'
            folder = parts[1] if len(parts) > 1 else top_section
            subfolder = parts[2] if len(parts) > 2 and len(parts) > 3 else (parts[2] if len(parts) > 3 else '')
            
            fn_lower = f.lower()
            rel_lower = rel_path.lower()
            
            is_community = (top_section == 'community')
            is_ds_lab = ('ds-lab' in rel_lower or fn_lower == 'ds-lab.pdf')
            is_dsd_lab = ('dsd-lab' in rel_lower or 'dsd record' in fn_lower or 'lab-manual' in fn_lower)
            is_oop_lab = ('oop-lab' in rel_lower)
            is_lab_resource = (top_section == 'laboratory') or is_ds_lab or is_dsd_lab or is_oop_lab
            lab_type = 'ds' if is_ds_lab else ('dsd' if is_dsd_lab else ('oop' if is_oop_lab else None))
            
            is_dsd_manual = ('dsd' in rel_lower and ('dsd record' in fn_lower or 'lab-manual' in fn_lower))
            is_syllabus = (top_section == 'syllabus') or ('syllabus' in fn_lower)
            is_pyq = (top_section == 'pyq') or ('pyq' in rel_lower or 'cie' in fn_lower or 'see' in fn_lower)
            
            # Default subject info
            if is_community:
                folder = 'community'
                if any(w in fn_lower for w in ['dsa', 'data structure', 'tree', 'graph', 'stack', 'queue', 'linked', 'algo', '24cs330']):
                    subj_info = {'code': '24CS330', 'name': 'Data Structures', 'category': 'Data Structures', 'displayOrder': 2}
                elif any(w in fn_lower for w in ['dsd', 'digital', 'kmap', 'boolean', 'verilog', '24cs320']):
                    subj_info = {'code': '24CS320', 'name': 'Digital System Design', 'category': 'Digital System Design', 'displayOrder': 1}
                elif any(w in fn_lower for w in ['oop', 'c++', 'cpp', 'object oriented', 'inheritance', '24cs310']):
                    subj_info = {'code': '24CS310', 'name': 'Object Oriented Programming using C++', 'category': 'OOP with C++', 'displayOrder': 3}
                elif any(w in fn_lower for w in ['co', 'computer organization', 'architecture', 'pipelining', '24cs340']):
                    subj_info = {'code': '24CS340', 'name': 'Computer Organization', 'category': 'Computer Organization', 'displayOrder': 4}
                elif any(w in fn_lower for w in ['dms', 'discrete', 'relation', 'set theory', 'logic', '24cs350']):
                    subj_info = {'code': '24CS350', 'name': 'Discrete Mathematical Structures', 'category': 'Discrete Mathematics', 'displayOrder': 5}
                elif any(w in fn_lower for w in ['math', 'm3', 'fourier', 'laplace', '24ma313']):
                    subj_info = {'code': '24MA313', 'name': 'Engineering Mathematics - III', 'category': 'Mathematics III', 'displayOrder': 6}
                elif any(w in fn_lower for w in ['uhv', 'human values', 'harmony', '24hu311']):
                    subj_info = {'code': '24HU311', 'name': 'Universal Human Values - II', 'category': 'Universal Human Values', 'displayOrder': 7}
                else:
                    subj_info = {'code': 'COMMUNITY', 'name': 'Student Community Notes', 'category': 'Community Uploads', 'displayOrder': 20}
            else:
                subj_info = SUBJECT_MAP.get(folder, SUBJECT_MAP.get(top_section, {'code': 'GENERAL', 'name': folder, 'category': folder, 'displayOrder': 99}))
            
            # Refined subject mapping for syllabus
            if is_syllabus:
                if 'co-syllabus' in fn_lower:
                    subj_info = {'code': '24CS340', 'name': 'Computer Organization', 'category': 'Computer Organization', 'displayOrder': 4}
                elif 'dms-syllabus' in fn_lower:
                    subj_info = {'code': '24CS350', 'name': 'Discrete Mathematical Structures', 'category': 'Discrete Mathematics', 'displayOrder': 5}
                elif 'ds-lab' in fn_lower:
                    subj_info = {'code': '24CS36L', 'name': 'Data Structures Lab', 'category': 'Data Structures Lab', 'displayOrder': 99}
                elif 'ds-syllabus' in fn_lower:
                    subj_info = {'code': '24CS330', 'name': 'Data Structures', 'category': 'Data Structures', 'displayOrder': 2}
                elif 'dsd-syllabus' in fn_lower:
                    subj_info = {'code': '24CS320', 'name': 'Digital System Design', 'category': 'Digital System Design', 'displayOrder': 1}
                elif 'uhv-syllabus' in fn_lower:
                    subj_info = {'code': '24HU311', 'name': 'Universal Human Values - II', 'category': 'Universal Human Values', 'displayOrder': 7}
                elif 'math-3' in fn_lower:
                    subj_info = {'code': '24MA313', 'name': 'Engineering Mathematics - III', 'category': 'Mathematics III', 'displayOrder': 6}
                elif 'oop-syllabus' in fn_lower:
                    subj_info = {'code': '24CS310', 'name': 'Object Oriented Programming using C++', 'category': 'OOP with C++', 'displayOrder': 3}

            # Refined subject mapping for PYQ
            if is_pyq:
                if '24cs310' in fn_lower or 'oops' in fn_lower:
                    subj_info = {'code': '24CS310', 'name': 'Object Oriented Programming using C++', 'category': 'OOP with C++', 'displayOrder': 3}
                elif '24cs320' in fn_lower or 'dsd' in fn_lower:
                    subj_info = {'code': '24CS320', 'name': 'Digital System Design', 'category': 'Digital System Design', 'displayOrder': 1}
                elif '24cs330' in fn_lower or 'dsa' in fn_lower or ('ds_' in fn_lower and 'dsd' not in fn_lower) or ('_ds.' in fn_lower):
                    subj_info = {'code': '24CS330', 'name': 'Data Structures', 'category': 'Data Structures', 'displayOrder': 2}
                elif '24cs340' in fn_lower or '_co' in fn_lower:
                    subj_info = {'code': '24CS340', 'name': 'Computer Organization', 'category': 'Computer Organization', 'displayOrder': 4}
                elif '24cs350' in fn_lower or 'dms' in fn_lower:
                    subj_info = {'code': '24CS350', 'name': 'Discrete Mathematical Structures', 'category': 'Discrete Mathematics', 'displayOrder': 5}
                elif '24cs36l' in fn_lower or 'structures lab test' in fn_lower:
                    subj_info = {'code': '24CS36L', 'name': 'Data Structures Lab', 'category': 'Data Structures Lab', 'displayOrder': 99}
                elif '24hu311' in fn_lower or 'uhv' in fn_lower:
                    subj_info = {'code': '24HU311', 'name': 'Universal Human Values - II', 'category': 'Universal Human Values', 'displayOrder': 7}
                elif '24ma313' in fn_lower or 'math' in fn_lower:
                    subj_info = {'code': '24MA313', 'name': 'Engineering Mathematics - III', 'category': 'Mathematics III', 'displayOrder': 6}

            # Category
            if is_community:
                category = 'Community Uploads'
            elif is_lab_resource:
                category = 'DS Lab' if lab_type == 'ds' else ('DSD Lab' if lab_type == 'dsd' else 'OOP Lab')
            elif is_pyq and ('pyq-25' in rel_lower or 'pyq 2025' in rel_lower):
                category = 'PYQ 2025'
            elif is_pyq and ('pyq-24' in rel_lower or 'pyq 2024' in rel_lower):
                category = 'PYQ 2024'
            elif is_syllabus:
                category = 'Syllabus & Scheme'
            else:
                category = subj_info['category']

            # Unit label
            if is_community:
                unit_label = 'Community Shared Material'
            elif is_syllabus:
                unit_label = 'Syllabus 2026'
            elif top_section == 'laboratory':
                unit_label = 'Lab Manual & Records' if is_dsd_manual or 'record' in fn_lower else 'Lab Programs & Resources'
            elif top_section == 'pyq':
                unit_label = 'PYQ 2025' if 'pyq-25' in rel_lower else 'PYQ 2024'
            elif len(parts) >= 3 and parts[2].lower() != f.lower():
                sub_clean = parts[2].strip()
                if sub_clean.lower().startswith('unit'):
                    num = sub_clean.replace('Unit', '').replace('unit', '').replace('-', '').strip()
                    unit_label = f"Unit {num}" if num else sub_clean
                elif sub_clean.lower() == 'stacksandqueues':
                    unit_label = 'Stacks & Queues'
                elif sub_clean.lower() == 'papers':
                    unit_label = 'Papers & Question Banks'
                elif sub_clean.lower() == 'see':
                    unit_label = 'Semester End Exam (SEE)'
                elif sub_clean.lower() == 'test-1':
                    unit_label = 'CIE Test 1'
                elif sub_clean.lower() == 'test-2':
                    unit_label = 'CIE Test 2'
                else:
                    unit_label = sub_clean
            else:
                unit_label = 'General / Other'

            # Clean Title
            import re
            clean_title = f.replace('.pdf', '')
            clean_title = re.sub(r'_\d{10,}_[a-z0-9]+', '', clean_title)
            for prefix in ['24CS310_', '24CS320_', '24CS330_', '24CS340_', '24CS350_', '24MA313_', '24HU311_']:
                clean_title = clean_title.replace(prefix, '')
            clean_title = clean_title.replace('_', ' ').replace('-', ' ').strip()
            
            ACRONYMS = {'DSA', 'OOP', 'DSD', 'CO', 'DMS', 'UHV', 'PYQ', 'CIE', 'SEE', 'PDF', 'II', 'III', 'IV', 'ML', 'AI', 'OS', 'DBMS', 'CN'}
            def format_word(w):
                u = w.upper()
                return u if u in ACRONYMS else w.capitalize()

            clean_title = ' '.join(format_word(word) for word in clean_title.split())

            # Generate Unique ID
            norm_path = rel_path.lower().replace('.pdf', '').replace('\\', '-').replace('/', '-').replace(' ', '-')
            safe_id = 'pdf-' + ''.join(c if c.isalnum() or c == '-' else '' for c in norm_path)
            while '--' in safe_id:
                safe_id = safe_id.replace('--', '-')

            # Browser safe URL encoded
            url_segments = [urllib.parse.quote(seg) for seg in rel_path.split('/')]
            url = f"/raw-pdf/{'/'.join(url_segments)}"

            # Tags & Keywords
            tags = [subj_info['code'], unit_label]
            if is_dsd_manual:
                tags.append('Manual Record')
            if is_lab_resource:
                tags.append('Laboratory')
            if is_syllabus:
                tags.append('Syllabus')
            if is_pyq:
                tags.append('Exam Paper')

            keywords = [clean_title, f, f.replace('.pdf', ''), subj_info['name'], subj_info['code']]
            if is_community:
                keywords.extend(['Community Upload', 'Student Notes', 'Community Shared', 'Complete Notes'])
                if subj_info['code'] == '24CS330':
                    keywords.extend(['DSA', 'Data Structures', 'Data Structures and Algorithms', 'DSA Complete Notes', 'DSA_CompleteNotes'])
                elif subj_info['code'] == '24CS320':
                    keywords.extend(['DSD', 'Digital System Design'])
                elif subj_info['code'] == '24CS310':
                    keywords.extend(['OOP', 'Object Oriented Programming', 'C++'])

            doc = {
                'id': safe_id,
                'filename': f,
                'title': clean_title,
                'relPath': rel_path,
                'url': url,
                'folder': folder,
                'subfolder': subfolder,
                'unit': unit_label,
                'category': category,
                'subjectCode': subj_info['code'],
                'subjectName': subj_info['name'],
                'sizeBytes': stat.st_size,
                'sizeFormatted': size_str,
                'lastModified': mod_date,
                'isManualRecord': is_dsd_manual,
                'isLabResource': is_lab_resource,
                'isSyllabus': is_syllabus,
                'isPYQ': is_pyq,
                'isCommunityUpload': is_community,
                'keywords': list(dict.fromkeys(keywords)),
                '_displayOrder': subj_info['displayOrder']
            }
            if lab_type is not None:
                doc['labType'] = lab_type
            if subj_info['code'] in NOTE_MAPPING:
                doc['relatedNoteId'] = NOTE_MAPPING[subj_info['code']]
            pdf_list.append(doc)

# Sort PDFs
def sort_key(p):
    return (p['_displayOrder'], p['subjectCode'], p['unit'], p['title'])

pdf_list.sort(key=sort_key)

# Clean up internal sorting helper before writing
for p in pdf_list:
    del p['_displayOrder']

# Generate Subject Groups
subject_groups = {}
for p in pdf_list:
    if p['isLabResource'] or p['isPYQ']:
        continue
    code = p['subjectCode']
    if code not in subject_groups:
        info = SUBJECT_MAP.get(p['folder'], {'displayOrder': 99})
        subject_groups[code] = {
            'id': code.lower(),
            'code': code,
            'title': p['subjectName'],
            'folder': p['folder'],
            'category': p['category'],
            'displayOrder': info.get('displayOrder', 99),
            'unitMap': {},
            'totalBytes': 0,
            'totalPdfs': 0
        }
    grp = subject_groups[code]
    grp['totalPdfs'] += 1
    grp['totalBytes'] += p['sizeBytes']
    u = p['unit']
    if u not in grp['unitMap']:
        grp['unitMap'][u] = []
    grp['unitMap'][u].append(p)

subject_group_list = []
for code, grp in sorted(subject_groups.items(), key=lambda x: x[1]['displayOrder']):
    # Format total size
    total_kb = round(grp['totalBytes'] / 1024, 1)
    size_str = f"{total_kb} KB" if total_kb < 1024 else f"{round(total_kb/1024, 2)} MB"
    
    # Sort units naturally
    sorted_unit_names = sorted(
        grp['unitMap'].keys(),
        key=lambda u: (0, int(u.replace('Unit ', ''))) if u.startswith('Unit ') and u.replace('Unit ', '').isdigit() else (1, u)
    )
    
    unit_groups = []
    for u_name in sorted_unit_names:
        u_docs = grp['unitMap'][u_name]
        unit_groups.append({
            'unitName': u_name,
            'pdfCount': len(u_docs),
            'pdfs': u_docs
        })

    subject_group_list.append({
        'id': grp['id'],
        'code': grp['code'],
        'title': grp['title'],
        'folder': grp['folder'],
        'category': grp['category'],
        'totalPdfs': grp['totalPdfs'],
        'totalBytes': grp['totalBytes'],
        'totalSizeFormatted': size_str,
        'units': unit_groups
    })

print(f"Total PDFs indexed: {len(pdf_list)}")
print(f"Total Academic Subjects in PDF Notes: {len(subject_group_list)}")
for s in subject_group_list:
    print(f"  • {s['title']} ({s['code']}): {len(s['units'])} Units/Sections, {s['totalPdfs']} PDFs")

# TypeScript Manifest Template
ts_content = f"""// AUTO-GENERATED ACADEMIC PDF REPOSITORY MANIFEST
// Generated on: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
// Scanned from content/ repository
// Total PDFs: {len(pdf_list)}

import {{ PDFDocument, PDFSubjectGroup }} from '../types';

export const PDF_DOCUMENTS: PDFDocument[] = {json.dumps(pdf_list, indent=2)};

export const ACADEMIC_PDF_SUBJECTS: PDFSubjectGroup[] = {json.dumps(subject_group_list, indent=2)};

export const PDF_CATEGORIES = [
  'All Theory Notes',
  'Digital System Design',
  'Data Structures',
  'OOP with C++',
  'Computer Organization',
  'Discrete Mathematics',
  'Mathematics III',
  'Universal Human Values',
  'Syllabus & Scheme',
  'Calendars & Scheme'
] as const;

// Legacy and fuzzy lookup helper for backward compatibility
export function getPdfById(id: string): PDFDocument | undefined {{
  const q = id.toLowerCase().replace(/^pdf\\//, '').replace(/^#pdf\\//, '');
  return PDF_DOCUMENTS.find(p => p.id.toLowerCase() === q || p.filename.toLowerCase() === q);
}}

export const getPDFById = getPdfById;

// Return only theory/reference PDFs for the PDF Notes Library
export function getTheoryPDFs(): PDFDocument[] {{
  return PDF_DOCUMENTS.filter(p => !p.isLabResource && !p.isPYQ);
}}

// Return only practical laboratory PDFs for the Laboratory Hub
export function getLaboratoryPDFs(labType?: 'ds' | 'dsd' | 'oop'): PDFDocument[] {{
  if (labType) return PDF_DOCUMENTS.filter(p => p.isLabResource && p.labType === labType);
  return PDF_DOCUMENTS.filter(p => p.isLabResource);
}}

export function getPDFsBySubject(subjectCode: string): PDFDocument[] {{
  return PDF_DOCUMENTS.filter(p => p.subjectCode && p.subjectCode.toLowerCase() === subjectCode.toLowerCase());
}}

export function getPDFsByCategory(category: string): PDFDocument[] {{
  if (category === 'All' || category === 'All Theory Notes') return getTheoryPDFs();
  return PDF_DOCUMENTS.filter(p => p.category === category);
}}

export function getDSDManualRecordPDFs(): PDFDocument[] {{
  return PDF_DOCUMENTS.filter(p => p.isManualRecord);
}}

export function getDSRecordPDF(): PDFDocument | undefined {{
  return PDF_DOCUMENTS.find(p => p.relPath.toLowerCase().includes('ds-lab') && p.filename.toLowerCase().includes('record'));
}}

export function getSubjectGroupById(idOrCode: string): PDFSubjectGroup | undefined {{
  const q = idOrCode.toLowerCase();
  return ACADEMIC_PDF_SUBJECTS.find(s => s.id.toLowerCase() === q || s.code.toLowerCase() === q || s.folder.toLowerCase() === q);
}}

// Return original examination PDFs from PYQ-24 and PYQ-25
export function getPYQPDFs(filter?: 'all' | '2024' | '2025' | 'SEE' | 'CIE-1' | 'CIE-3' | 'Model QP'): PDFDocument[] {{
  const pyqs = PDF_DOCUMENTS.filter(p => p.isPYQ);
  if (!filter || filter === 'all') return pyqs;
  if (filter === '2024') return pyqs.filter(p => p.folder === 'PYQ-24' || p.relPath.includes('PYQ-24'));
  if (filter === '2025') return pyqs.filter(p => p.folder === 'PYQ-25' || p.relPath.includes('PYQ-25'));
  if (filter === 'SEE') return pyqs.filter(p => p.filename.toLowerCase().includes('see') || p.relPath.toLowerCase().includes('/see/'));
  if (filter === 'CIE-1') return pyqs.filter(p => p.filename.toLowerCase().includes('cie-1') || p.filename.toLowerCase().includes('cie1') || p.relPath.toLowerCase().includes('test-1'));
  if (filter === 'CIE-3') return pyqs.filter(p => p.filename.toLowerCase().includes('cie-3') || p.filename.toLowerCase().includes('cie2') || p.relPath.toLowerCase().includes('test-2'));
  if (filter === 'Model QP') return pyqs.filter(p => p.filename.toLowerCase().includes('model') || p.filename.toLowerCase().includes('test-exam') || p.filename.toLowerCase().includes('answer key') || p.filename.toLowerCase().includes('modal answers'));
  return pyqs;
}}

// Return official 2026 syllabus PDFs
export function getSyllabusPDFs(): PDFDocument[] {{
  return PDF_DOCUMENTS.filter(p => p.isSyllabus || p.folder === '2026' || p.relPath.includes('2026') || p.relPath.includes('syllabus'));
}}
"""

# Write to frontend data folder
os.makedirs(os.path.dirname(output_ts_frontend), exist_ok=True)
with open(output_ts_frontend, 'w', encoding='utf-8') as f:
    f.write(ts_content)
print(f"Generated {output_ts_frontend}")

# Also write to root data folder if it exists
if os.path.exists(os.path.dirname(output_ts_root)):
    with open(output_ts_root, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    print(f"Generated {output_ts_root}")

# Save json inventory
with open(inventory_json, 'w', encoding='utf-8') as f:
    json.dump(pdf_list, f, indent=2)
print(f"Generated {inventory_json}")
