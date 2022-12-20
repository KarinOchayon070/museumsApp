import os

images = os.listdir(os.curdir)
print(images)

for image in images:
    os.rename(image, image.lower().replace(" ", "_"))
