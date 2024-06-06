# Rule sets for the 2023 and 2024 season

import requests
from bs4 import BeautifulSoup
import csv

def fetch_banned_pokemon(url, regulation_set):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    banned_pokemon = []
    tab_content_id = f"elementor-tab-content-{regulation_set}"
    tab_content = soup.find('div', id=tab_content_id)

    if tab_content:
        pokemon_images = tab_content.find_all('img')
        for img in pokemon_images:
            title = img.get('title', '')
            banned_pokemon.append(title)
    
    return banned_pokemon

def save_to_csv(pokemon_list, filename):
    with open(filename, 'w', newline='') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(['Regulation Set', 'Banned Pokémon'])
        for pokemon in pokemon_list:
            csvwriter.writerow(pokemon)

def main():
    url = 'https://victoryroadvgc.com/2023-season/'
    regulation_sets = {
        "Regulation Set A": "4742",
        "Regulation Set B": "1912",
        "Regulation Set C": "2052",
        "Regulation Set D": "7632"
    }
    
    all_banned_pokemon = []
    
    for set_name, tab_id in regulation_sets.items():
        banned_pokemon = fetch_banned_pokemon(url, tab_id)
        for pokemon in banned_pokemon:
            all_banned_pokemon.append([set_name, pokemon])
    
    save_to_csv(all_banned_pokemon, 'banned_pokemon.csv')
    print("Banned Pokémon data has been saved to banned_pokemon.csv")

if __name__ == "__main__":
    main()
