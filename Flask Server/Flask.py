from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

# Load your SVM model
model = joblib.load('svm_model.pkl')

# @app.route('/parameter', methods=['POST'])
# def parameter_get():
#     # Get data from POST request
#     data = request.get_json()

    # # Validate the presence of all required parameters
    # required_params = ['nitrogen', 'phosphorus', 'potassium', 'temperature', 'humidity', 'ph', 'rainfall']
    # missing_params = [param for param in required_params if param not in data]
    # if missing_params:
    #     return jsonify({"error": f"Missing parameters: {', '.join(missing_params)}"}), 400

    # # Extract features for prediction
    # features = [data[param] for param in required_params]

    # # Make prediction
    # prediction = model.predict([features])

    # Send back the prediction
    # return jsonify({'prediction': prediction[0]})
    # return 'data';

@app.route('/home', methods=['GET'])
def home():
    return 'This is home'

@app.route('/parameter', methods=['POST'])
def demo_post():
    data = request.get_json();
    expected_keys = ['nitrogen', 'phosphorus', 'potassium', 'temperature', 'humidity', 'ph', 'rainfall']
    if not all(key in data for key in expected_keys):
        return "Invalid data", 400

    try:
        features = [float(data[key]) for key in expected_keys]  # or float(data[key])
    except ValueError:
        # Handle the case where conversion to integer fails
        return "Invalid input: all inputs must be numbers", 400
    print(features)
    prediction = model.predict([features])
    labels = {'apple': 0, 'banana': 1, 'blackgram': 2, 'chickpea': 3, 'coconut': 4, 'coffee': 5, 'cotton': 6, 'grapes': 7, 'jute': 8, 'kidneybeans': 9, 'lentil': 10, 'maize': 11, 'mango': 12, 'mothbeans': 13, 'mungbean': 14, 'muskmelon': 15, 'orange': 16, 'papaya': 17, 'pigeonpeas': 18, 'pomegranate': 19, 'rice': 20, 'watermelon': 21}
    def find_key_for_value(my_dict, value_to_find):
        for key, value in my_dict.items():
            if value == value_to_find:
                return key
        return None  # or some default value if the value isn't found

    key = find_key_for_value(labels, prediction)

    return str(key)

@app.route('/demo', methods=['GET'])
def demo_get():
    x = 2 + 3
    return str(x);

if __name__ == '__main__':
    app.run(debug=False, port=5000)
