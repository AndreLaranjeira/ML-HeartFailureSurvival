# Heart failure prediction - Training models module.

# Package imports.
import keras
import numpy as np
import pickle

# Classes and methods imports.
from abc import ABC, abstractmethod
from keras import Sequential
from sklearn.ensemble import RandomForestClassifier

# User module imports.
from file_operations import DefaultFilenames, FileOperations
from result_metrics import ResultMetricsModule


# Base training model class.
class BaseTrainingModel(ABC):
    # Abstract methods.
    # Fit the model with any aditional parameters.
    @abstractmethod
    def fit(self, train_features, train_labels, aditional_params):
        pass

    # Return a dictionary with all relevant model parameters.
    @abstractmethod
    def get_params(self):
        pass

    # Return the type of the model.
    @abstractmethod
    def get_type(self):
        pass

    # Predict the features and apply an after treatment to the results.
    @abstractmethod
    def predict(self, test_features, after_treatment):
        pass

    # Reset the model, forgetting all the data it fitted.
    @abstractmethod
    def reset(self):
        pass

    # Save the model. If filename is None, use a defaul file name.
    @abstractmethod
    def save(self, filename=None):
        pass

    # Use training and validation data to determine validation accuracy and
    # best hyperparameters.
    @abstractmethod
    def validate(
        self,
        train_features,
        train_labels,
        validation_features,
        validation_labels,
        aditional_params
    ):
        pass


# Keras sequential model.
class KerasSequential(BaseTrainingModel):
    def __init__(self, layers):
        self.default_fit_params = {
            'epochs': 20000,
            'batch_size': 15,
            'verbose': 0,
            'validation_data': None
        }
        self.file_extension = '.h5'
        self.layers = layers

        self._compile_model()
        self.initial_weights = self.model.get_weights()

    def fit(
        self,
        train_features,
        train_labels,
        aditional_params=None
    ):
        if(aditional_params is None):
            aditional_params = self.default_fit_params

        return self.model.fit(
            train_features,
            train_labels,
            batch_size=aditional_params['batch_size'],
            epochs=aditional_params['epochs'],
            verbose=aditional_params['verbose'],
            validation_data=aditional_params['validation_data']
        )

    def get_params(self):
        return {
            'layers': list(map(
                self._relevant_layer_info,
                self.layers
            ))
        }

    def get_type(self):
        return 'keras_sequential'

    def predict(self, test_features, after_treatment):
        return after_treatment(self.model.predict(test_features))

    def print_summary(self):
        print("")
        print("Model summary: \n")
        print(self.model.summary())
        print("")

    def reset(self):
        self.model.set_weights(self.initial_weights)

    def save(self, filename=DefaultFilenames.MODEL_FILENAME):
        filename_with_extension = FileOperations.apply_extension_to_filename(
            original_filename=filename,
            file_extension=self.file_extension
        )

        FileOperations.save_file_with_fallback(
            save_method_or_function=self.model.save,
            filename=filename_with_extension,
            fallback_filename=FileOperations.apply_extension_to_filename(
                original_filename=DefaultFilenames.MODEL_FALLBACK,
                file_extension=self.file_extension
            )
        )

    def validate(
        self,
        train_features,
        train_labels,
        validation_features,
        validation_labels,
        aditional_params=None
    ):
        if(aditional_params is None):
            aditional_params = self.default_fit_params

        aditional_params['validation_data'] = \
            (validation_features, validation_labels)

        self.reset()

        training_history = self.fit(
            train_features,
            train_labels,
            aditional_params=aditional_params
        ).history

        validation_accuracy_history = training_history['val_accuracy']
        validation_loss_history = training_history['val_loss']

        best_validation_epoch_index = validation_loss_history.index(
            min(validation_loss_history)
        )

        best_num_of_training_epochs = best_validation_epoch_index + 1

        validation_accuracy = \
            validation_accuracy_history[best_validation_epoch_index]

        return (
            round(validation_accuracy, 2),
            {'epochs': best_num_of_training_epochs}
        )

    # Private methods.
    def _add_relevant_layer_config_params(self, layer, relevant_info_dict):
        relevant_config_keys = self._get_relevant_config_keys(
            type(layer).__name__
        )
        all_layer_config_params = layer.get_config()

        for key in relevant_config_keys:
            relevant_info_dict[key] = all_layer_config_params[key]

        return relevant_info_dict

    def _compile_model(self):
        self.model = Sequential()

        for layer in self.layers:
            self.model.add(layer)

        self.model.compile(
            loss=keras.losses.binary_crossentropy,
            optimizer=keras.optimizers.Adadelta(),
            metrics=['accuracy']
        )

    def _get_relevant_config_keys(self, layer_type_name):
        if(layer_type_name == 'Dense'):
            return ('units', 'activation', 'use_bias', 'kernel_regularizer')
        elif(layer_type_name == 'Dropout'):
            return ('rate', 'noise_shape')

    def _relevant_layer_info(self, layer):
        if(hasattr(layer, 'get_config') and callable(layer.get_config)):
            relevant_info = {'type': type(layer).__name__}
            return self._add_relevant_layer_config_params(layer, relevant_info)

        elif(type(layer).__name__ == 'KerasTensor'):
            return {
                'type': 'Input',
                'shape': tuple(layer.shape)
            }

        else:
            return {'type': type(layer).__name__}


# Random forests model.
class RandomForest(BaseTrainingModel):
    def __init__(
        self,
        n_estimators=10,
        criterion='gini',
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        max_features='auto',
        max_leaf_nodes=None
    ):
        self.default_fit_params = {}
        self.file_extension = '.rf.sav'
        self.model = RandomForestClassifier(
            n_estimators=n_estimators,
            criterion=criterion,
            max_depth=max_depth,
            min_samples_split=min_samples_split,
            min_samples_leaf=min_samples_leaf,
            max_features=max_features,
            max_leaf_nodes=max_leaf_nodes
        )

    def fit(self, train_features, train_labels, aditional_params=None):
        if(aditional_params is None):
            aditional_params = self.default_fit_params

        return self.model.fit(train_features, train_labels)

    def get_params(self):
        model_params = self.model.get_params()
        return {
            'n_estimators': model_params['n_estimators'],
            'criterion': model_params['criterion'],
            'max_depth': model_params['max_depth'],
            'min_samples_split': model_params['min_samples_split'],
            'min_samples_leaf': model_params['min_samples_leaf'],
            'max_features': model_params['max_features'],
            'max_leaf_nodes': model_params['max_leaf_nodes']
        }

    def get_type(self):
        return 'random_forest'

    def predict(self, test_features, after_treatment):
        return after_treatment(self.model.predict(test_features))

    def reset(self):
        # Calling the fit method in a SKLearn model already resets the model.
        # But this method needs to exist for consistency with the base class.
        pass

    def save(self, filename=DefaultFilenames.MODEL_FILENAME):
        filename_with_extension = FileOperations.apply_extension_to_filename(
            original_filename=filename,
            file_extension=self.file_extension
        )

        FileOperations.save_file_with_fallback(
            save_method_or_function=self._dump_model_to_file_with_pickle,
            filename=filename_with_extension,
            fallback_filename=FileOperations.apply_extension_to_filename(
                original_filename=DefaultFilenames.MODEL_FALLBACK,
                file_extension=self.file_extension
            )
        )

    def validate(
        self,
        train_features,
        train_labels,
        validation_features,
        validation_labels,
        aditional_params=None
    ):
        self.fit(train_features, train_labels, aditional_params)
        validation_predictions = self.predict(validation_features, np.round)
        validation_accuracy = ResultMetricsModule(
            predictions=validation_predictions,
            labels=validation_labels
        ).accuracy_score()

        return (round(validation_accuracy, 2), {})

    # Private methods.
    def _dump_model_to_file_with_pickle(self, filename):
        pickle.dump(self.model, open(filename, 'wb'))
