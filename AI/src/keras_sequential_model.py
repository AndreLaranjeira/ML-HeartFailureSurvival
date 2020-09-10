# Heart failure prediction - Keras sequential model module.

# Package imports.
import keras
from keras import Sequential


# Keras sequential model.
class KerasSequential:
    def __init__(self, layers):
        self.model = Sequential()

        for layer in layers:
            self.model.add(layer)

        self.model.compile(
            loss=keras.losses.categorical_crossentropy,
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
