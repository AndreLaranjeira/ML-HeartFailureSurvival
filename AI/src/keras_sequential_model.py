# Heart failure prediction - Keras sequential model module.

# Package imports.
import keras
import numpy as np

# Classes and methods imports.
from keras import Sequential


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

    def predict(self, test_features):
        return np.round(self.model.predict(test_features))

    def print_summary(self):
        print("")
        print("Model summary: \n")
        print(self.model.summary())
        print("")

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
