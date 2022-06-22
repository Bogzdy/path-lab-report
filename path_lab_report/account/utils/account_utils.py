from datetime import datetime

SIGNUP_ENDPOINTS = {
    "account": 'account/signup',
    "patient": 'patient/signup'
}

UPDATE_ENDPOINTS ={
    "account": 'accounts/update/',
    "patient": 'patients/update/'
}


def get_age_from_date(birth_date):
    if not birth_date:
        return None
    days = datetime.now().toordinal() - birth_date.toordinal()
    return days // 365


def set_account_type(request_path, is_staff_flag):
    if SIGNUP_ENDPOINTS['patient'] in request_path:
        is_staff_flag = False
    elif SIGNUP_ENDPOINTS['account'] in request_path:
        is_staff_flag = True
