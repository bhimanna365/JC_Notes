#!/usr/bin/env python
import os
import subprocess
import sys

# Forward directly to scripts/content-index/index_content.py
script_dir = os.path.dirname(os.path.abspath(__file__))
target_script = os.path.join(script_dir, 'scripts', 'content-index', 'index_content.py')

if __name__ == '__main__':
    result = subprocess.run([sys.executable, target_script] + sys.argv[1:])
    sys.exit(result.returncode)
