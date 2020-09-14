# Program to train an AI to predict heart failure.

# Classes and methods imports.
from keras import Input
from keras.layers.core import Dense

# User module imports.
from argument_parser import ArgumentParserModule
from data_extractor import DataExtractionModule
from keras_sequential_model import KerasSequential
from result_metrics import ResultMetricsModule

# Program metadata.
PROGRAM_NAME = 'heart_failure_prediction'
VERSION_NUM = '0.5.0'

# Argument parser.
argparser = ArgumentParserModule(PROGRAM_NAME, VERSION_NUM)
argparser.add_default_args()
args = argparser.parse_args()

# Extract the data.
data_extractor = DataExtractionModule(
    dataset_file_name='./data/data.csv',
    feature_columns_list=[
        'age',
        'anaemia',
        'creatinine_phosphokinase',
        'diabetes',
        'ejection_fraction',
        'high_blood_pressure',
        'platelets',
        'serum_creatinine',
        'sex',
        'smoking'
    ],
    label_columns_list=['DEATH_EVENT'],
    train_size=args.train_size,
    validation_size=args.validation_size
)
data_extractor.extract_data()
train_features, train_labels = data_extractor.get_train_features_and_labels()
test_features, test_labels = data_extractor.get_test_features_and_labels()
validation_features, validation_labels = \
    data_extractor.get_validation_features_and_labels()

# Train the model.
training_model = KerasSequential(
    layers=[
        Input(shape=train_features.shape[1]),
        Dense(400, activation='relu'),
        Dense(20, activation='relu'),
        Dense(1, activation='sigmoid')
    ]
)

training_model.train(
    train_features=train_features,
    train_labels=train_labels,
    batch_size=args.batch_size,
    epochs=args.epochs,
    validation_data=(validation_features, validation_labels)
)

test_predictions = training_model.predict(test_features)

# Analyse results.
result_metrics = ResultMetricsModule(test_predictions, test_labels)
result_metrics.print_default_metrics()

# Save the training model weights.
if(input('Should this model be saved? [y/N] ').lower() == 'y'):
    training_model.save()
