import requests
from bs4 import BeautifulSoup
import json
import re



def extract_team_data(team_url):
    try:
        response = requests.get(team_url)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching team data from {team_url}: {e}")
        return None

    team_soup = BeautifulSoup(response.content, 'html.parser')
    pre_elements = team_soup.find_all('pre')

    trainer_name = team_soup.find('h2').get_text(strip=True) if team_soup.find('h2') else "Unknown"
    tournament_name = team_soup.find('h1').get_text(strip=True) if team_soup.find('h1') else "Unknown"

    team_data = {
        "trainer_name": trainer_name,
        "tournament_name": tournament_name,
        "pokemons": []
    }

    def extract_data(pre_content):
        pokemon_data = {}
        lines = pre_content.split('\n')
        move_pattern = re.compile(r'^- (.+)$')

        for line in lines:
            if '@' in line:
                name_item = line.split('@')
                name = name_item[0].strip()
                if '(' in name and ')' in name:
                    name = re.search(r'\((.*?)\)', name).group(1)
                pokemon_data['name'] = name
                pokemon_data['item'] = name_item[1].strip()

            elif 'Ability:' in line:
                pokemon_data['ability'] = line.split('Ability:')[1].strip()

            elif 'Tera Type:' in line:
                pokemon_data['tera_type'] = line.split('Tera Type:')[1].strip()

            elif 'EVs:' in line:
                evs_str = line.split('EVs:')[1].strip()
                evs_parts = evs_str.split('/')
                evs_dict = {}
                for part in evs_parts:
                    value, stat = part.strip().split(' ')
                    evs_dict[stat] = int(value)
                pokemon_data['evs'] = evs_dict

            elif 'Nature' in line:
                pokemon_data['nature'] = line.split('Nature')[0].strip()

            elif move_pattern.match(line):
                if 'moves' not in pokemon_data:
                    pokemon_data['moves'] = []
                move = move_pattern.match(line).group(1).strip()
                pokemon_data['moves'].append(move)

        if 'evs' not in pokemon_data:
            pokemon_data['evs'] = {}

        if 'nature' not in pokemon_data:
            pokemon_data['nature'] = ""

        return pokemon_data

    for pre in pre_elements:
        pre_content = pre.text.strip()
        pokemon_data = extract_data(pre_content)
        team_data["pokemons"].append(pokemon_data)

    return team_data


url = 'https://victoryroadvgc.com/2024-season-calendar/'
response = requests.get(url)
soup = BeautifulSoup(response.content, 'html.parser')


event_links = set(a.get('href') for a in soup.find_all('a', href=True) if '2024' in a.get('href') and 'twitter' not in a.get('href') and 'author' not in a.get('href'))

for event_link in event_links:
    try:
        print(f"Processing event link: {event_link}")
        
        event_response = requests.get(event_link)
        event_response.raise_for_status()
        
        event_soup = BeautifulSoup(event_response.content, 'html.parser')
        rows = event_soup.find_all('tr')

        team_links = []
        placements = []
        winrates = []
        event_name = event_soup.find('title').get_text(strip=True) if event_soup.find('title') else "Unknown_Event"
        
        
        event_name_safe = re.sub(r'[\\/*?:"<>|]', "_", event_name)

        for row in rows:
            links = row.find_all('a')
            for link in links:
                href = link.get('href')
                if 'pokepast.es' in href and href not in team_links:
                    team_links.append(href)
                    placements.append(row.find_all('td')[0].get_text(strip=True))
                    winrates.append(row.find_all('td')[1].get_text(strip=True))

        event_data = []
        if team_links:
            for index, team_link in enumerate(team_links):
                print(f"Processing team link {index + 1}: {team_link}")
                team_data = extract_team_data(team_link)
                if team_data:
                    team_data["placement"] = placements[index]
                    team_data["winrate"] = winrates[index]
                    event_data.append(team_data)
        else:
            print(f"No team links found on event page: {event_link}")

        json_filename = f"{event_name_safe}.json"
        with open(json_filename, 'w') as json_file:
            json.dump(event_data, json_file, indent=4)

        print(f"Data has been written to {json_filename}")

    except requests.RequestException as e:
        print(f"Error processing event link {event_link}: {e}")
    except Exception as e:
        print(f"Unexpected error processing event link {event_link}: {e}")

print("DONE !")
