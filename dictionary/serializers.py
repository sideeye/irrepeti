from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Text, Translation


class UserSerializer(serializers.HyperlinkedModelSerializer):
    texts = serializers.HyperlinkedRelatedField(many=True, view_name='text-detail', read_only=True)
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'texts')


class TranslationSerializer(serializers.HyperlinkedModelSerializer):
    original = serializers.ReadOnlyField(source='text.text')
    class Meta:
        model = Translation
        fields = ('pk', 'url', 'original', 'translation')


class TextSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    translations = TranslationSerializer(many=True, read_only=True)
    class Meta:
        model = Text
        fields = ('pk', 'url', 'user', 'text', 'translations', 'repeat_level')
