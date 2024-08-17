from django import forms
from django.contrib.auth.forms import AuthenticationForm, PasswordResetForm

# Custom login form (optional)
class CustomAuthenticationForm(AuthenticationForm):
    username = forms.CharField(label='Username', max_length=254)
    password = forms.CharField(label='Password', widget=forms.PasswordInput)

# Custom password reset form (optional)
class CustomPasswordResetForm(PasswordResetForm):
    email = forms.EmailField(label='Email', max_length=254)
