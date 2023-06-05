from base64 import urlsafe_b64decode
from django.core.mail import EmailMessage
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from django.contrib.auth.views import (
    PasswordResetView,
    PasswordResetDoneView,
    PasswordResetConfirmView,
    PasswordResetCompleteView,
)

from urllib import request
from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response

from django.contrib.auth.models import User
from base.serializers import ProductSerializer, UserSerializer, UserSerializerWithToken

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
# Create your views here.

from django.contrib.auth.hashers import make_password
from rest_framework import status


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for key, value in serializer.items():
            data[key] = value

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# @permission_classes([AllowAny])
@api_view(['POST'])
def reset_password(request):
    if request.method == 'POST':
        email = request.data['email']
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email__exact=email)
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            # domain = get_current_site(request).domain
            # link = reverse('password_reset_confirm', kwargs={ 'uidb64': uidb64, 'token': default_token_generator.make_token(user)})

            domain = 'localhost:5173'
            link = '/reset/'+uidb64+'/'+default_token_generator.make_token(user)+'/'

            reset_url = 'http://'+domain+link
            email_body = 'Hello, \n Use link below to reset your password \n' + reset_url
            data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Reset your password'}
            # semd an email
            email = EmailMessage(
                data['email_subject'], data['email_body'], to=[data['to_email']])
            email.send()
            return Response({'success': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Invalid Request'}, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['POST'])
def reset_password_confirm(request, uidb64, token):
    try:
        # Decodificar el ID del usuario
        uid = urlsafe_base64_decode(uidb64).decode()
        # Obtener el usuario correspondiente al ID decodificado
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        # Si ocurre algún error en la decodificación o el usuario no existe, retornar una respuesta de error
        return Response({'error': 'Invalid link'}, status=status.HTTP_400_BAD_REQUEST)

    # Verificar que el token proporcionado sea válido para el usuario
    if default_token_generator.check_token(user, token):
        # El token es válido, actualizar la contraseña del usuario
        password = request.data.get('password')
        user.set_password(password)
        user.save()
        return Response({'success': 'Password reset successfully'}, status=status.HTTP_200_OK)
    else:
        # El token no es válido, retornar una respuesta de error
        return Response({'error': 'Invalid link'}, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordCompleteView(PasswordResetCompleteView):
    def get(self, request, *args, **kwargs):
        # Custom logic or redirect to your frontend after the password is successfully reset
        return Response({'message': 'Password reset complete.'})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def registerUser(request):
    data = request.data

    try:


        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
        )

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)

    except:
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserById(request, pk):
    if request.user.is_staff:
        user = User.objects.get(id=pk)
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])
    
    user.save()

    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    user = User.objects.get(id=pk)
    user.delete()
    return Response('User deleted')

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request, pk):
    user = User.objects.get(id=pk)

    data = request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']

    user.save()

    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)
    