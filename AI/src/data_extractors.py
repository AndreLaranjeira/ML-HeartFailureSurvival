# Heart failure prediction - Data extractors module.

# Package imports.
import numpy as np
import pandas as pd


# Dataset extractor.
class DatasetExtractor:
    def __init__(
        self,
        dataset_file_name,
        feature_columns_list,
        label_columns_list,
        train_size,
        validation_size=0,
        seed=None
    ):
        self.dataset = None
        self.dataset_file_name = dataset_file_name
        self.feature_columns_list = feature_columns_list
        self.label_columns_list = label_columns_list
        self.train_size = train_size
        self.validation_size = validation_size
        self.seed = seed
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

        print("Test features:\n")
        print(self.test_features)
        print("")

        print("Test labels:\n")
        print(self.test_labels)
        print("")

        if(self.validation_size > 0):
            print("Validation features:\n")
            print(self.validation_features)
            print("")

            print("Validation labels:\n")
            print(self.validation_labels)
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
        self.dataset_features = normalize_dataset(self.dataset_features)

    def _treat_label_data(self):
        self.dataset_labels = np.ravel(self.dataset_labels)


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
