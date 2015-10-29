from django import forms

class SignupForm(forms.Form):
    first_name = forms.CharField(max_length=30, label='Voornaam')
    last_name = forms.CharField(max_length=30, label='Achternaam')
    birthdate = forms.CharField(max_length=30)
    phone = forms.CharField(max_length=10)
    living_address = forms.CharField(max_length=300)
    billing_address = forms.CharField(max_length=300)
    logo_url = forms.CharField(max_length=255)

    is_active = forms.CharField()

    def signup(self, request, user):
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.birthdate = self.cleaned_data['birthdate']
        user.phone = self.cleaned_data['phone']
        user.living_address = self.cleaned_data['living_address']
        user.billing_address = self.cleaned_data['billing_address']
        user.logo_url = self.cleaned_data['logo_url']   
        user.is_active = self.cleaned_data['is_active']
        user.save()