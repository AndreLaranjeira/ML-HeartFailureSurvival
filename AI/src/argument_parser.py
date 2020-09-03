# Argument parser module.

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
            '-v',
            '--version',
            action='version',
            version=f'%(prog)s {self.version_num}'
        )

    def parse_args(self):
        return self.parser.parse_args()
