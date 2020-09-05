# Program to train an AI to predict heart failure.

# Package imports.
import keras
import numpy as np
import pandas as pd
import tensorflow as tf

# User module imports.
from argument_parser import ArgumentParserModule
from data_extractor import DataExtractionModule

# Program metadata.
PROGRAM_NAME = 'heart_failure_prediction'
VERSION_NUM = '0.0.1'

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
    train_size=args.train_percent
)
data_extractor.extract_data()
train_features, train_labels = data_extractor.get_train_features_and_labels()
test_features, test_labels = data_extractor.get_test_features_and_labels()

