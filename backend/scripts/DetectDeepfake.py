import torch
import torch.nn.functional as F
import numpy as np
from facenet_pytorch import MTCNN, InceptionResnetV1
from PIL import Image
import cv2
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image

DEVICE = 'cuda:0' if torch.cuda.is_available() else 'cpu'

mtcnn = MTCNN(
    select_largest=False,
    post_process=False,
    device=DEVICE
).to(DEVICE).eval()

model = InceptionResnetV1(
    pretrained="vggface2",
    classify=True,
    num_classes=1,
    device=DEVICE
)
checkpoint = torch.load(r"C:\Users\sayal\OneDrive\Desktop\final\ait2\fence.ai\backend\models\resnetinceptionv1_epoch_32.pth", map_location=torch.device('cpu'))
model.load_state_dict(checkpoint['model_state_dict'])
model.to(DEVICE)
model.eval()


def predict(face):
    """Predict the label of the input_image"""
    # face = mtcnn(input_image)
    # print(face.shape if face != None else None)
    # create torch tensor from the PIL image
    # if face is None:
    #     return -1
    face = np.transpose(face, (2, 0, 1))
    face = torch.from_numpy(face).to(DEVICE)
    
    face = face.unsqueeze(0)  # add the batch dimension
    face = F.interpolate(face, size=(256, 256), mode='bilinear', align_corners=False)

    # convert the face into a numpy array to be able to plot it
    prev_face = face.squeeze(0).permute(1, 2, 0).cpu().detach().int().numpy()
    prev_face = prev_face.astype('uint8')

    face = face.to(DEVICE)
    face = face.to(torch.float32)
    face = face / 255.0
    face_image_to_plot = face.squeeze(0).permute(1, 2, 0).cpu().detach().int().numpy()

    target_layers = [model.block8.branch1[-1]]
    cam = GradCAM(model=model, target_layers=target_layers)
    targets = [ClassifierOutputTarget(0)]

    grayscale_cam = cam(input_tensor=face, targets=targets, eigen_smooth=True)
    grayscale_cam = grayscale_cam[0, :]
    visualization = show_cam_on_image(face_image_to_plot, grayscale_cam, use_rgb=True)
    face_with_mask = cv2.addWeighted(prev_face, 1, visualization, 0.5, 0)

    with torch.no_grad():
        output = torch.sigmoid(model(face).squeeze(0))
        prediction = "real" if output.item() < 0.5 else "fake"

        real_prediction = 1 - output.item()
        fake_prediction = output.item()

        confidences = {
            'real': real_prediction,
            'fake': fake_prediction
        }
    # face_with_mask looks cool and can be returned too
    cv2.imwrite("mask.jpg", face_with_mask)
    return confidences


def predict_face(pil_images):
    preds = []
    for pil_image in pil_images:
        pred = predict(pil_image)
        if pred != -1:
            preds.append(pred)
    return preds


def predict_face_from_video(faces_array):
    predictions = []
    for face in faces_array:
        img = Image.fromarray(face)
        preds = predict(img)
        if preds != -1:
            predictions.append(preds)
    return predictions
