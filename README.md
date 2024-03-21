# Running tests for the Django project.
- Open a CMD in this current directory.
- We must install the dependencies for this project.
> python -m pip install -r requirements.txt
> cd ./project

- You can run tests as follows:
> python manage.py test


# Deployment for Clients
## Deploying this project for Exeter

- Open a CMD in this current directory.
- We must install the dependencies for this project.
> python -m pip install -r requirements.txt
> cd ./project

- We want to first establish a superuser that can control all the users within the project.
> python manage.py createsuperuser
- Enter the details you want

- Assuming db.sqlite3 is in the project, we can run
> python manage.py runserver
- This will host the server.
- If you want to view the gamemaster panel, and make changes to the features in the app, you can navigate to the [/admin] URL in your browser, and login with your superuser.

## Deploying this project for another university

- Open a CMD in this current directory
- We must install the dependencies for this project.
> python -m pip install -r requirements.txt
> cd ./project

- Crucially the data in the example [./db.sqlite3] is for Exeter specifically. You must delete this file. After that, we can remake it, without Exeter data.
> python manage.py makemigrations
> python manage.py migrate
- This will make a new database, which will be empty. We need a superuser to populate this new database for our users.
> python manage.py createsuperuser
- Enter credentials for the superuser.

> python manage.py runserver
- This will host the server. In order to populate the database, we can log into the super user.
- Navigate to the [/admin] URL in your browser, and login with your superuser.

# Using the administrator panel

- This uses the default Django administrator panel for these behaviours. You can notice that Users by default are avaliable. We also allow changing of the game-specific features. 
- You can create locations at certain places by setting their longitude and latitude. 
- Additionally, you can create items by uploading images and the size they will be on the map.

- In User Profiles, you can view all users' profiles.
- Inside this you can select which locations the users have unlocked, and you can also edit their inventory and their items' placements.
