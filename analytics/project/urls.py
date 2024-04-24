from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

schema_view = get_schema_view(
    openapi.Info(
        title="QuizPlatform Analytics Service API",
        default_version="v1",
        description="QuizPlatform Analytics Service API",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('admin/', admin.site.urls),
    path('api/v1/', include('analytics.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)