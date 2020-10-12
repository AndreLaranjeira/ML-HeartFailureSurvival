# Heart failure prediction - Result metrics module.

# Package imports.
import numpy as np

# Classes and methods imports.
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, \
    matthews_corrcoef, precision_score, recall_score, roc_auc_score


# Result metrics module definition.
class ResultMetricsModule:
    def __init__(self, predictions, labels):
        self.labels = labels
        self.predictions = predictions

    def accuracy_score(self):
        return accuracy_score(self.labels, self.predictions)

    def confusion_matrix(self):
        return confusion_matrix(self.labels, self.predictions)

    def f1_score(self):
        return f1_score(self.labels, self.predictions)

    def matthews_corrcoef(self):
        return matthews_corrcoef(
            change_zeros_to_minus_one(self.labels),
            change_zeros_to_minus_one(self.predictions)
        )

    def precision_score(self):
        return precision_score(self.labels, self.predictions)

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
        return recall_score(self.labels, self.predictions)

    def roc_auc_score(self):
        return roc_auc_score(self.labels, self.predictions)


# Auxiliary functions.
def change_zeros_to_minus_one(values):
    return np.vectorize(lambda value: -1 if value == 0 else value)(values)
