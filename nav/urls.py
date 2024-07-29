from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login_view, name='login'),
    path('logout', views.logout_view, name='logout'),
    path('register', views.register_view, name='register'),
    path('update_user_location', views.update_user_location, name='update_user_location'),
    path('api/get_position/', views.get_current_position, name='get_position'),
    path('api/update_position/', views.update_current_position, name='update_position'),
]