import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = "change-this-before-deployment"
DEBUG = True
ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
    "myportfolio-seven-neon-21.vercel.app",
    "myportfolio-git-main-faizyali750-2351.vercel.app",
    "faizan-portfolio.vercel.app",
]
ALLOWED_HOSTS.extend(
    host.strip()
    for host in os.environ.get("ALLOWED_HOSTS", "").split(",")
    if host.strip()
)
vercel_url = os.environ.get("VERCEL_URL", "").strip()
if vercel_url:
    ALLOWED_HOSTS.append(vercel_url.removeprefix("https://").removeprefix("http://").rstrip("/"))

INSTALLED_APPS = [
    "django.contrib.staticfiles",
    "portfolio",
]
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
]
ROOT_URLCONF = "portfolio_site.urls"
TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [],
    "APP_DIRS": True,
    "OPTIONS": {"context_processors": []},
}]
WSGI_APPLICATION = "portfolio_site.wsgi.application"
ASGI_APPLICATION = "portfolio_site.asgi.application"
DATABASES = {}
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Karachi"
USE_I18N = True
USE_TZ = True
STATIC_URL = "static/"
STATICFILES_DIRS = [BASE_DIR / "portfolio" / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
