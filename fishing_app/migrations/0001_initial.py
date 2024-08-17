# Generated by Django 5.1 on 2024-08-17 22:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Species',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('scientific_name', models.CharField(blank=True, max_length=150, null=True)),
                ('description', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Capture',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('size', models.FloatField()),
                ('weight', models.FloatField()),
                ('bait', models.CharField(max_length=100)),
                ('location', models.CharField(max_length=255)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('species', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='fishing_app.species')),
            ],
        ),
    ]
