# Heart failure prediction - Program to train a model and save it in a file.

# User module imports.
from argument_parser import ArgumentParserModule
from data_extractors import DatasetExtractor
from training_models import RandomForest

# Program metadata.
PROGRAM_NAME = 'src/train_model.py'
PROGRAM_DESCRIPTION = 'Program to train a single model and save it in a file'
VERSION_NUM = '1.0.0'

# Argument parser.
argparser = ArgumentParserModule(
    program_name=PROGRAM_NAME,
    description=PROGRAM_DESCRIPTION,
    version_num=VERSION_NUM
)
argparser.add_version_argument()
argparser.add_default_train_model_args()
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
    train_size=1,
    normalize_features=False
)
dataset_extractor.extract_dataset()
dataset_features, dataset_labels = \
    dataset_extractor.get_train_features_and_labels()

# Define the model.
model = RandomForest(
    criterion='gini',
    max_depth=None,
    max_features=None,
    max_leaf_nodes=19,
    min_samples_leaf=3,
    min_samples_split=8,
    n_estimators=215
)

# Fit the data and save the model.
model.fit(dataset_features, dataset_labels)
model.save(args.filename)
