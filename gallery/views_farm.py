from django.shortcuts import render

def farm_location(request):
    return render(request, 'farm_location.html')
