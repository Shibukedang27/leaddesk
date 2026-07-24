import os

os.environ.setdefault("APP_NAME", "LeadDesk Mini")
os.environ.setdefault("APP_VERSION", "1.0.0")
os.environ.setdefault("ENVIRONMENT", "test")
os.environ.setdefault("MONGODB_URI", "mongodb://localhost:27017/leaddesk-mini-test")
os.environ.setdefault("JWT_SECRET", "test-secret-with-at-least-thirty-two-characters")
os.environ.setdefault("JWT_ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
os.environ.setdefault("REQUEST_TIMEOUT_SECONDS", "30")
os.environ.setdefault("CORS_ORIGINS", "http://localhost:5173")
os.environ.setdefault("TRUSTED_HOSTS", "testserver,localhost,127.0.0.1")
