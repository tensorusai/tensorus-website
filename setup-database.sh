#!/bin/bash

# AWS RDS Database Setup Script
# This script sets up your AWS RDS PostgreSQL database for the Tensorus application

echo "Setting up AWS RDS PostgreSQL database..."

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "Error: psql is not installed. Please install PostgreSQL client."
    echo "On Ubuntu/Debian: sudo apt-get install postgresql-client"
    echo "On MacOS: brew install postgresql"
    exit 1
fi

# Database connection details
RDS_HOST="database-tensorus-website.cluster-c9wk8kma0ino.us-west-2.rds.amazonaws.com"
RDS_PORT="5432"
RDS_USERNAME="postgres"
RDS_DATABASE="postgres"

echo "Connecting to RDS instance: $RDS_HOST"

# Run the database setup SQL
psql -h "$RDS_HOST" -p "$RDS_PORT" -U "$RDS_USERNAME" -d "$RDS_DATABASE" -f aws-db-setup.sql

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Copy .env.local.example to .env.local"
    echo "2. Add your AWS credentials to .env.local"
    echo "3. Run 'npm run dev' to start the application"
else
    echo "❌ Database setup failed. Please check your connection and credentials."
    echo "Make sure your RDS instance is accessible and the credentials are correct."
fi