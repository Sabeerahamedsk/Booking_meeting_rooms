from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import Room, Booking
from .serializers import RoomSerializer, BookingSerializer
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes


class RoomViewSet(viewsets.ModelViewSet):
    """CRUD and availability endpoints for Rooms."""
    queryset = Room.objects.filter(is_active=True)
    serializer_class = RoomSerializer
    # permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'amenities']
    ordering_fields = ['name', 'capacity', 'created_at']

    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        """
        Check availability for a specific room on a given date.
        Example: /api/rooms/1/availability/?date=2025-10-23
        """
        room = self.get_object()
        date_str = request.query_params.get('date')

        if date_str:
            from datetime import datetime
            date = datetime.fromisoformat(date_str).date()
        else:
            date = timezone.now().date()

        start_of_day = timezone.make_aware(
            timezone.datetime.combine(date, timezone.datetime.min.time())
        )
        end_of_day = start_of_day + timedelta(days=1)

        bookings = Booking.objects.filter(
            room=room,
            status__in=['pending', 'confirmed'],
            start_time__gte=start_of_day,
            start_time__lt=end_of_day
        ).values('start_time', 'end_time')

        return Response({
            'room': RoomSerializer(room).data,
            'date': date.isoformat(),
            'bookings': list(bookings)
        })


class BookingViewSet(viewsets.ModelViewSet):
    """CRUD and filtered list for Bookings."""
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated] 
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user_name', 'user_email', 'room__name']
    ordering_fields = ['start_time', 'created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        room_id = self.request.query_params.get('room_id')
        status = self.request.query_params.get('status')
        date = self.request.query_params.get('date')

        if room_id:
            queryset = queryset.filter(room_id=room_id)
        if status:
            queryset = queryset.filter(status=status)
        if date:
            from datetime import datetime
            date_obj = datetime.fromisoformat(date).date()
            start_of_day = timezone.make_aware(
                timezone.datetime.combine(date_obj, timezone.datetime.min.time())
            )
            end_of_day = start_of_day + timedelta(days=1)
            queryset = queryset.filter(start_time__gte=start_of_day, start_time__lt=end_of_day)

        return queryset.select_related('room')

class CustomAuthToken(ObtainAuthToken):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
        })

@api_view(['POST'])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})
    return Response({"error": "Invalid credentials"}, status=400)