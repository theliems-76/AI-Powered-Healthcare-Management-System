import urllib.request
import ssl

url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzRjYWM4MDczZDA2YjQyZTg5NzU1ZGFlZDQ3MTA2MWZmEgsSBxCn7dbArwEYAZIBJAoKcHJvamVjdF9pZBIWQhQxMDU3MDgwMjI2NzI4OTQwOTI0NQ&filename=&opi=89354086"
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx) as response:
    html = response.read().decode('utf-8')
    with open('dashboard_stitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
print("Downloaded dashboard_stitch.html")
