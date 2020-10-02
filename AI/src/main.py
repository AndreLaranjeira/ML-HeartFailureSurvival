# Program to train an AI to predict heart failure.

# Classes and methods imports.
from keras import Input
from keras.layers.core import Dense
from keras.regularizers import L2

# User module imports.
from argument_parser import ArgumentParserModule
from data_extractors import DatasetExtractor, SeedExtractor
from training_models import KerasSequential, RandomForest
from result_metrics import ResultMetricsModule

# Program metadata.
PROGRAM_NAME = 'heart_failure_prediction'
VERSION_NUM = '0.8.0'

# Argument parser.
argparser = ArgumentParserModule(PROGRAM_NAME, VERSION_NUM)
argparser.add_default_args()
args = argparser.parse_args()

# Extract the data.
dataset_extractor = DatasetExtractor(
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
dataset_extractor.extract_dataset()

# Extract the dataset split seeds.
dataset_split_seed_extractor = SeedExtractor(
    seeds_file_name='./data/seeds.csv',
    seeds_column_name='seed'
)
dataset_split_seed_extractor.extract_seeds()
dataset_split_seeds = dataset_split_seed_extractor.get_seeds()

dataset_extractor.set_randomizing_seed(dataset_split_seeds[0])
dataset_extractor.generate_new_data_split()
train_features, train_labels = \
    dataset_extractor.get_train_features_and_labels()
validation_features, validation_labels = \
    dataset_extractor.get_test_features_and_labels()

# model = KerasSequential(
#     layers=[
#         Input(shape=train_features.shape[1]),
#         Dense(400, activation='relu'),
#         Dense(20, activation='relu'),
#         Dense(1, activation='sigmoid')
#     ]
# )

model = RandomForest(
    criterion='entropy',
    n_estimators=110,
    max_leaf_nodes=40,
    min_samples_leaf=8,
    min_samples_split=6
)

results = model.fit(
    train_features=train_features,
    train_labels=train_labels
)

print(results)

