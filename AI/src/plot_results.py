# Heart failure prediction - Program to plot results obtained.

# User module imports.
from argument_parser import ArgumentParserModule
from result_plotter import GraphType, PlotterAction, ResultsDataCategory
from result_plotter import EvaluationResultsPlotter

# Program metadata.
PROGRAM_NAME = 'src/plot_results.py'
PROGRAM_DESCRIPTION = 'Program to plot the results from a model evaluation'
VERSION_NUM = '1.0.0'

# Argument parser.
argparser = ArgumentParserModule(
    program_name=PROGRAM_NAME,
    description=PROGRAM_DESCRIPTION,
    version_num=VERSION_NUM
)
argparser.add_version_argument()
argparser.add_default_plot_results_args()
args = argparser.parse_args()

# Create result plotter.
evaluation_results_plotter = EvaluationResultsPlotter(
    evaluation_number=args.evaluation_number,
    model_number=args.model_number
)

# Request the desired action.
evaluation_results_plotter.request_action(
    plotter_action=PlotterAction[args.action.upper()],
    graph_type=GraphType[args.graph_type.upper()],
    results_data_category=ResultsDataCategory[
        args.results_data_category.upper()
    ],
    filename=args.filename
)
