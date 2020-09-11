# Heart failure prediction - Argument parser module.

# Package imports.
import argparse


# Argument parser module definition.
class ArgumentParserModule:
    def __init__(self, program_name, version_num):
        self.parser = argparse.ArgumentParser(
            prog=f'{program_name}',
            description='Musical genre classifier.'
        )
        self.program_name = program_name
        self.version_num = version_num

    def add_default_args(self):
        self.parser.add_argument(
            '-b',
            '--batch-size',
            default=10,
            type=int,
            dest='batch_size',
            help="batch size used for training the neural network.")
        self.parser.add_argument(
            '-d',
            '--validation-size',
            type=open_unit_interval,
            default=0.2,
            dest='validation_size',
            help='open unit interval of percentage of data used in validation.'
        )
        self.parser.add_argument(
            '-e',
            '--epochs',
            default=100,
            type=int,
            dest='epochs',
            help="number of training epochs used by the neural network.")
        self.parser.add_argument(
            '-t',
            '--train-size',
            type=open_unit_interval,
            default=0.6,
            dest='train_size',
            help='open unit interval of percentage of data used in training.'
        )
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
