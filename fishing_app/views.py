
# Create your views here.
from django.shortcuts import render
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login as auth_login
from django.http import HttpResponseRedirect


def custom_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            auth_login(request, user)
            return HttpResponseRedirect('/success/')  # Redirige después de un login exitoso
    else:
        form = AuthenticationForm()
    return render(request, 'registration/login.html', {'form': form})
