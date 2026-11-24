# usage: python3 cook/tools/sheet.py <dir> <out.png> <mode> <cols> <scale> name1 name2 ...
import sys
from PIL import Image

d, out, mode, cols, scale = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), float(sys.argv[5])
ims = [Image.open(f'{d}/{mode}-{n}.png') for n in sys.argv[6:]]
w, h = ims[0].size
rows = (len(ims) + cols - 1) // cols
s = Image.new('RGB', (cols * (w + 16) - 16, rows * (h + 16) - 16), (90, 90, 90))
for i, im in enumerate(ims):
    s.paste(im, ((i % cols) * (w + 16), (i // cols) * (h + 16)))
s = s.resize((int(s.width * scale), int(s.height * scale)), Image.LANCZOS)
s.save(f'{d}/{out}')
