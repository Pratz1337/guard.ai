import cv2 as cv
from PIL import Image


def art_classifier(image, pipe):
    outputs = pipe(image)
    results = {}
    for result in outputs:
        results[result['label']] = result['score']
    return results


def predict_art(img_np_arr, pipe):
    img_arr = cv.imdecode(img_np_arr, cv.IMREAD_COLOR)
    img = Image.fromarray(img_arr)
    res = art_classifier(img, pipe)
    return res
