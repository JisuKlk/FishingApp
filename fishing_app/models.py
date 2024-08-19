# We import the django models
from django.db import models
from django.contrib.auth.models import User

# We create a class from django's models, django will treat this as a db table 📰
# One must define the character type of every value on the table

#region Value type guide 🦆👍
    # 'CharField' is used for short 'Strings' such as names or IDs, it has 2 main parameters:
    #     'max_length' which is obligatory, defines the string length.
    #     'blank' which is optional, it enables the string to be empty if declared as 'true'.

    # 'TextField' is used for long 'Strings', in this case, we'll use 'em for descriptions, it has one optional parameter; 'blank' which i did explain just before

    # 'SlugField' is used for a different type of 'Strings', it's meant to contain short URLs, it only allows letters, numbers, hyphens and underscore, it has max lenght and a new paramenter:
    #     'allow_unicode' which is optional, it enables unicode if it's set as true

    # 'EmailField' is used, obviously, for emails, it has max lenght.

    # 'URLField' Unlike slugfield, this one's meant to contain full large URLs

    # 'UUIDField' is used for universal unique IDs, it has one important parameter:
    #    'default', you can use 'uuid.uuid4' to generate a random value

    # 'FilePathField' is used to contain filepaths, which needs at least 1 important paramenter and another extra optional one
    #    'path' is obligatory, it's the path where the files will be stored.
    #    'match' is optional, it's a regular expression that will be used to filter the files that can be choosen
#endregion

# Class for different species of fish 🐟
class Species(models.Model):
    # This id is extracted from the WoRMS database
    id_worms = models.IntegerField(unique=True, default=1)
    scientific_name = models.CharField(max_length=150, blank=True, null=True)
    authority = models.CharField(max_length=100, blank=True)
    habitat = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name or self.scientific_name

# fishing_app/models.py


class Capture(models.Model):
    species = models.CharField(max_length=100)  # Si no es un ForeignKey
    # Si species es un ForeignKey a otro modelo, deberías definirlo así:
    # species = models.ForeignKey(Species, on_delete=models.CASCADE)
    size = models.FloatField()
    weight = models.FloatField()
    bait = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.species} - {self.size} cm - {self.weight} kg"




