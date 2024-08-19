
from django import forms
from .models import Capture

class CaptureForm(forms.ModelForm):
    class Meta:
        model = Capture
        fields = ['species', 'size', 'weight', 'bait', 'location']
        # No incluimos 'date' porque es un campo no editable
