# PathLabReport
A web app designed for Pathologists to write and manage their pathology reports.

# Table of contents

# Introduction
PathLabReport is a web app that helps pathologists to manage their pathology reports and keep track of the medical cases
they encountered. It also let the patients visualize their diagnosis by signing into their account.
The main purpose of this app was for me to learn programming in python and create a web app using some of the most 
popular technologies like django, mysql, react.

# Technologies

# Setup

### Django framework setup and database configuration

- Install and activate a python virtual environment 
- Install dependencies from 'Project\path-lab-report\requirements.txt' using:
> pip install -r requirements.txt
- Configure database settings in 'Project\path-lab-report\path_lab_report\path_lab_report\settings.py'
- Example
```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'path_lab_report',
        'USER': 'root',
        'PASSWORD': 'root',
        'HOST': 'localhost',  # Or an IP Address that your DB is hosted on
        'PORT': '3306'
    }
}
```
- Apply migration 
> cd path_lab_report

> python manage.py migrate

### React framework setup

- Change directory to 'Project\path-lab-report\frontend' and install dependencies:
> npm install

- Back to Django 'Project\path-lab-report\path_lab_report\path_lab_report\' start server:
> python manage.py runserver

