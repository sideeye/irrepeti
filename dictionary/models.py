from django.db import models
from django.contrib.auth.models import User
import datetime
from datetime import timedelta


class Text(models.Model):
    user = models.ForeignKey(User, related_name='texts', on_delete=models.CASCADE, null=True)
    text = models.CharField(max_length = 200)
    repeat_last = models.DateField(auto_now=True)
    repeat_level = models.IntegerField(default=0)

    @property
    def repeat_next(self):
        fibos = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377]
        return self.repeat_last + timedelta(fibos[self.repeat_level])

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
