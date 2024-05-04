from flask import Flask, jsonify, request
import joblib

app = Flask(__name__)

model = joblib.load('random_forest_model.pkl')

@app.route('/test', methods = ['GET'])
def test():
    data = {'message': 'successful'}
    return jsonify(data)


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    expected_keys = ['age_of_car', 'age_of_policyholder', 'fuel_type', 'airbags', 'rear_brakes_type', 'transmission_type', 'gear_box', 'steering_type', 'is_front_fog_lights', 'is_power_steering']
    if not all(key in data for key in expected_keys):
        return "Invalid data", 400

    try:
        # Convert categorical variables to their encoded values
        fuel_type_mapping = {'CNG': 0, 'Diesel': 1, 'Petrol': 2}
        rear_brakes_type_mapping = {'Disc': 0, 'Drum': 1}
        transmission_type_mapping = {'Automatic': 0, 'Manual': 1}
        steering_type_mapping = {'Electric': 0, 'Manual': 1, 'Power': 2}
        is_front_fog_lights_mapping = {'No': 0, 'Yes': 1}
        is_power_steering_mapping = {'No': 0, 'Yes': 1}

        features = [
            data['age_of_car'],
            data['age_of_policyholder'],
            fuel_type_mapping[data['fuel_type']],
            data['airbags'],
            rear_brakes_type_mapping[data['rear_brakes_type']],
            transmission_type_mapping[data['transmission_type']],
            data['gear_box'],
            steering_type_mapping[data['steering_type']],
            is_front_fog_lights_mapping[data['is_front_fog_lights']],
            is_power_steering_mapping[data['is_power_steering']]
        ]
    except KeyError:
        # Handle the case where conversion to integer fails
        return "Invalid input: all inputs must be numbers", 400

    prediction = model.predict([features])

    labels = {0: 'No Claim', 1: 'Claim'}

    return labels[prediction[0]]


if __name__ == '__main__':
    app.run(host='192.168.0.107', port=5000, debug=True)