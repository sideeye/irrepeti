from django.db import models
from django.contrib.auth.models import User


class Text(models.Model):
    user = models.ForeignKey(User, related_name='texts', on_delete=models.CASCADE, null=True)
    text = models.CharField(max_length = 200)
    date = models.DateField(auto_now=True)

    class Meta:
        unique_together = ('user', 'text',)
    
    def __str__(self):
        return self.text


class Translation(models.Model):
    original = models.ForeignKey('Text', related_name='translations', on_delete=models.CASCADE)
    translation = models.TextField(blank=True)

    class Meta:
        unique_together = ('original', 'translation',)

    def __str__(self):
        return self.translation
