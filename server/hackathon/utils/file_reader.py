import csv
import json


def read_json_file(file_path: str):
    """Reads the contents of a JSON file

    Args:
        filename (str): The path to the JSON file

    Returns:
        dict: The contents of the JSON file
    """

    if file_path is None or len(str.strip(file_path)) <= 0:
        print("filename is none or empty")
        raise ValueError("Wrong or incorrect file name!!")

    try:
        with open(file_path, "r") as file:
            data = json.load(file)
            return data
    except Exception as err:
        print("failed to read file %s , err - %s ", file_path, err.__str__())
    finally:
        file.close()

# read csv file into an array of dictionaries, the first row of the csv file is considered as the header row and the keys of the dictionary
def read_csv_file(file_path: str) -> list:
    """Reads the contents of a CSV file

    Args:
        file_path (str): The path to the CSV file

    Returns:
        list: The contents of the CSV file
    """

    if file_path is None or len(str.strip(file_path)) <= 0:
        print("filename is none or empty")
        raise ValueError("Wrong or incorrect file name!!")

    try:
        with open(file_path, "r") as file:
            csv_reader = csv.DictReader(file)
            data = []
            for row in csv_reader:
                data.append(row)
            return data
    except Exception as err:
        print("failed to read file %s , err - %s ", file_path, err.__str__())
    finally:
        file.close()