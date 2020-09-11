# Heart failure prediction - Keras sequential model module.

# Package imports.
import keras
import numpy as np

# Classes and methods imports.
from keras import Sequential
from sklearn.metrics import confusion_matrix


# Keras sequential model.
class KerasSequential:
    def __init__(self, layers):
        self.model = Sequential()

        for layer in layers:
            self.model.add(layer)

        self.model.compile(
            loss=keras.losses.binary_crossentropy,
            optimizer=keras.optimizers.Adadelta(),
            metrics=['accuracy']
        )

    def train(
        self,
        train_features,
        train_labels,
        batch_size,
        epochs,
        validation_data
    ):
        self.model.fit(
            train_features,
            train_labels,
            batch_size=batch_size,
            epochs=epochs,
            verbose=1,
            validation_data=validation_data
        )

    def test(
        self,
        test_features,
        test_labels
    ):
        test_predictions = self.model.predict(test_features)
        test_predictions = np.round(test_predictions)

        print(confusion_matrix(test_labels, test_predictions))
