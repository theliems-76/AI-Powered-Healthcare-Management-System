import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = {
    'assessment_intake.html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzBjYjllZGI1Zjk4NTRmNmE4MjFkZjQ2OWFmYzRhYTdkEgsSBxCn7dbArwEYAZIBJAoKcHJvamVjdF9pZBIWQhQxMDU3MDgwMjI2NzI4OTQwOTI0NQ&filename=&opi=89354086'
}

for filename, url in urls.items():
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, context=ctx) as response:
        html = response.read().decode('utf-8')
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html)
    print(f"Downloaded {filename}")
