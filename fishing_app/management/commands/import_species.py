#region --- Imports 🦆👍
from django.core.management.base import BaseCommand
from fishing_app.models import Species
import requests
#endregion

# We get the data from an completely usefull and not-so-short api (like 30 species lmao), still in proccess to improve this to get lotta species 🎣🐟
def fetch_all_species_from_worms():

    # This' the api url yay
    base_url = "https://www.marinespecies.org/rest/AphiaRecordsByVernacular/Marine?like=true"
    response = requests.get(base_url)

    # Quick counter for the species in total
    total_species = 0

    if response.status_code == 200:
        species_data = response.json()

        # Iterate the api to save all species data (There's no common name cuz the api doesn't have it lol)
        for specie in species_data:
            id_worms = specie.get('AphiaID')
            scientific_name = specie.get('scientificname', 'Unknown')
            authority = specie.get('authority', '')
            habitat = specie.get('habitat', '')

            # Fuck duplicates, all my homies hate duplicates 🦆
            if not Species.objects.filter(id_worms=id_worms).exists():
                Species.objects.create(
                    id_worms=id_worms,
                    scientific_name=scientific_name,
                    authority=authority,
                    habitat=habitat
                )
                # Ofc use the counter, rn it's kinda useless, but it tell us how many we r addin'
                total_species += 1

        print(f"{total_species} species added in total!")
    else:
        print(f"ERROR: {response.status_code}")

class Command(BaseCommand):
    help = 'Import from WoRMS API'

    def handle(self, *args, **kwargs):
        fetch_all_species_from_worms()
        self.stdout.write(self.style.SUCCESS("Everythin' imported correctly!"))
