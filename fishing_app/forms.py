# forms.py
from .models import Capture
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def __init__(self, *args, **kwargs):
        super(CustomUserCreationForm, self).__init__(*args, **kwargs)
        self.fields['password1'].help_text = None
        self.fields['password2'].help_text = None
        

class CaptureForm(forms.ModelForm):
    class Meta:
        model = Capture
        fields = ['species', 'size', 'weight', 'bait', 'location', 'date']
        widgets = {
            'date': forms.DateTimeInput(attrs={'type': 'datetime-local'}),  # Usa datetime-local para selección de fecha y hora
        }
   


