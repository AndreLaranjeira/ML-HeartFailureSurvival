# Heart failure prediction - File operations module.

# Constants:
DEFAULT_FILENAME = 'default_save'
DEFAULT_FALLBACK_FILENAME = 'fallback_save'


# File operatorions module definition.
class FileOperations:
    def apply_extension_to_filename(self, original_filename, file_extension):
        if(not self.filename_ends_with_extension(
                    original_filename, file_extension
                )):
            return original_filename + file_extension
        else:
            return original_filename

    def filename_input_reader(self, file_extension):
        filename_input = input(
            'Insert a filename or press ENTER for the default file name: '
        )
        return self.apply_extension_to_filename(filename_input, file_extension)

    def save_file_with_fallback(
        self,
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
            print("Fallback filename '", fallback_filename, "' used instead!")

            save_method_or_function(fallback_filename)

    # Private methods.
    def _filename_ends_with_extension(
        self,
        filename_tested,
        expected_extension
    ):
        return (
            expected_extension == filename_tested[-len(expected_extension):]
        )
