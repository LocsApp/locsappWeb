
def is_profile_full(request):
    user = request.user

    if user.first_name is None or user.last_name is None or user.gender is None or user.birthdate is None \
            or user.phone is None or user.living_address is None or user.billing_address is None\
            or user.is_active is False:
        return False
    return True
