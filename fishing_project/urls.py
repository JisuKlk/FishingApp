# fishing_project/urls.py
from django.contrib import admin
from django.urls import path
from django.contrib.auth import views as auth_views
from django.views.generic import RedirectView
from fishing_app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'), 
    path('logout/', auth_views.LogoutView.as_view(next_page='/login/'), name='logout'),
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('', RedirectView.as_view(url='/login/', permanent=True)),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('home/', views.profile, name='profile'),
    path('capture_list/', views.CaptureListView.as_view(), name='capture_list'),
    path('capture/new/', views.CaptureCreateView.as_view(), name='capture_create'),
    path('capture/<int:pk>/edit/', views.CaptureUpdateView.as_view(), name='capture_update'),
    path('capture/<int:pk>/delete/', views.CaptureDeleteView.as_view(), name='capture_delete'),
]
