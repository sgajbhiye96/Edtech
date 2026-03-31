import os
import pymysql
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file
pymysql.install_as_MySQLdb()
BASE_DIR = Path(__file__).resolve().parent.parent

# ─── Security ─────────────────────────────────────────────
SECRET_KEY = os.environ.get("SECRET_KEY")
DEBUG = os.environ.get("DEBUG", "False") == "True"
ALLOWED_HOSTS = os.environ.get(
   "ALLOWED_HOSTS", "localhost,127.0.0.1"
).split(",")

# ─── Applications ─────────────────────────────────────────
INSTALLED_APPS = [
   'django.contrib.admin',
   'django.contrib.auth',
   'django.contrib.contenttypes',
   'django.contrib.sessions',
   'django.contrib.messages',
   'django.contrib.staticfiles',
   # Local
   'courses',
   'enrollments',
   'users',
   # Third-party
   'rest_framework',
   'rest_framework_simplejwt',
   'corsheaders',
   # Cloudinary (IMPORTANT)
   'cloudinary',
   'cloudinary_storage',
   'leads'
]

# ─── Middleware ───────────────────────────────────────────
MIDDLEWARE = [
   'corsheaders.middleware.CorsMiddleware',
   'django.middleware.security.SecurityMiddleware',
   'whitenoise.middleware.WhiteNoiseMiddleware',
   'django.contrib.sessions.middleware.SessionMiddleware',
   'django.middleware.common.CommonMiddleware',
   'django.middleware.csrf.CsrfViewMiddleware',
   'django.contrib.auth.middleware.AuthenticationMiddleware',
   'django.contrib.messages.middleware.MessageMiddleware',
   'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'
WSGI_APPLICATION = 'backend.wsgi.application'

# ─── Templates ────────────────────────────────────────────
TEMPLATES = [
   {
       'BACKEND': 'django.template.backends.django.DjangoTemplates',
       'DIRS': [],
       'APP_DIRS': True,
       'OPTIONS': {
           'context_processors': [
               'django.template.context_processors.debug',
               'django.template.context_processors.request',
               'django.contrib.auth.context_processors.auth',
               'django.contrib.messages.context_processors.messages',
           ],
       },
   },
]

# ─── Database ─────────────────────────────────────────────
DATABASES = {
   "default": {
       "ENGINE": "django.db.backends.mysql",
       "NAME": os.environ.get("DB_NAME"),
       "USER": os.environ.get("DB_USER"),
       "PASSWORD": os.environ.get("DB_PASSWORD"),
       "HOST": os.environ.get("DB_HOST"),
       "PORT": os.environ.get("DB_PORT"),
       "OPTIONS": {
           "ssl": {"ssl": {}} if os.environ.get("DB_SSL") == "True" else {},
           "init_command": "SET sql_mode='STRICT_TRANS_TABLES'",
       }
   }
}

# ─── Auth ─────────────────────────────────────────────────
AUTH_USER_MODEL = 'users.User'
AUTH_PASSWORD_VALIDATORS = [
   {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
   {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
   {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
   {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ─── DRF & JWT ────────────────────────────────────────────
REST_FRAMEWORK = {
   'DEFAULT_AUTHENTICATION_CLASSES': (
       'rest_framework_simplejwt.authentication.JWTAuthentication',
   ),
   'DEFAULT_PERMISSION_CLASSES': (
       'rest_framework.permissions.IsAuthenticated',
   ),
}
SIMPLE_JWT = {
   'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
   'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

# ─── CORS / CSRF ──────────────────────────────────────────
CORS_ALLOWED_ORIGINS = os.environ.get(
   "CORS_ALLOWED_ORIGINS", "http://localhost:3000"
).split(",")
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = os.environ.get(
   "CSRF_TRUSTED_ORIGINS", "http://localhost:3000"
).split(",")

# ─── Static Files ─────────────────────────────────────────
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

# ─── Cloudinary (MEDIA STORAGE) ───────────────────────────
CLOUDINARY_STORAGE = {
   'CLOUD_NAME': os.environ.get("CLOUDINARY_CLOUD_NAME"),
   'API_KEY': os.environ.get("CLOUDINARY_API_KEY"),
   'API_SECRET': os.environ.get("CLOUDINARY_API_SECRET"),
}
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# ─── Internationalisation ─────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

# ─── Default PK ──────────────────────────────────────────
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'