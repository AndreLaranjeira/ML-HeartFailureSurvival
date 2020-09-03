# Program to train an AI to predict heart failure.

# Package imports:
import keras
import numpy as np
import pandas as pd
import tensorflow as tf

# User module imports:
from argument_parser import ArgumentParserModule

# Program metadata:
PROGRAM_NAME = 'heart_failure_prediction'
VERSION_NUM = '0.0.1'

# Argument parser:
argparser = ArgumentParserModule(PROGRAM_NAME, VERSION_NUM)
argparser.add_default_args()
args = argparser.parse_args()

