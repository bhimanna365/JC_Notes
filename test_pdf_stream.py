import urllib.request

urls = [
    'http://localhost:5173/raw-pdf/01.Syllabus-26/DSD-syllabus.pdf',
    'http://localhost:5173/raw-pdf/24CS320-DSD/DSD-LAB/DSD%20record.pdf',
    'http://localhost:5173/raw-pdf/24CS36L-DS-Lab/Pgm%201.pdf'
]

for url in urls:
    try:
        req = urllib.request.Request(url, method='HEAD')
        with urllib.request.urlopen(req) as resp:
            print(f"SUCCESS: {url}")
            print(f"  Status: {resp.status}")
            print(f"  Content-Type: {resp.headers.get('Content-Type')}")
            print(f"  Content-Length: {resp.headers.get('Content-Length')}")
            print(f"  Content-Disposition: {resp.headers.get('Content-Disposition')}")
    except Exception as e:
        print(f"ERROR: {url} -> {e}")
