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
VERSION_NUM = '0.7.0'

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

# Create the models.
models = []

models.append(
    RandomForest(
        criterion='entropy',
        n_estimators=110,
        max_leaf_nodes=40,
        min_samples_leaf=8,
        min_samples_split=6
    )
)

models.append(
    RandomForest(
        criterion='entropy',
        n_estimators=260,
        max_leaf_nodes=40,
        min_samples_leaf=9,
        min_samples_split=8
    )
)

for m in models:
    print(m.get_params())

# Train the models.
number_of_runs = len(dataset_split_seeds)
results = []

for training_model in models:

    avg_acc = 0
    avg_f1 = 0

    for run in range(number_of_runs):

        print("Seed: %d\n" % (dataset_split_seeds[run]))

        dataset_extractor.set_randomizing_seed(dataset_split_seeds[run])
        dataset_extractor.generate_new_data_split()
        train_features, train_labels = \
            dataset_extractor.get_train_features_and_labels()
        test_features, test_labels = \
            dataset_extractor.get_test_features_and_labels()

        training_model.train(
            train_features=train_features,
            train_labels=train_labels
        )

        test_predictions = training_model.predict(
            test_features
        )

        # Analyse results.
        result_metrics = ResultMetricsModule(
            test_predictions,
            test_labels
        )

        avg_acc += result_metrics.accuracy_score()
        avg_f1 += result_metrics.f1_score()

    avg_acc /= number_of_runs
    avg_f1 /= number_of_runs

    results.append(
        (training_model.get_params(), avg_acc, avg_f1)
    )

print(sorted(results, reverse=True, key=lambda x: x[1]))

# Save the training model weights.
# if(input('Should this model be saved? [y/N] ').lower() == 'y'):
#     training_model.save()
