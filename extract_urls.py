import json
import sys

with open(r'C:\Users\ASUS\.gemini\antigravity\brain\dd00c252-47a2-487b-a261-48a5fe4bed8f\.system_generated\steps\8643\output.txt', 'r', encoding='utf-8') as f:
    data = json.load(f)

for screen in data.get('screens', []):
    title = screen.get('title')
    html_url = screen.get('htmlCode', {}).get('downloadUrl')
    if html_url:
        print(f"{title}|{html_url}")
