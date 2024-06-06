import json
from bs4 import BeautifulSoup


txt = 'items.txt'

with open(txt, 'r', encoding='utf-8') as file:
    html_content = file.read()

soup = BeautifulSoup(html_content, 'html.parser')

item_names = []

for name_col in soup.find_all('span', class_='col namecol'):
    item_name = name_col.text.strip()
    item_names.append(item_name)

json_file_path = 'items.json'
with open(json_file_path, 'w', encoding='utf-8') as json_file:
    json.dump(item_names, json_file, ensure_ascii=False, indent=4)


