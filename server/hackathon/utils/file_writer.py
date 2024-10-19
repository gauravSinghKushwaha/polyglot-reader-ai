import json


def read_json_file(file_path: str):
    """Reads the contents of a JSON file

    Args:
        filename (str): The path to the JSON file

    Returns:
        dict: The contents of the JSON file
    """

    if file_path is None or len(str.strip(file_path)) <= 0:
        raise ValueError("Wrong or incorrect file name!!")

    try:
        with open(file_path, "r") as file:
            data = json.load(file)
            return data
    except Exception as err:
        print(err)
    finally:
        file.close()