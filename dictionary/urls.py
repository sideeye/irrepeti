from django.urls import include, path
from rest_framework import routers
from dictionary.views import TextViewSet, UserViewSet, TranslationViewSet, ya_translation_view


router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'texts', TextViewSet, base_name='text')
router.register(r'translations', TranslationViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('yatranslate', ya_translation_view),
]