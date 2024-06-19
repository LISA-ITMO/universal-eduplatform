from django.urls import path, include
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.conf import settings

urlpatterns = [
    path('api/', include('analytics.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
