# Heart failure prediction - Plot types module.

# Package imports.
import matplotlib.pyplot as plt

# Classes and methods imports.
from abc import ABC, abstractmethod


# Base plot type class.
class BasePlotType(ABC):

    # Attributes.
    aditional_params = {}
    data_params = {}

    # Methods.
    # Returns the aditional parameters used in the plot in dictionary format.
    def get_aditional_params(self):
        return self.aditional_params

    # Returns all the parameters used in the plot in dictionary format.
    def get_all_params(self):
        return dict(self.data_params, **self.aditional_params)

    # Returns the data parameters used in the plot in dictionary format.
    def get_data_params(self):
        return self.data_params

    def has_label(self):
        return ('label' in self.aditional_params)

    # Abstract methods.
    # Plots the plot with the given data and additional params.
    @abstractmethod
    def plot(self):
        pass


# Barplot class.
class Barplot(BasePlotType):
    def __init__(self, x, height, **aditional_params):
        self.aditional_params = aditional_params
        self.data_params = {
            'x': x,
            'height': height
        }

    def plot(self):
        plt.bar(**self.data_params, **self.aditional_params)


# Boxplot class.
class Boxplot(BasePlotType):
    def __init__(self, x, **aditional_params):
        self.aditional_params = aditional_params
        self.data_params = {
            'x': x
        }

    def plot(self):
        plt.boxplot(**self.data_params, **self.aditional_params)


# Histogram class.
class Histogram(BasePlotType):
    def __init__(self, x, **aditional_params):
        self.aditional_params = aditional_params
        self.data_params = {
            'x': x
        }

    def plot(self):
        plt.hist(**self.data_params, **self.aditional_params)
