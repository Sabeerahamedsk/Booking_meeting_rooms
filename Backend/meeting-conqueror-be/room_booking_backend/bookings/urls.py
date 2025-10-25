# bookings/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomAuthToken, RoomViewSet, BookingViewSet

router = DefaultRouter()
router.register(r'rooms', RoomViewSet, basename='room')
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('api/', include(router.urls)),
    path('', include(router.urls)),
    # path('api/login/', CustomAuthToken.as_view(), name='api-login'),
]
