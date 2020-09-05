# Heart failure prediction - Data extraction module.

# Package imports.
import pandas as pd
from sklearn import model_selection


# Data extraction module.
class DataExtractionModule:
    def __init__(
        self,
        dataset_file_name,
        feature_columns_list,
        label_columns_list,
        train_size
    ):
        self.dataset_file_name = dataset_file_name
        self.feature_columns_list = feature_columns_list
        self.label_columns_list = label_columns_list
        self.train_size = train_size
        self.train_features = None
        self.train_labels = None
        self.test_features = None
        self.test_labels = None

    def extract_data(self):
        self.read_data()
        self.split_features_and_labels()
        self.treat_feature_data()
        self.split_train_and_test_features_and_labels()

    def get_train_features_and_labels(self):
        return self.train_features, self.train_labels

    def get_test_features_and_labels(self):
        return self.test_features, self.test_labels

    def normalize_dataset(self, dataset):
        dataset_mean = dataset.mean()
        dataset_max = dataset.max()
        dataset_min = dataset.min()
        return (dataset - dataset_mean) / (dataset_max - dataset_min)

    def read_data(self):
        self.dataset_data = pd.read_csv(
            filepath_or_buffer=self.dataset_file_name,
            usecols=self.feature_columns_list + self.label_columns_list
        )

    def split_features_and_labels(self):
        self.dataset_features = self.dataset_data.drop(
            self.label_columns_list,
            axis=1
        )
        self.dataset_labels = self.dataset_data[self.label_columns_list]

    def split_train_and_test_features_and_labels(self):
        train_features, test_features, train_labels, test_labels = \
            model_selection.train_test_split(
                self.dataset_features,
                self.dataset_labels,
                train_size=self.train_size
            )

        self.train_features = train_features
        self.test_features = test_features
        self.train_labels = train_labels
        self.test_labels = test_labels

    def treat_feature_data(self):
        self.dataset_features = self.normalize_dataset(self.dataset_features)
