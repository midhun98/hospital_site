from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.shortcuts import render


def handler404(request, exception):
    return render(request, 'error_pages/404.html')


def handler500(request):
    return render(request, 'error_pages/500.html')


def handler401(request):
    return render(request, 'error_pages/401.html')


User = get_user_model()


@login_required
def dashboard(request):
    if request.user.is_superuser or request.user.groups.filter(name='admin').exists():
        return render(request, "dashboard.html")
    else:
        # redirect to an unauthorized page or return an HttpResponseForbidden here
        return render(request, "unauthorized.html")
