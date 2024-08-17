from django.db import models

class Capture(models.Model):
    species = models.CharField(max_length=100)
    size = models.FloatField()
    weight = models.FloatField()
    bait = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)