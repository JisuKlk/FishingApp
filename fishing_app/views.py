# fishing_app/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login as auth_login
from django.contrib.auth.forms import AuthenticationForm
from django.http import HttpResponseRedirect
from .models import Capture
from .forms import CustomUserCreationForm, CaptureForm
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy

# Vista de registro de usuario
class RegisterView(CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'registration/register.html'

# Vista personalizada de login
def custom_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            auth_login(request, user)
            return HttpResponseRedirect('/home/')
    else:
        form = AuthenticationForm()
    return render(request, 'registration/login.html', {'form': form})

@login_required
def profile(request):
    user = request.user
    
    # Manejo de la creación de una nueva captura
    if request.method == 'POST' and 'create_capture' in request.POST:
        form = CaptureForm(request.POST)
        if form.is_valid():
            capture = form.save(commit=False)
            capture.user = user
            capture.save()
            return redirect('profile')  # Redirige a la misma página para ver la nueva captura
    
    # Manejo de la eliminación de una captura
    elif request.method == 'POST' and 'delete_capture' in request.POST:
        capture_id = request.POST.get('capture_id')
        capture = get_object_or_404(Capture, id=capture_id, user=user)
        capture.delete()
        return redirect('profile')  # Redirige a la misma página para ver que la captura ha sido eliminada
    
    # Obtén todas las capturas asociadas al usuario
    captures = Capture.objects.filter(user=user)
    
    # Crea una instancia vacía del formulario para crear nuevas capturas
    form = CaptureForm()
    
    # Pasa el usuario, las capturas y el formulario al template
    return render(request, 'profile.html', {'captures': captures, 'form': form})

class CaptureListView(ListView):
    model = Capture
    template_name = 'capture_list.html'

    def get_queryset(self):
        return Capture.objects.filter(user=self.request.user)

class CaptureCreateView(CreateView):
    model = Capture
    template_name = 'capture_form.html'
    fields = ['species', 'size', 'weight', 'bait', 'location', 'date']

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)

class CaptureUpdateView(UpdateView):
    model = Capture
    template_name = 'capture_form.html'
    fields = ['species', 'size', 'weight', 'bait', 'location', 'date']

class CaptureDeleteView(DeleteView):
    model = Capture
    template_name = 'capture_confirm_delete.html'
    success_url = reverse_lazy('capture_list')