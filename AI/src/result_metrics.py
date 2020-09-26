# Heart failure prediction - Result metrics module.

# Package imports.
import numpy as np

# Classes and methods imports.
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, \
    matthews_corrcoef, precision_score, recall_score, roc_auc_score


# Result metrics module definition.
class ResultMetricsModule:
    def __init__(self, test_predictions, test_labels):
        self.test_labels = test_labels
        self.test_predictions = test_predictions

    def accuracy_score(self):
        return accuracy_score(self.test_labels, self.test_predictions)

    def confusion_matrix(self):
        return confusion_matrix(self.test_labels, self.test_predictions)

    def f1_score(self):
        return f1_score(self.test_labels, self.test_predictions)

    def matthews_corrcoef(self):
        return matthews_corrcoef(
            change_zeros_to_minus_one(self.test_labels),
            change_zeros_to_minus_one(self.test_predictions)
        )

    def precision_score(self):
        return precision_score(self.test_labels, self.test_predictions)

    def print_default_metrics(self):
        self.print_metrics([
            'accuracy',
            'confusion_matrix',
            'matthews_corrcoef'
        ])

    def print_metrics(self, metrics):
        print("")
        print("Result metrics:\n")

        for metric in map(str.lower, metrics):
            if(metric == 'accuracy'):
                print("Accuracy: ", round(self.accuracy_score(), 2), "\n")
            elif(metric == 'confusion_matrix'):
                print("Confusion matrix: \n")
                print(self.confusion_matrix())
                print("")
            elif(metric == 'f1_score'):
                print("F1 score: ", round(self.f1_score(), 2), "\n")
            elif(metric == 'matthews_corrcoef'):
                print(
                    "Matthews' correlation coeficient: ",
                    round(self.matthews_corrcoef(), 2), "\n"
                )
            elif(metric == 'precision_score'):
                print("Precision: ", round(self.precision_score(), 2), "\n")
            elif(metric == 'recall_score'):
                print("Recall score: ", round(self.recall_score(), 2), "\n")
            elif(metric == 'roc_auc_score'):
                print("ROC AUC score: ", round(self.roc_auc_score(), 2), "\n")

    def recall_score(self):
        return recall_score(self.test_labels, self.test_predictions)

    def roc_auc_score(self):
        return roc_auc_score(self.test_labels, self.test_predictions)


# Auxiliary functions.
def change_zeros_to_minus_one(labels):
    return np.vectorize(lambda num: -1 if num == 0 else num)(labels)
