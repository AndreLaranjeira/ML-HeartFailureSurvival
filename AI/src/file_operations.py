# Heart failure prediction - File operations module.


# Default filenames.
class DefaultFilenames:

    # Constants.
    RESULTS_DIRECTORY = 'results/'
    SAVE_FALLBACK = 'fallback_save'
    SAVE_FILENAME = 'default_save'

    # Methods.
    def evaluation_results_filename(evaluation_number):
        return DefaultFilenames.RESULTS_DIRECTORY + \
            'E' + str(evaluation_number).zfill(4)


# File operatorions module definition.
class FileOperations:
    def apply_extension_to_filename(original_filename, file_extension):
        if(not FileOperations._filename_ends_with_extension(
                    original_filename, file_extension
                )):
            return original_filename + file_extension
        else:
            return original_filename

    def filename_input_reader(file_extension):
        filename_input = input(
            'Insert a filename: '
        )
        return FileOperations.apply_extension_to_filename(
            filename_input,
            file_extension
        )

    def save_file_with_fallback(
        save_method_or_function,
        filename,
        fallback_filename
    ):
        try:
            save_method_or_function(filename)
        except OSError as e:
            print("")
            print("An error ocurred during the save operation! Error:")
            print(e)
            print("")
            print(f'Fallback filename "{fallback_filename}" used instead!')

            save_method_or_function(fallback_filename)

    # Private methods.
    def _filename_ends_with_extension(
        filename_tested,
        expected_extension
    ):
        return (
            expected_extension == filename_tested[-len(expected_extension):]
        )
