# Heart failure prediction - Model evaluator module.

# Package imports.
import numpy as np

# User module imports.
from file_operations import FileOperations
from file_operations import DEFAULT_FILENAME, DEFAULT_FALLBACK_FILENAME
from result_metrics import ResultMetricsModule


# Model evaluator definition.
class ModelEvaluator:
    def __init__(
        self,
        dataset_extractor,
        seed_list,
        models,
        num_validation_runs,
        num_test_runs,
        percent_of_models_tested,
        evaluation_number=None,
        save_file_name=None
    ):
        self.dataset_extractor = dataset_extractor
        self.index_for_test_cutoff = int(np.ceil(
            percent_of_models_tested * len(models)
        ))
        self.models = list(map(
            lambda model: EvaluatingWrapper(model),
            models
        ))
        self.num_test_runs = num_test_runs
        self.num_validation_runs = num_validation_runs
        self.percent_of_models_tested = percent_of_models_tested
        self.seed_list = seed_list

        if(save_file_name is None and evaluation_number is not None):
            self.save_file_name = 'results/E' + str(evaluation_number).zfill(4)
        elif(save_file_name is None and evaluation_number is None):
            self.save_file_name = 'results/E_' + DEFAULT_FILENAME
        else:
            self.save_file_name = save_file_name

    def evaluate_models(self):
        self._validate_models()
        self._sort_models_by_mean_validation_score()
        self._test_models()

    def get_results(self):
        results = []
        for index, model in enumerate(self.models):
            results.append({
                'index': index,
                'all_test_scores': model.get_all_test_scores(),
                'all_validation_scores': model.get_all_validation_scores(),
                'description': model.get_params(),
                'mean_test_score': model.get_mean_test_score(),
                'mean_validation_score': model.get_mean_validation_score(),
                'model_type': model.get_type()
            })
        return results

    def print_results(self):
        print("")

        results = self.get_results()
        for result in results:
            print("Model: %03d" % result['index'])
            print("Model type:")
            print(result['model_type'])
            print("Model description:")
            print(result['description'])
            print("All validation scores:",
                  list(map(
                      lambda score: round(score, 3),
                      result['all_validation_scores']
                  )))
            print("Mean validation score: %.3f" %
                  result['mean_validation_score'])
            print("All test scores:",
                  list(map(
                      lambda score: round(score, 3),
                      result['all_test_scores']
                  )))

            if result['mean_test_score'] is not None:
                print("Mean test score: %.3f" %
                      result['mean_test_score'])
            else:
                print("No mean test score because model was NOT tested!")
            print("")

    def save_results_as_csv(self):
        FileOperations.save_file_with_fallback(
            save_method_or_function=self._write_results_to_csv_file,
            filename=FileOperations.apply_extension_to_filename(
                original_filename=self.save_file_name,
                file_extension='.csv'
            ),
            fallback_filename=FileOperations.apply_extension_to_filename(
                original_filename=DEFAULT_FALLBACK_FILENAME,
                file_extension='.csv'
            )
        )

    # Private methods.
    def _convert_results_to_csv_format(self, results):
        csv_format_results = ''
        for result in results:
            csv_format_results += str(result['index']) + ','
            csv_format_results += str(result['model_type']) + ','
            csv_format_results += '"' + str(result['description']) + '",'
            csv_format_results += '"' + \
                str(list(map(
                    lambda score: round(score, 3),
                    result['all_validation_scores']
                ))) + '",'
            csv_format_results += str(
                round(result['mean_validation_score'], 3)
            ) + ','
            csv_format_results += '"' + \
                str(list(map(
                    lambda score: round(score, 3),
                    result['all_test_scores']
                ))) + '",'
            csv_format_results += '-' if result['mean_test_score'] is None \
                else str(round(result['mean_test_score'], 3))
            csv_format_results += '\n'

        return csv_format_results

    def _run_test_on_best_models(
        self,
        train_features,
        train_labels,
        validation_features,
        validation_labels,
        test_features,
        test_labels
    ):
        for model in self.models[:self.index_for_test_cutoff]:
            model.run_test(
                train_features=train_features,
                train_labels=train_labels,
                validation_features=validation_features,
                validation_labels=validation_labels,
                test_features=test_features,
                test_labels=test_labels
            )

    def _run_validation_on_all_models(
        self,
        train_features,
        train_labels,
        validation_features,
        validation_labels
    ):
        for model in self.models:
            model.run_validation(
                train_features=train_features,
                train_labels=train_labels,
                validation_features=validation_features,
                validation_labels=validation_labels
            )

    def _sort_models_by_mean_validation_score(self):
        self.models.sort(
            reverse=True,
            key=lambda model: model.get_mean_validation_score()
        )

    def _test_models(self):
        print("\nRunning tests on models.")

        for run in range(self.num_test_runs):

            print("Test run number: %03d" % (run + 1))

            self.dataset_extractor.set_randomizing_seed(self.seed_list[run])
            self.dataset_extractor.generate_new_data_split()

            train_features, train_labels = \
                self.dataset_extractor.get_train_features_and_labels()
            validation_features, validation_labels = \
                self.dataset_extractor.get_validation_features_and_labels()
            test_features, test_labels = \
                self.dataset_extractor.get_test_features_and_labels()

            self._run_test_on_best_models(
                train_features=train_features,
                train_labels=train_labels,
                validation_features=validation_features,
                validation_labels=validation_labels,
                test_features=test_features,
                test_labels=test_labels
            )

    def _validate_models(self):
        print("\nRunning validation on models.")

        for run in range(self.num_validation_runs):

            print("Validation run number: %03d" % (run + 1))

            self.dataset_extractor.set_randomizing_seed(self.seed_list[run])
            self.dataset_extractor.generate_new_data_split()

            train_features, train_labels = \
                self.dataset_extractor.get_train_features_and_labels()
            validation_features, validation_labels = \
                self.dataset_extractor.get_validation_features_and_labels()

            self._run_validation_on_all_models(
                train_features=train_features,
                train_labels=train_labels,
                validation_features=validation_features,
                validation_labels=validation_labels
            )

    def _write_results_to_csv_file(self, filename):
        header_columns = 'model_number,model_type,model_params,' + \
            'all_validation_scores,mean_validation_score,' + \
            'all_test_scores,mean_test_score\n'
        data_columns = self._convert_results_to_csv_format(
            self.get_results()
        )

        with open(filename, 'w') as csv_output_file:
            csv_output_file.write(header_columns)
            csv_output_file.write(data_columns)


# Evaluating wrapper definition.
class EvaluatingWrapper:
    def __init__(
        self,
        model
    ):
        self.model = model
        self.test_scores = []
        self.test_runs = 0
        self.validation_scores = []
        self.validation_runs = 0

    def get_all_test_scores(self):
        return self.test_scores

    def get_all_validation_scores(self):
        return self.validation_scores

    def get_mean_test_score(self):
        if(self.test_runs == 0):
            return None

        return sum(self.test_scores)/self.test_runs

    def get_mean_validation_score(self):
        if(self.validation_runs == 0):
            return None

        return sum(self.validation_scores)/self.validation_runs

    def get_params(self):
        return self.model.get_params()

    def get_type(self):
        return self.model.get_type()

    def run_test(
            self,
            train_features,
            train_labels,
            validation_features,
            validation_labels,
            test_features,
            test_labels
    ):

        _, test_hyperparameters = self.model.validate(
            train_features=train_features,
            train_labels=train_labels,
            validation_features=validation_features,
            validation_labels=validation_labels
        )

        self.model.reset()
        self.model.fit(
            train_features=train_features,
            train_labels=train_labels,
            aditional_params=self._merge_with_default_fit_params(
                test_hyperparameters
            )
        )

        test_results = ResultMetricsModule(
            predictions=self.model.predict(test_features, np.round),
            labels=test_labels
        )
        self.test_scores.append(test_results.accuracy_score())
        self.test_runs += 1

    def run_validation(
        self,
        train_features,
        train_labels,
        validation_features,
        validation_labels
    ):

        validation_accuracy, _ = self.model.validate(
            train_features=train_features,
            train_labels=train_labels,
            validation_features=validation_features,
            validation_labels=validation_labels
        )
        self.validation_scores.append(validation_accuracy)
        self.validation_runs += 1

    # Private methods.
    def _merge_with_default_fit_params(self, params_merged):
        params_returned = self.model.default_fit_params.copy()

        for key in params_merged:
            params_returned[key] = params_merged[key]

        return params_returned
