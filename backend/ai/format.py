import json

json_file_path = 'items.json'

with open(json_file_path, 'r', encoding='utf-8') as json_file:
    item_names = json.load(json_file)

def format_item_name(name):
    return name.lower().replace(' ', '-')

formatted_item_names = [format_item_name(name) for name in item_names]

with open(json_file_path, 'w', encoding='utf-8') as json_file:
    json.dump(formatted_item_names, json_file, ensure_ascii=False, indent=4)

print(f"Formatierten {len(formatted_item_names)} Item-Namen und in {json_file_path} gespeichert.")
