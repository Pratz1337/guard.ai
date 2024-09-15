from io import BytesIO
from scripts.CropFaces import *
from scripts.DetectDeepfake import *
from scripts.DetectArt import *
from scripts.DetectAudio import *
from flask import Flask, request, send_file
from flask_cors import CORS
from scripts.vid_detect import predict_video
from scripts.ProtectAudio import *
from scripts.VideoToFrames import convert_video
from transformers import pipeline
from scripts.Nft import *
import io
from PIL import Image

def convert_blob_to_image(blob):
    """Converts a blob to an image and saves it."""

    # Convert blob to bytes-like object
    byte_stream = io.BytesIO(blob)

    # Open image using Pillow
    image = Image.open(byte_stream)

    # Save the image
    image.save("output_image.jpg")


pipe = pipeline("image-classification", "umm-maybe/AI-image-detector")

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/', methods=['GET'])
def handle_root():
    return 'backend api'


@app.route('/extension.crx')
def send_report():
    return send_file('fence_ai.crx')

@app.route('/protect_and_mint', methods=['POST'])
def protect_and_mint():
    convert_blob_to_image(request.data)
    nftUrl = protect_and_retrieve_file("/workspaces/guard.ai-temp/backend/output_image.jpg")
    print(nftUrl)
    return nftUrl


@app.route('/detect_image', methods=['POST'])
def handle_detect_image():
    if 'file' in request.files:
        file = request.files['file']
        file_stream = BytesIO(file.read())
        file_np_array = np.asarray(bytearray(file_stream.read()), dtype=np.uint8)
        file_extension = file.filename.split('.')[-1].lower()
        if file_extension in ['jpg', 'jpeg', 'png', 'webp']:
            face_array = crop_faces(file_np_array)
            if (face_array.shape[0] != 0):
                predictions = [predict(face) for face in face_array]
                real = [pred['real'] for pred in predictions]
                fake = [pred['fake'] for pred in predictions]
                real_avg = sum(real) / len(real)
                fake_avg = sum(fake) / len(fake)
                print("Face detection")
                print(real_avg, fake_avg)
                # result = predict_face(pil_images)
                return f"% Real: {real_avg * 100}, % Fake: {fake_avg * 100}"
            else:
                # face absent so perfect art based detection
                print("art/no face detection")
                result = predict_art(file_np_array, pipe)
                print(result)
                return f"% Artificial: {result['artificial'] * 100}, % Real: {result['human'] * 100}"
        else:
            return f'Unsupported file format: {file_extension}'
    else:
        return 'No image data received'

@app.route('/detect_audio', methods=['POST'])
def handle_detect_audio():
    if 'file' not in request.files:
        return 'No file part', 400
    
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400

    if not os.path.exists('temp'):
        os.makedirs('temp')

    file_path = os.path.join('temp', file.filename)
    file.save(file_path)
    
    file_extension = file.filename.split('.')[-1].lower()
    if file_extension not in ['wav', 'mp3', 'ogg']:
        os.remove(file_path)
        return f'Unsupported file format: {file_extension}', 400

    try:
        res = predict_audio(file_path)
        return res
    except Exception as e:
        os.remove(file_path)
        return f'Error processing audio: {str(e)}', 500
    
@app.route('/protect_audio', methods=['POST'])
def handle_protect_audio():
    if 'file' in request.files:
        file = request.files['file']
        input_file_path = file.filename
        output_file_path = 'protected_' + input_file_path.split('.')[0] + '.wav'
        file_extension = input_file_path.split('.')[-1].lower()
        if file_extension in ['wav', 'mp3', 'ogg']:
            file.save(input_file_path)
            poison_audio(input_file_path, output_file_path)
            # Return the poisoned file
            return send_file(output_file_path, as_attachment=True)
        else:
            return f'Unsupported file format: {file_extension}'
    else:
        return 'No data received'
    
@app.route('/detect_video', methods=['POST'])
def handle_detect_video():
    if 'file' in request.files:
        file = request.files['file']
        file_path = file.filename
        file.save(file_path)
        file_extension = file.filename.split('.')[-1].lower()
        if file_extension in ['mp4', 'mkv', 'mov']:
            face_array = convert_video(file_path)
            predictions = predict_face_from_video(face_array)
            real = [pred['real'] for pred in predictions]
            fake = [pred['fake'] for pred in predictions]
            real_avg = sum(real) / len(real)
            fake_avg = sum(fake) / len(fake)
            print(real_avg, fake_avg)
            if len(predictions) != 0:
                return f"% Real: {real_avg * 100}, % Fake: {fake_avg * 100}"
            else:
                return f'Error processing video file: {file.filename}'
        else:
            return f'Unsupported file format: {file_extension}'
    else:
        return 'No data received'

if __name__ == '__main__':
    app.run()