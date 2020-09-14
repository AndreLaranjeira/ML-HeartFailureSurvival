# Heart failure prediction - Keras sequential model module.

# Package imports.
import keras
import numpy as np

# Classes and methods imports.
from keras import Sequential

# Constants:
DEFAULT_FILE_NAME = 'default_save'
FALLBACK_FILE_NAME = 'fallback_save'


# Keras sequential model.
class KerasSequential:
    def __init__(self, layers):
        self.file_extension = '.h5'
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

    def save(self):
        filename = filename_input_reader(file_extension=self.file_extension)
        save_file_with_fallback(
            save_method_or_function=self.model.save,
            filename=filename,
            fallback_filename=FALLBACK_FILE_NAME+self.file_extension
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


# Auxiliary functions.
def does_filename_end_with_extension(filename_tested, expected_extension):
    return (expected_extension == filename_tested[-len(expected_extension):])


def filename_input_reader(file_extension):
    filename_input = input(
        'Insert a filename or press ENTER for the default file name: '
    )
    if(filename_input == ''):
        return DEFAULT_FILE_NAME + file_extension
    elif(not does_filename_end_with_extension(filename_input, file_extension)):
        return filename_input + file_extension
    else:
        return filename_input


def save_file_with_fallback(
    save_method_or_function,
    filename,
    fallback_filename
):
    try:
        save_method_or_function(filename)
    except OSError as e:
        print("")
        print("An error during the save operation! Error:")
        print(e)
        print("")
        print("Starting fallback save with name '" + fallback_filename + "'!")
        save_method_or_function(fallback_filename)
