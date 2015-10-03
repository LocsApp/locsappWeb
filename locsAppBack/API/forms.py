from django import forms

class SignupForm(forms.Form):
    first_name = forms.CharField(max_length=30, label='Voornaam')
    last_name = forms.CharField(max_length=30, label='Achternaam')
    birthdate = forms.CharField(max_length=30)
    phone = forms.CharField(max_length=10)
    living_address = forms.CharField(max_length=300)
    billing_address = forms.CharField(max_length=300)

    is_active = forms.BooleanField()
    #is_admin = forms.BooleanField()

    #created_at = forms.CharField(max_length=30)

    def signup(self, request, user):
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.birthdate = self.cleaned_data['birthdate']
        user.phone = self.cleaned_data['phone']
        user.living_address = self.cleaned_data['living_address']
        user.billing_address = self.cleaned_data['billing_address']
        user.is_active = self.cleaned_data['is_active']
        #user.is_admin = self.cleaned_data['is_admin']
        user.save()