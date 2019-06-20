from django.contrib.auth.models import User, Group
from django.views import View
from rest_framework import generics, viewsets, serializers, permissions, status
from .models import Text, Translation
from .serializers import (TextSerializer, TranslationSerializer,
                          UserSerializer)
from .permissions import IsOwnerText, IsOwnerTranslation
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
import json
import os


URL_DICT = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup'
TOKEN_DICT = os.environ['TOKEN_DICT']


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    permission_classes = (permissions.IsAdminUser, )


class TextViewSet(viewsets.ModelViewSet):
    serializer_class = TextSerializer
    
    def get_queryset(self):
        queryset = self.request.user.texts.all()
        return queryset
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """

        if self.action == 'list':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsOwnerText]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        original = serializer.save(user=self.request.user)
        translation_data = self.request.data.get('translationsSelected')
        translation = TranslationSerializer(data=translation_data, many=True)
        translation.is_valid(raise_exception=True)
        translation.save(original=original)
    
    def perform_update(self, serializer):
        translation_data = self.request.data.get('translationsSelected')
        if translation_data:
            translation = TranslationSerializer(data=translation_data, many=True)
            translation.is_valid(raise_exception=True)
            original = self.get_object()
            translation.save(original=original)
        else:
            serializer.save()


class TranslationViewSet(viewsets.ModelViewSet):
    queryset = Translation.objects.all()
    serializer_class = TranslationSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Translation.objects.filter(original__user = user)
        return queryset

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'list':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsOwnerTranslation]
        
        return [permission() for permission in permission_classes]


@api_view()
def ya_translation_view(request):
    text = request.query_params.get('text')
    force_update = request.query_params.get('force_update')

    text_existed = Text.objects.filter(text=text)
    if text_existed and not force_update:
        text_existed = TextSerializer(text_existed.get(), context={'request': request}).data
        text_existed = json.dumps(text_existed)
        textExists = True
        response = {"translations": "", 'textExists': textExists, 'text': text_existed}
        return Response(response) 
    else:
        textExists = False
        params = {
            'key': TOKEN_DICT,
            'text': text,
            'lang': 'en-ru',
        }
        article = requests.get(URL_DICT, params).json().get('def')[0]['tr']
        translations = []

        for tr in article:
            translations.append({'translation': tr['text'], 'checked': False})
        translations = json.dumps(translations)

        response = {"translations": f"{translations}", 'textExists': textExists}
        return Response(response)