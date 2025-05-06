import os
import tempfile


def create_temp_file(prefix="tempfile_", suffix=".txt", content=None):
    """
    Creates a temporary file in the system's temporary directory with optional content.

    Parameters:
    - prefix: The prefix for the temp file's name.
    - suffix: The suffix (extension) for the temp file's name.
    - content: Optional string content to write to the file.

    Returns:
    - The full path to the created temporary file.
    """
    temp_dir = tempfile.gettempdir()
    unique_name = prefix + next(tempfile._get_candidate_names()) + suffix
    file_path = os.path.join(temp_dir, unique_name)
    if content is not None:
        with open(file_path, "wb") as temp_file:
            temp_file.write(content)
    print(f"Temporary file created: {file_path}")

    return file_path

def get_temp_file_path(prefix="outfile_",suffix=".wav"):
    """
    Returns the full path to a temporary file with the given name.

    Parameters:
    - file_name: The name of the file.

    Returns:
    - The full path to the temporary file.
    """
    temp_dir = tempfile.gettempdir()
    unique_name = prefix + next(tempfile._get_candidate_names()) + suffix
    file_path = os.path.join(temp_dir, unique_name)
    return file_path