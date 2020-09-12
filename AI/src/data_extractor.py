# Heart failure prediction - Data extraction module.

# Package imports.
import numpy as np
import pandas as pd


# Data extraction module.
class DataExtractionModule:
    def __init__(
        self,
        dataset_file_name,
        feature_columns_list,
        label_columns_list,
        train_size,
        validation_size=0,
        seed=None
    ):
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

    def extract_data(self):
        self.read_dataset()
        self.randomize_dataset()
        self.split_data_into_features_and_labels()
        self.treat_feature_data()
        self.split_features_and_labels_into_train_test_and_validation()

    def get_test_features_and_labels(self):
        return self.test_features, self.test_labels

    def get_train_features_and_labels(self):
        return self.train_features, self.train_labels

    def get_validation_features_and_labels(self):
        return self.validation_features, self.validation_labels

    def normalize_dataset(self, dataset):
        dataset_mean = dataset.mean()
        dataset_max = dataset.max()
        dataset_min = dataset.min()
        return (dataset - dataset_mean) / (dataset_max - dataset_min)

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

        print("Validation features:\n")
        print(self.validation_features)
        print("")

        print("Validation labels:\n")
        print(self.validation_labels)
        print("")

    def randomize_dataset(self):
        self.dataset_data = self.dataset_data.sample(
            frac=1,
            random_state=self.seed
        )

    def read_dataset(self):
        self.dataset_data = pd.read_csv(
            filepath_or_buffer=self.dataset_file_name,
            usecols=self.feature_columns_list + self.label_columns_list
        )

    def split_data_into_features_and_labels(self):
        self.dataset_features = self.dataset_data.drop(
            self.label_columns_list,
            axis=1
        )
        self.dataset_labels = self.dataset_data[self.label_columns_list]

    def split_features_and_labels_into_train_test_and_validation(self):
        self.split_features_into_train_test_validation()
        self.split_labels_into_train_test_validation()

    def split_features_into_train_test_validation(self):
        training_features_index = int(
            self.train_size * len(self.dataset_features)
        )
        validation_features_index = int(
            (self.train_size + self.validation_size) *
            len(self.dataset_features)
        )

        self.train_features, self.validation_features, self.test_features = \
            np.split(
                self.dataset_features, [
                    training_features_index,
                    validation_features_index
                ]
            )

    def split_labels_into_train_test_validation(self):
        training_labels_index = int(
            self.train_size * len(self.dataset_labels)
        )
        validation_labels_index = int(
            (self.train_size + self.validation_size) *
            len(self.dataset_labels)
        )

        self.train_labels, self.validation_labels, self.test_labels = \
            np.split(
                self.dataset_labels, [
                    training_labels_index,
                    validation_labels_index
                ]
            )

    def treat_feature_data(self):
        self.dataset_features = self.normalize_dataset(self.dataset_features)
