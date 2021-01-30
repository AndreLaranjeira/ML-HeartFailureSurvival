# Heart failure prediction - Result plotter module.

# Package imports.
import numpy as np

# User module imports.
from data_extractors import ResultsExtractor
from enum import Enum, auto
from plot_operations import PlotOperations
from plot_types import Barplot, Boxplot, Histogram


# Results data type enumeration class.
class ResultsDataType(Enum):
    TEST_RESULTS = auto()
    VALIDATION_RESULTS = auto()
    COMPARISON = auto()


# Evaluation results plotter class.
class EvaluationResultsPlotter:
    def __init__(self, evaluation_number, model_number):
        self.evaluation_number = evaluation_number
        self.model_number = model_number
        self.results_extractor = ResultsExtractor(
            evaluation_number,
            model_number
        )
        self.title_precursor = f'Avaliação ' + \
            f'{str(self.evaluation_number).zfill(2)} ' + \
            f'- Modelo {str(self.model_number).zfill(3)}'

        self.results_extractor.extract_results()

    def plot_results_barplot(
        self,
        results_data_type
    ):
        self._add_default_barplot_graph_settings()
        results_data = self._determine_results_data(results_data_type)
        labels = self._determine_plot_labels(results_data_type)

        self._queue_barplots(results_data, labels)
        PlotOperations.show_plots()

    def plot_results_boxplot(
        self,
        results_data_type
    ):
        self._add_default_boxplot_graph_settings()
        results_data = self._determine_results_data(results_data_type)
        labels = self._determine_plot_labels(results_data_type)

        self._queue_boxplots(results_data, labels)
        PlotOperations.show_plots()

    def plot_results_histogram(
        self,
        results_data_type
    ):
        self._add_default_histogram_graph_settings()
        results_data = self._determine_results_data(results_data_type)
        labels = self._determine_plot_labels(results_data_type)

        self._queue_histogram_plots(results_data, labels)
        PlotOperations.show_plots()

    def save_results_barplot(
        self,
        results_data_type,
        filename
    ):
        PlotOperations.initialize_figure()
        self._add_default_barplot_graph_settings()
        results_data = self._determine_results_data(results_data_type)
        labels = self._determine_plot_labels(results_data_type)

        self._queue_barplots(results_data, labels)
        PlotOperations.save_plots(filename)

    def save_results_boxplot(
        self,
        results_data_type,
        filename
    ):
        PlotOperations.initialize_figure()
        self._add_default_boxplot_graph_settings()
        results_data = self._determine_results_data(results_data_type)
        labels = self._determine_plot_labels(results_data_type)

        self._queue_boxplots(results_data, labels)
        PlotOperations.save_plots(filename)

    def save_results_histogram(
        self,
        results_data_type,
        filename
    ):
        PlotOperations.initialize_figure()
        self._add_default_histogram_graph_settings()
        results_data = self._determine_results_data(results_data_type)
        labels = self._determine_plot_labels(results_data_type)

        self._queue_histogram_plots(results_data, labels)
        PlotOperations.save_plots(filename)

    # Private methods.
    def _add_default_barplot_graph_settings(self):
        PlotOperations.set_title(
            self.title_precursor + ' - Acurácia por particionamento'
        )
        PlotOperations.set_xlabel('Número do particionamento')
        PlotOperations.set_ylabel('Acurácia')
        PlotOperations.set_xticks(np.arange(0, 101, step=5))

    def _add_default_boxplot_graph_settings(self):
        PlotOperations.set_title(
            self.title_precursor + ' - Gráfico de caixa de acurácia'
        )
        PlotOperations.set_xlabel('Dados')
        PlotOperations.set_ylabel('Acurácia')

    def _add_default_histogram_graph_settings(self):
        PlotOperations.set_title(
            self.title_precursor + ' - Histograma de acurácia'
        )
        PlotOperations.set_xlabel('Acurácia')
        PlotOperations.set_ylabel('Número de particionamentos')
        PlotOperations.set_xticks(self._default_histogram_bins())

    def _default_histogram_bins(self):
        return np.arange(0.5, 1.01, step=0.05)

    def _determine_plot_labels(self, results_data_type):
        if(results_data_type == ResultsDataType.TEST_RESULTS):
            return ['Resultados de teste']
        elif(results_data_type == ResultsDataType.VALIDATION_RESULTS):
            return ['Resultados de validação']
        elif(results_data_type == ResultsDataType.COMPARISON):
            return [
                'Resultados de teste',
                'Resultados de validação'
            ]

    def _determine_results_data(self, results_data_type):
        if(results_data_type == ResultsDataType.TEST_RESULTS):
            return [self.results_extractor.get_test_scores()]
        elif(results_data_type == ResultsDataType.VALIDATION_RESULTS):
            return [self.results_extractor.get_validation_scores()]
        elif(results_data_type == ResultsDataType.COMPARISON):
            return np.array([
                self.results_extractor.get_test_scores(),
                self.results_extractor.get_validation_scores()
            ], dtype='object')

    def _queue_barplots(self, results_data, labels):
        if(len(results_data) > 1):
            bar_width = 1.0/len(results_data)
        else:
            bar_width = 0.8

        for (index, result_data) in enumerate(results_data):
            offset = bar_width * index
            PlotOperations.queue_plot(
                Barplot(
                    x=np.arange(offset, len(result_data), step=1),
                    height=result_data,
                    width=bar_width,
                    label=labels[index]
                )
            )

    def _queue_boxplots(self, results_data, labels):
        PlotOperations.queue_plot(
            Boxplot(
                x=results_data,
                positions=range(len(results_data)),
                labels=labels
            )
        )

    def _queue_histogram_plots(self, results_data, labels):
        PlotOperations.queue_plot(
            Histogram(
                x=results_data,
                bins=self._default_histogram_bins(),
                label=labels,
                rwidth=0.8
            )
        )
