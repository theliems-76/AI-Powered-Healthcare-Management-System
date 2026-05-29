from PIL import Image

img_path = 'logo.png'
out_path = 'favicon.png'

try:
    img = Image.open(img_path).convert("RGBA")
    # Resize slightly maybe? Favicons are usually square, but the original aspect ratio is fine
    background = Image.new('RGBA', img.size, (0, 0, 0, 255))
    background.paste(img, mask=img)
    
    # Save as PNG
    background.save(out_path)
    print("Successfully created favicon.png with a black background!")
except Exception as e:
    print("Error:", e)
