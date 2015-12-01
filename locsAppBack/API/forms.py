from django import forms
from django.contrib.postgres.fields import ArrayField

class SignupForm(forms.Form):
    email = ArrayField(forms.CharField(max_length=30, label='Voornaam'))

    def signup(self, request, user):
        user.email = (self.cleaned_data['email'])
        user.save()