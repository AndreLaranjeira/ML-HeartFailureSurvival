# Heart failure prediction - Plot operations module.

# Package imports.
import matplotlib.pyplot as plt

# User module imports.
from file_operations import FileOperations


# Plot operations module definition.
class PlotOperations:
    queued_plots = []

    def clear_queued_plots():
        PlotOperations.queued_plots.clear()

    def queue_plot(plot):
        PlotOperations.queued_plots.append(plot)

    def save_plots(file_name):
        file_name_with_extension = FileOperations.apply_extension_to_filename(
            file_name,
            '.png'
        )
        figure = plt.figure()
        PlotOperations._plot_queued_plots()
        plt.savefig(file_name_with_extension, bbox_inches='tight')
        plt.close(figure)
        PlotOperations.clear_queued_plots()

    def set_xlabel(label, **aditional_params):
        plt.xlabel(label, **aditional_params)

    def set_xticks(ticks, **aditional_params):
        plt.xticks(ticks, **aditional_params)

    def set_ylabel(label, **aditional_params):
        plt.ylabel(label, **aditional_params)

    def set_yticks(ticks, **aditional_params):
        plt.yticks(ticks, **aditional_params)

    def show_plots():
        PlotOperations._plot_queued_plots()
        plt.show()
        PlotOperations.clear_queued_plots()

    # Private methods.
    def _add_legend_if_necessary():
        if(PlotOperations._at_least_one_queued_plot_has_label()):
            plt.legend(loc='best')

    def _at_least_one_queued_plot_has_label():
        return any([plot.has_label() for plot in PlotOperations.queued_plots])

    def _plot_queued_plots():
        PlotOperations._run_plot_validations()

        for queued_plot in PlotOperations.queued_plots:
            queued_plot.plot()

        PlotOperations._add_legend_if_necessary()

    def _queued_plots_has_multiple_plot_types():
        if(len(PlotOperations.queued_plots) in [0, 1]):
            return False
        else:
            first_plot_type_queued = type(PlotOperations.queued_plots[0])
            return any([
                type(plot) != first_plot_type_queued
                for plot in PlotOperations.queued_plots[1:]
            ])

    def _run_plot_validations():
        if(len(PlotOperations.queued_plots) == 0):
            raise RuntimeError('No plots were queued!')
        if(PlotOperations._queued_plots_has_multiple_plot_types()):
            raise RuntimeError(
                'Cannot plot different plot types in the same queue!'
            )
