from django.shortcuts import render


# Create your views here.

def base(request):
    return render(request, "hospital_site_base.html")
