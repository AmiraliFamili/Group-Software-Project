from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login, logout

# Create your views here.
def home(request):
    return render(request, "authentication/index.html")

def signup(request): 
    User = get_user_model()
    if request.method == "POST":
        
        username = request.POST['username']
        fname = request.POST['fname']
        lname = request.POST['lname']
        email = request.POST['email']
        password = request.POST['pass']
        confpassword = request.POST['confpass']
    
        if User.objects.filter(username=username): 
            messages.error(request, "Username already exists! Try Another One")
            return redirect("home")
            
        """
        Authenticate user : 
        
         if User.objects.filter(email=email):
            messages.error(request, "Email already registered !")
            return redirect('home')
        
        if len(username) > 20 :
            messages.error(request, "Username must be under 20 characters")
        if password != confpassword :
            messages.error(request, "Passwords didn't match")
        
        if not username.isalnum():
            messages.error(request, "Username must contain characters or numbers")
            return redirect("home")

            """
        
    
        account = User.objects.create_user(username, email, password)
        account.first_name = fname
        account.last_name = lname
        account.save()
        
        messages.success(request, "Your Account Is Now Created. Please sign in to continue.")
        
        
        return redirect('home')
        
    
    
    return render(request, "authentication/signup.html")

def signin(request): 
    
    if request.method == "POST" :
        username = request.POST.get("username")
        password = request.POST.get("pass")
        
        user = authenticate(username=username, password=password)
        
        if user is not None :
            login(request, user)
            fname = user.first_name
            return render(request, "authentication/index.html", {'fname' : fname})
        else : 
            messages.error(request, "BAD Credentials")
            return redirect('home')

    
    return render(request, "authentication/signin.html")

def signout(request): 
    logout(request) 
    messages.success(request, "You have been Logged Out !!!")
    return redirect('home')