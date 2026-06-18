import pytesseract
from PIL import Image

img = Image.open("output_page_02.png")
data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)

with open("ocr_results.txt", "w") as f:
    for i in range(len(data['text'])):
        if int(data['conf'][i]) > 10 and data['text'][i].strip():
            x, y, w, h = data['left'][i], data['top'][i], data['width'][i], data['height'][i]
            text = data['text'][i]
            f.write(f"Text: '{text}' at (x: {x}, y: {y}, w: {w}, h: {h})\n")
