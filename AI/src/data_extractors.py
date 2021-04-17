# Heart failure prediction - Data extractors module.

# Package imports.
import ast
import numpy as np
import pandas as pd

# User module imports.
from file_operations import DefaultFilenames, FileOperations


# Dataset extractor.
class DatasetExtractor:
    def __init__(
        self,
        dataset_file_name,
        feature_columns_list,
        label_columns_list,
        train_size,
        validation_size=0,
        seed=None,
        normalize_features=True
    ):
        self.dataset = None
        self.dataset_file_name = dataset_file_name
        self.feature_columns_list = feature_columns_list
        self.label_columns_list = label_columns_list
        self.normalize_features = normalize_features
        self.seed = seed
        self.train_size = train_size
        self.validation_size = validation_size
        self.dataset_features_shape = None
        self.train_features = None
        self.train_labels = None
        self.validation_features = None
        self.validation_labels = None
        self.test_features = None
        self.test_labels = None

    def extract_dataset(self):
        self._read_dataset()
        self.generate_new_data_split()

    def generate_new_data_split(self):
        if(self.dataset is not None):
            self._randomize_dataset()
            self._split_data_into_features_and_labels()
            self._treat_feature_and_label_data()
            self._split_features_and_labels_into_train_test_and_validation()
        else:
            raise RuntimeError("No data to split because none was extracted!")

    def get_features_shape(self):
        return self.dataset_features_shape

    def get_randomizing_seed(self):
        return self.seed

    def get_test_features_and_labels(self):
        return self.test_features, self.test_labels

    def get_train_features_and_labels(self):
        return self.train_features, self.train_labels

    def get_validation_features_and_labels(self):
        return self.validation_features, self.validation_labels

    def print_extracted_data(self):
        print("")
        print("Extracted data:\n")

        print("Training features:\n")
        print(self.train_features)
        print("")

        print("Training labels:\n")
        print(self.train_labels)
        print("")

        if(self.validation_size > 0):
            print("Validation features:\n")
            print(self.validation_features)
            print("")

            print("Validation labels:\n")
            print(self.validation_labels)
            print("")

        print("Test features:\n")
        print(self.test_features)
        print("")

        print("Test labels:\n")
        print(self.test_labels)
        print("")

    def set_randomizing_seed(self, new_seed):
        self.seed = new_seed

    # Private methods.
    def _randomize_dataset(self):
        self.dataset = self.dataset.sample(
            frac=1,
            random_state=self.seed
        )

    def _read_dataset(self):
        self.dataset = pd.read_csv(
            filepath_or_buffer=self.dataset_file_name,
            usecols=self.feature_columns_list + self.label_columns_list
        )

    def _split_data_into_features_and_labels(self):
        self.dataset_features = self.dataset.drop(
            self.label_columns_list,
            axis=1
        )
        self.dataset_features_shape = self.dataset_features.shape[1]
        self.dataset_labels = self.dataset[self.label_columns_list]

    def _split_features_and_labels_into_train_test_and_validation(self):
        self._split_features_into_train_test_validation()
        self._split_labels_into_train_test_validation()

    def _split_features_into_train_test_validation(self):
        train_features_index = int(
            self.train_size * len(self.dataset_features)
        )
        validation_features_index = int(
            (self.train_size + self.validation_size) *
            len(self.dataset_features)
        )

        self.train_features, self.validation_features, self.test_features = \
            np.split(
                self.dataset_features, [
                    train_features_index,
                    validation_features_index
                ]
            )

    def _split_labels_into_train_test_validation(self):
        train_labels_index = int(
            self.train_size * len(self.dataset_labels)
        )
        validation_labels_index = int(
            (self.train_size + self.validation_size) *
            len(self.dataset_labels)
        )

        self.train_labels, self.validation_labels, self.test_labels = \
            np.split(
                self.dataset_labels, [
                    train_labels_index,
                    validation_labels_index
                ]
            )

    def _treat_feature_and_label_data(self):
        self._treat_feature_data()
        self._treat_label_data()

    def _treat_feature_data(self):
        if(self.normalize_features):
            self.dataset_features = normalize_dataset(self.dataset_features)

    def _treat_label_data(self):
        self.dataset_labels = np.ravel(self.dataset_labels)


# Results extractor.
class ResultsExtractor:
    def __init__(
        self,
        evaluation_number,
        model_number
    ):
        self.evaluation_number = evaluation_number
        self.model_number = model_number
        self.results = None
        self.results_filename = FileOperations.apply_extension_to_filename(
            original_filename=DefaultFilenames.evaluation_results_filename(
                evaluation_number=evaluation_number
            ),
            file_extension='.csv'
        )

    def extract_results(self):
        results_dataframe = pd.read_csv(
            filepath_or_buffer=self.results_filename
        )
        results_dataframe_model_number_range = range(
            int(results_dataframe.head(1)['model_number']),
            int(results_dataframe.tail(1)['model_number']) + 1
        )

        if(self.model_number in results_dataframe_model_number_range):
            raw_results = results_dataframe.loc[
                self.model_number, [
                    'model_number',
                    'model_type',
                    'model_params',
                    'all_test_scores',
                    'mean_test_score',
                    'all_validation_scores',
                    'mean_validation_score'
                ]
            ].to_dict()
            self.results = self._treat_raw_results(raw_results)
        else:
            raise RuntimeError("Model number does not exist in results file!")

    def get_all_results(self):
        if(self.results is not None):
            return self.results
        else:
            raise RuntimeError("No results were extracted!")

    def get_test_scores(self):
        if(self.results is not None):
            return self.results['all_test_scores']
        else:
            raise RuntimeError("No results were extracted!")

    def get_validation_scores(self):
        if(self.results is not None):
            return self.results['all_validation_scores']
        else:
            raise RuntimeError("No results were extracted!")

    # Private methods.
    def _copy_keys_applying_literal_evaluation(
        self,
        destination_dict,
        origin_dict,
        keys
    ):
        for key in keys:
            destination_dict[key] = ast.literal_eval(origin_dict[key])

    def _copy_keys_decoding_mean_score(
        self,
        destination_dict,
        origin_dict,
        keys
    ):
        for key in keys:
            destination_dict[key] = self._decode_mean_score(origin_dict[key])

    def _copy_keys_with_no_treatment(
        self,
        destination_dict,
        origin_dict,
        keys
    ):
        for key in keys:
            destination_dict[key] = origin_dict[key]

    def _decode_mean_score(self, mean_score):
        try:
            float_value = float(mean_score)
            return float_value
        except ValueError:
            return None

    def _treat_raw_results(self, raw_results):
        treated_results = dict()

        self._copy_keys_with_no_treatment(
            destination_dict=treated_results,
            origin_dict=raw_results,
            keys=[
                'model_number',
                'model_type'
            ]
        )
        self._copy_keys_applying_literal_evaluation(
            destination_dict=treated_results,
            origin_dict=raw_results,
            keys=[
                'model_params',
                'all_test_scores',
                'all_validation_scores'
            ]
        )
        self._copy_keys_decoding_mean_score(
            destination_dict=treated_results,
            origin_dict=raw_results,
            keys=[
                'mean_test_score',
                'mean_validation_score'
            ]
        )

        return treated_results


# Seed extractor.
class SeedExtractor:
    def __init__(
        self,
        seeds_file_name,
        seeds_column_name
    ):
        self.seeds = None
        self.seeds_column_name = seeds_column_name
        self.seeds_file_name = seeds_file_name

    def extract_seeds(self):
        seeds_dataframe = pd.read_csv(
            filepath_or_buffer=self.seeds_file_name
        )
        self.seeds = seeds_dataframe[self.seeds_column_name].values.tolist()

    def get_seeds(self):
        return self.seeds


# Auxiliary functions.
def normalize_dataset(dataset):
    dataset_mean = dataset.mean()
    dataset_max = dataset.max()
    dataset_min = dataset.min()
    return (dataset - dataset_mean) / (dataset_max - dataset_min)
