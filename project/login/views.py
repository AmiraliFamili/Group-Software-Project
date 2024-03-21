""" views.py
Amirali Famili - wrote python code
Sebastian Root - fixed code
"""
from django.shortcuts import redirect, render
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login, logout

def home(request):
    return render(request, "authentication/index.html")
        
def signup(request): 
    User = get_user_model()
    if request.method == "POST":
        # Get form data
        username = request.POST["username"]
        fname = request.POST["fname"]
        lname = request.POST["lname"]
        email = request.POST["email"]
        password = request.POST["pass"]
        confpassword = request.POST["confpass"]
        
        if User.objects.filter(username=username): 
            messages.error(request, "Username already exists!")
            return redirect("/signup")
        
        if User.objects.filter(email=email):
            messages.error(request, "Email already registered!")
            return redirect('/signup')
        
        if len(username) > 20 :
            messages.error(request, "Username must be under 20 characters")
            return redirect("/signup")
        
        if password != confpassword :
            messages.error(request, "Passwords dont't match")
            return redirect("/signup")
        
        if not username.isalnum():
            messages.error(request, "Username must contain only alphanumeric characters")
            return redirect("/signup")

        # Create user account
        account = User.objects.create_user(username, email, password)
        account.first_name = fname
        account.last_name = lname
        account.save()
        
        # Display success message and redirect to home page
        messages.success(request, "Your account has been created. Please sign in to continue.")
        return redirect('home')
    
    return render(request, "authentication/signup.html")

def signin(request): 
    if request.method == "POST":
        # Get form data
        username = request.POST.get("username")
        password = request.POST.get("pass")
        
        # Authenticate user
        user = authenticate(username=username, password=password)
        
        # Check if authentication was successful
        if user is not None:
            login(request, user)
            fname = user.first_name
            return render(request, "authentication/index.html", {'fname': fname})
        else:
            messages.error(request, "BAD Credentials")
            return redirect('home')
    
    return render(request, "authentication/signin.html")

def signout(request): 
    logout(request) 
    messages.success(request, "You have been logged out.")
    return redirect('home')