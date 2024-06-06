import requests
from bs4 import BeautifulSoup
import json
import re


def extract_page_text(page_url):
    try:
        response = requests.get(page_url)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching page data from {page_url}: {e}")
        return None

    page_soup = BeautifulSoup(response.content, 'html.parser')
    page_text = page_soup.get_text(separator='\n', strip=True)

    return page_text


url = 'https://victoryroadvgc.com/2024-season-calendar/'
response = requests.get(url)
soup = BeautifulSoup(response.content, 'html.parser')

main_event_links = set(a.get('href') for a in soup.find_all('a', href=True) if '2024' in a.get('href') and 'author' not in a.get('href') and 'twitter' not in a.get('href'))

for main_event_link in main_event_links:
    try:
        print(f"Processing main event link: {main_event_link}")
        
        main_event_response = requests.get(main_event_link)
        main_event_response.raise_for_status()
        
        main_event_soup = BeautifulSoup(main_event_response.content, 'html.parser')
        event_name = main_event_soup.find('title').get_text(strip=True) if main_event_soup.find('title') else "Unknown_Event"
        event_name_safe = re.sub(r'[\\/*?:"<>|]', "_", event_name)

        report_links = set(a.get('href') for a in main_event_soup.find_all('a', href=True) if 'report/' in a.get('href'))

        report_data = []

        for report_link in report_links:
            try:
                print(f"Processing report link: {report_link}")
                
                page_text = extract_page_text(report_link)
                if page_text:
                    report_data.append({
                        "report_link": report_link,
                        "page_text": page_text
                    })
                else:
                    print(f"Failed to extract text from report page: {report_link}")

            except requests.RequestException as e:
                print(f"Error processing report link {report_link}: {e}")
            except Exception as e:
                print(f"Unexpected error processing report link {report_link}: {e}")

        if report_data:
            json_data = {
                "event_name": event_name,
                "event_link": main_event_link,
                "reports": report_data
            }

            json_filename = f"{event_name_safe}_reports.json"
            with open(json_filename, 'w') as json_file:
                json.dump(json_data, json_file, indent=4)

            print(f"Data has been written to {json_filename}")

    except requests.RequestException as e:
        print(f"Error processing main event link {main_event_link}: {e}")
    except Exception as e:
        print(f"Unexpected error processing main event link {main_event_link}: {e}")

print("DONE!")


