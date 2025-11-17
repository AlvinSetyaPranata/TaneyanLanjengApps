# PostgreSQL Setup Guide

This guide explains how to set up PostgreSQL for the Taneyan Lanjeng application.

## Prerequisites

1. PostgreSQL installed on your system
2. Python 3.8+
3. pip package manager

## Installation Steps

### 1. Install PostgreSQL Dependencies

Make sure you have the required Python packages installed:

```bash
cd /Users/alvinsetyapranata/Documents/TaneyanLanjengApps/backend/backend
pip install -r requirements.txt
```

This will install:
- `psycopg2` - PostgreSQL adapter for Python
- `dj-database-url` - Database URL parsing utility

### 2. Configure Environment Variables

Update the `.env` file in the backend directory with your PostgreSQL configuration:

```env
# PostgreSQL Database Configuration
DATABASE_NAME=taneyanlanjeng
DATABASE_USERNAME=your_postgres_username
DATABASE_PASSWORD=your_postgres_password
DATABASE_HOST=localhost
DATABASE_PORT=5432

# Django Settings
SECRET_KEY=your_secret_key_here
DEBUG=True
```

### 3. Create PostgreSQL Database

Connect to PostgreSQL and create the database:

```sql
sudo -u postgres psql
CREATE DATABASE taneyanlanjeng;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE taneyanlanjeng TO your_username;
ALTER USER your_username CREATEDB;
\q
```

### 4. Run Migrations

After configuring the database, run the migrations:

```bash
cd /Users/alvinsetyapranata/Documents/TaneyanLanjengApps/backend/backend
python manage.py migrate
```

### 5. Seed the Database

Populate the database with initial data:

```bash
python manage.py seed_data
```

## Database Configuration Details

The application supports three database configurations:

1. **Production (Heroku)**: Uses `DATABASE_URL` environment variable
2. **PostgreSQL**: Uses individual database environment variables
3. **SQLite (Development)**: Fallback for local development

The configuration priority is:
1. `DATABASE_URL` (if `dj_database_url` is available)
2. Individual PostgreSQL variables (if `DATABASE_NAME` and `DATABASE_USERNAME` are set)
3. SQLite3 (default fallback)

## Troubleshooting

### Common Issues

1. **"psycopg2 not found"**: Install with `pip install psycopg2-binary`
2. **"Permission denied"**: Make sure your PostgreSQL user has CREATEDB privileges
3. **"Connection refused"**: Verify PostgreSQL is running and accessible

### Testing the Connection

You can test your database connection with:

```bash
python manage.py dbshell
```

If this connects successfully, your database configuration is correct.