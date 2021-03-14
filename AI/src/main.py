# Heart failure prediction - Main program (Run evaluation).

# Package imports.
import datetime
import time

# Classes and methods imports.
from keras import Input, regularizers
from keras.layers.core import Dense, Dropout

# User module imports.
from argument_parser import ArgumentParserModule
from data_extractors import DatasetExtractor, SeedExtractor
from model_evaluator import ModelEvaluator
from training_models import KerasSequential, RandomForest

# Program metadata.
PROGRAM_NAME = 'src/main.py'
PROGRAM_DESCRIPTION = 'Program to evaluate training models on dataset data.'
VERSION_NUM = '1.0.1'

# Argument parser.
argparser = ArgumentParserModule(
    program_name=PROGRAM_NAME,
    description=PROGRAM_DESCRIPTION,
    version_num=VERSION_NUM
)
argparser.add_version_argument()
argparser.add_default_run_evaluation_args()
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
features_shape = dataset_extractor.get_features_shape()

# Extract the dataset split seeds.
dataset_split_seed_extractor = SeedExtractor(
    seeds_file_name='./data/seeds.csv',
    seeds_column_name='seed'
)
dataset_split_seed_extractor.extract_seeds()
dataset_split_seeds = dataset_split_seed_extractor.get_seeds()

# Model declaration example.

# model = KerasSequential(
#     layers=[
#         Input(shape=features_shape),
#         Dense(400, activation='relu'),
#         Dense(20, activation='relu'),
#         Dense(1, activation='sigmoid')
#     ]
# )

# model = RandomForest(
#     criterion='gini',
#     max_depth=None,
#     max_features='sqrt',
#     max_leaf_nodes=None,
#     min_samples_leaf=1,
#     min_samples_split=2,
#     n_estimators=10
# )

# Define the models.
models = []

for second_layer in range(20, 101, 20):
    models.append(KerasSequential(
        layers=[
            Input(shape=features_shape),
            Dense(
                500,
                activation='relu',
                kernel_regularizer=regularizers.l2(0.01)
            ),
            Dense(
                second_layer,
                activation='relu',
                kernel_regularizer=regularizers.l2(0.01)
            ),
            Dense(1, activation='sigmoid')
        ]
    ))

# Create model evaluator.
model_evaluator = ModelEvaluator(
    dataset_extractor=dataset_extractor,
    seed_list=dataset_split_seeds,
    models=models,
    num_validation_runs=20,
    num_test_runs=100,
    percent_of_models_tested=0.2,
    evaluation_number=30
)

# Start timing model evaluation, if requested.
if(args.show_evaluation_time):
    start_time = time.time()

# Evaluate models.
model_evaluator.evaluate_models()
model_evaluator.save_results_as_csv()
model_evaluator.print_results()

# Print model evaluation time, if requested.
if(args.show_evaluation_time):
    finish_time = time.time()
    evaluation_timedelta = datetime.timedelta(
        seconds=finish_time - start_time
    )
    formatted_evaluation_time = str(evaluation_timedelta.days).zfill(2) + \
        ':' + time.strftime('%T', time.gmtime(evaluation_timedelta.seconds))
    print("Time elapsed evaluating models:", formatted_evaluation_time)
    print("")
