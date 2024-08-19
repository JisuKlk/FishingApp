from django.core.management.base import BaseCommand
from fishing_app.models import Species
import requests

def fetch_all_species_from_worms():
    base_url = "https://www.marinespecies.org/rest/AphiaRecordsByVernacular/Marine?like=true"
    response = requests.get(base_url)
    total_species = 0

    if response.status_code == 200:
        species_data = response.json()

        for specie in species_data:
            id_worms = specie.get('AphiaID')
            name = specie.get('vernacular', 'Unknown')
            scientific_name = specie.get('scientificname', 'Unknown')
            authority = specie.get('authority', '')
            habitat = specie.get('habitat', '')

            # Evita duplicados
            if not Species.objects.filter(id_worms=id_worms).exists():
                Species.objects.create(
                    id_worms=id_worms,
                    name=name,
                    scientific_name=scientific_name,
                    authority=authority,
                    habitat=habitat
                )
                total_species += 1

        print(f"{total_species} especies añadidas a la base de datos")
    else:
        print(f"Error al obtener los datos: {response.status_code}")

class Command(BaseCommand):
    help = 'Importa todas las especies desde la API de Marine Species Database (WoRMS)'

    def handle(self, *args, **kwargs):
        fetch_all_species_from_worms()
        self.stdout.write(self.style.SUCCESS('Especies importadas con éxito'))
