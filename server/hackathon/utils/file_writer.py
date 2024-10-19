import json


def write_json_file(path, data):
    # Write the data to a new or override existing json file
    with open(path, 'w') as file:
        json.dump(data, file, indent=4, ensure_ascii=False)