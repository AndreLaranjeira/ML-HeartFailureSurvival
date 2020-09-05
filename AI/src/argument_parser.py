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
            '-t',
            '--train-size',
            type=open_unit_interval,
            default=0.7,
            dest='train_percent',
            help='unit interval of percentage of data used in training.'
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
