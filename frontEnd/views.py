from django.shortcuts import render


def handler404(request, exception):
    return render(request, 'error_pages/404.html')


def handler500(request):
    return render(request, 'error_pages/500.html')


def handler401(request):
    return render(request, 'error_pages/401.html')
