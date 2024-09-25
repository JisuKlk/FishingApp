#region --- Imports 🦆👍
from django.core.management.base import BaseCommand
from fishing_app.models import Species
import requests
#endregion

# We get the data from an completely usefull and not-so-short api (like 30 species lmao), still in proccess to improve this to get lotta species 🎣🐟
def fetch_all_species_from_fishbase():

    # This' the api url yay (we're addin' an endpoint, maybe it's not workin' cuz this)
    base_url = "https://fishbase.ropensci.org/species"

    # Quick counter for the species in total + pagination
    page = 1
    total_species = 0

    # Headers
    headers = {
        "Accept": "application/vnd.ropensci.v6+json",
        "User-Agent": "FishingApp/1.0"
    }


    while True:
        # We gotta send a GET request to the api, this api only accept GET request (as expected tho), now, we add pagination since we want more fish 🦆👍
        response = requests.get(base_url, params={'limit': 10, 'page': page}, headers=headers)

        # Accordin' to the api readme, 200 means everythings ok, so if it works, we put the data into a json
        if response.status_code == 200:
            try:
                species_data = response.json().get('data', [])
            except (ValueError, KeyError) as e:
                print(f"Error parsing JSON response: {e}")
                break

            # If no species data is returned, break the loop
            if not species_data:
                print("No more species found!")
                break

            # We iterate through the species data
            for specie in species_data:
                id_fishbase = specie.get('SpecCode')
                scientific_name = specie.get('Genus') + " " + specie.get('Species', 'Unknown')
                authority = specie.get('Author', '')
                habitat = specie.get('Habitat', '')
                common_name = specie.get('FBname', 'Unknown')

                # Fuck duplicates, all my homies hate duplicates 🦆
                if not Species.objects.filter(id_fishbase=id_fishbase).exists():
                    Species.objects.create(
                        id_fishbase=id_fishbase,
                        scientific_name=scientific_name,
                        authority=authority,
                        habitat=habitat,
                        common_name=common_name
                    )
                    # Ofc use the counter, rn it's kinda useless, but it tell us how many we r addin'
                    total_species += 1

            # We print the fish added by page
            print(f"{total_species} species added rn")

            # Once we're done with a page, go to the next one!
            page += 1
        else:
            # If the code it's not 200, we print the error
            print(f"ERROR: {response.status_code}")
            print("Response:", response.text)

            break

    # Fish added in total
    print(f"{total_species} species added in total")

class Command(BaseCommand):
    help = 'Import from FishBase API' # No more WoRMS hehe

    def handle(self, *args, **kwargs):
        fetch_all_species_from_fishbase()
        self.stdout.write(self.style.SUCCESS("Everythin' imported correctly!"))
