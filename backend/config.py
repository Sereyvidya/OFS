# Configuration settings

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'e4f3a2d5b69c4d1e91f9a79d2f51a3b6e8d4f0c1a2b3c4d5e6f7a8b9c0d1e2f3'

    # For localhost
    # SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:password@localhost/OFS'

    # For docker
    # SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:password@host.docker.internal/OFS'

    # In Docker Compose, the MySQL service is called "database"
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:password@database:3306/OFS'