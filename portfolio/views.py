from django.shortcuts import render
from .models import *

def index(request):
    portfolio = Portfolio.objects.first()
    return render(request, 'index.html', {"portfolio":portfolio})