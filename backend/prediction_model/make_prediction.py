# Module to make a prediction with a machine learning model.

# Package imports.
import pandas as pd
import pickle


# Make prediction function.
def make_prediction(
    model_filename,
    age,
    anaemia,
    creatinine_phosphokinase,
    diabetes,
    ejection_fraction,
    high_blood_pressure,
    platelets,
    serum_creatinine,
    sex,
    smoking
):

    # Prediction data.
    prediction_data = pd.DataFrame(data={
        'age': age,
        'anaemia': anaemia,
        'creatinine_phosphokinase': creatinine_phosphokinase,
        'diabetes': diabetes,
        'ejection_fraction': ejection_fraction,
        'high_blood_pressure': high_blood_pressure,
        'platelets': platelets,
        'serum_creatinine': serum_creatinine,
        'sex': sex,
        'smoking': smoking
    }, index=[0])

    # Machine learning model.
    machine_learning_model = pickle.load(open(model_filename, 'rb'))
    prediction = machine_learning_model.predict(prediction_data)[0]

    return prediction
