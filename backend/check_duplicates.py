# This script will help identify and remove duplicate endpoints in app.py
import re

with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all route definitions
routes = re.findall(r'@app\.route\([^)]+\)', content)

print("Found routes:")
for i, route in enumerate(routes, 1):
    print(f"{i}. {route}")

# Count duplicates
from collections import Counter
route_counts = Counter(routes)

print("\n\nDuplicate routes:")
for route, count in route_counts.items():
    if count > 1:
        print(f"{route} appears {count} times")
