from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.status import (
    HTTP_401_UNAUTHORIZED,
    HTTP_400_BAD_REQUEST,
    HTTP_201_CREATED,
    HTTP_200_OK
)
from datetime import timedelta
from .models import (
    Role,
    User
)
from .serializers import (
    RoleSerializer,
    UserSerializer,
    RegisterSerializer,
    LoginSerializer
)

# Create your views here.


class RoleView(ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    authentication_classes = [IsAdminUser]

class UserView(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [IsAdminUser]


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"message": "Nama pengguna dan kata sandi wajib diisi"},
                status=HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            
            # Serialize user data
            user_data = UserSerializer(user).data

            response = Response({
                "message": "Login berhasil",
                "user": user_data,
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh)
            }, status=HTTP_200_OK)

            # Set refresh token in httponly cookie
            response.set_cookie(
                "refresh_token",
                str(refresh),
                httponly=True,
                max_age=timedelta(days=7).total_seconds(),
                samesite='Lax'
            )

            return response
        
        return Response(
            {"message": "Nama pengguna atau kata sandi salah"},
            status=HTTP_401_UNAUTHORIZED
        )


@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Create tokens for the new user
            refresh = RefreshToken.for_user(user)
            user_data = UserSerializer(user).data
            
            return Response({
                "message": "Pendaftaran berhasil",
                "user": user_data,
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh)
            }, status=HTTP_201_CREATED)
        
        return Response(
            {"message": "Pendaftaran gagal", "errors": serializer.errors},
            status=HTTP_400_BAD_REQUEST
        )

