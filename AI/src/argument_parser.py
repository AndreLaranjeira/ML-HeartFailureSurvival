# Heart failure prediction - Argument parser module.

# Package imports.
import argparse

# User module imports.
from file_operations import DefaultFilenames
from result_plotter import GraphType, PlotterAction, ResultsDataCategory


# Argument parser module definition.
class ArgumentParserModule:
    def __init__(self, program_name, description, version_num):
        self.parser = argparse.ArgumentParser(
            prog=program_name,
            description=description
        )
        self.program_name = program_name
        self.version_num = version_num

    def add_default_plot_results_args(self):
        self.parser.add_argument(
            '-a',
            '--action',
            type=str,
            choices=[
                name.lower() for name, _ in PlotterAction.__members__.items()
            ],
            dest='action',
            default=PlotterAction.SHOW.name.lower(),
            help='action to perform with plot.'
        )

        self.parser.add_argument(
            '-e',
            '--evaluation-number',
            type=int,
            choices=range(1, 31),
            dest='evaluation_number',
            help='evaluation number to analyse.',
            metavar='EVALUATION_NUMBER'
        )

        self.parser.add_argument(
            '-f',
            '--filename',
            type=str,
            dest='filename',
            default=DefaultFilenames.PLOT_FILENAME,
            help='filename to save plot results to.'
        )

        self.parser.add_argument(
            '-g',
            '--graph-type',
            type=str,
            choices=[
                name.lower() for name, _ in GraphType.__members__.items()
            ],
            dest='graph_type',
            help='type of graph to plot.'
        )

        self.parser.add_argument(
            '-m',
            '--model-number',
            type=int,
            dest='model_number',
            help='model number to analyse.'
        )

        self.parser.add_argument(
            '-r',
            '--results-data-category',
            type=str,
            choices=[
                name.lower() for name, _
                in ResultsDataCategory.__members__.items()
            ],
            dest='results_data_category',
            help='category of results data to plot.'
        )

    def add_default_run_evaluation_args(self):
        self.parser.add_argument(
            '-d',
            '--validation-size',
            type=unit_interval_open_on_one,
            default=0.2,
            dest='validation_size',
            help='percentage of data in [0, 1) to be used in validation.'
        )
        self.parser.add_argument(
            '-e',
            '--evaluation-time',
            action='store_true',
            dest='show_evaluation_time',
            help='shows the time elapsed evaluating training models.'
        )
        self.parser.add_argument(
            '-t',
            '--train-size',
            type=open_unit_interval,
            default=0.6,
            dest='train_size',
            help='percentage of data in (0, 1) to be used in training.'
        )

    def add_version_argument(self):
        self.parser.add_argument(
            '-v',
            '--version',
            action='version',
            version=f'%(prog)s {self.version_num}'
        )

    def parse_args(self):
        return self.parser.parse_args()


# Auxiliary functions.
def open_unit_interval(str_arg):
    unit_interval_type_error = argparse.ArgumentTypeError(
        'Argument must be a number in the interval (0, 1)!'
    )

    try:
        arg = float(str_arg)
    except ValueError:
        raise unit_interval_type_error

    if(arg <= 0 or arg >= 1):
        raise unit_interval_type_error

    return arg


def unit_interval_open_on_one(str_arg):
    unit_interval_open_on_one_type_error = argparse.ArgumentTypeError(
        'Argument must be a number in the interval [0, 1)!'
    )

    try:
        arg = float(str_arg)
    except ValueError:
        raise unit_interval_open_on_one_type_error

    if(arg < 0 or arg >= 1):
        raise unit_interval_open_on_one_type_error

    return arg
