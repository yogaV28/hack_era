from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import cv2
import time
from flask_cors import CORS
import os
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the TensorFlow Lite model
MODEL_PATH = "model.tflite"  # Update this path to your model file

# Check if model file exists
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

# Load TFLite model and allocate tensors
interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
interpreter.allocate_tensors()

# Get input and output tensors
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Get model input shape
input_shape = input_details[0]['shape']
input_height = input_shape[1]
input_width = input_shape[2]

# Define class labels
class_labels = ["blood-loss", "fire-burn", "normal-faint", "poison"]

def preprocess_image(image, target_size=(224, 224)):
    """Preprocess the image for model input"""
    # Resize image
    image = cv2.resize(image, target_size)
    
    # Convert to RGB if it's BGR
    if image.shape[-1] == 3:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Normalize pixel values
    image = image.astype(np.float32) / 255.0
    
    # Expand dimensions to match model input shape
    image = np.expand_dims(image, axis=0)
    
    return image

@app.route('/')
def home():
    return """
    <html>
        <head>
            <title>Emergency Classification API</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                h1 { color: #e11d48; }
                pre { background-color: #f1f1f1; padding: 10px; border-radius: 5px; }
            </style>
        </head>
        <body>
            <h1>Emergency Classification API</h1>
            <p>This API provides emergency situation classification using a TensorFlow Lite model.</p>
            <h2>Endpoints:</h2>
            <h3>POST /predict</h3>
            <p>Send an image file to classify the emergency situation.</p>
            <pre>
curl -X POST -F "image=@your_image.jpg" http://localhost:5000/predict
            </pre>
            <p>The response will be a JSON object with the emergency type, confidence score, and inference time.</p>
        </body>
    </html>
    """

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    
    try:
        # Read image file
        image = Image.open(io.BytesIO(file.read()))
        image = np.array(image)
        
        # Start timing
        start_time = time.time()
        
        # Preprocess the image
        processed_image = preprocess_image(image, target_size=(input_height, input_width))
        
        # Set the tensor to point to the input data to be inferred
        interpreter.set_tensor(input_details[0]['index'], processed_image)
        
        # Run the inference
        interpreter.invoke()
        
        # Get the output
        output_data = interpreter.get_tensor(output_details[0]['index'])
        
        # End timing
        inference_time = time.time() - start_time
        
        # Get prediction
        prediction = np.squeeze(output_data)
        class_idx = np.argmax(prediction)
        confidence = float(prediction[class_idx])
        
        # Get class label
        if class_idx < len(class_labels):
            emergency_type = class_labels[class_idx]
        else:
            emergency_type = "unknown"
        
        return jsonify({
            'emergency_type': emergency_type,
            'confidence': confidence,
            'inference_time': inference_time
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Emergency Classification API is running!")
    print(f"Model input shape: {input_shape}")
    print(f"Class labels: {class_labels}")
    app.run(debug=True, host='0.0.0.0')
