# AWS Migration Guide

This application has been successfully migrated from Supabase to AWS services.

## AWS Services Used

- **Authentication**: AWS Cognito User Pools
- **Database**: Amazon RDS Aurora PostgreSQL
- **Storage**: Amazon S3
- **API**: Next.js API Routes with AWS SDK

## Setup Instructions

### 1. Environment Variables

Copy `.env.local.example` to `.env.local` and update with your AWS credentials:

```bash
cp .env.local.example .env.local
```

Add your AWS Access Keys to `.env.local`:
```
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

### 2. Database Setup

Run the database setup script:

```bash
./setup-database.sh
```

This will create all necessary tables in your RDS PostgreSQL instance.

### 3. AWS Cognito Configuration

Your Cognito User Pool is already configured:
- User Pool ID: `us-west-2_s9jukt`
- Client ID: `2pcaos1s27c11tvcjsjou3u5e7`
- Region: `us-west-2`

### 4. S3 Configuration

Your S3 bucket is configured:
- Bucket: `tensorus-website-bucket`
- Region: `us-west-2`

### 5. Start the Application

```bash
npm install
npm run dev
```

## Key Changes

### Authentication
- Replaced Supabase Auth with AWS Cognito
- Updated sign-in/sign-up flows
- JWT token handling for server-side authentication

### Database
- Migrated from Supabase PostgreSQL to Amazon RDS Aurora
- Added direct PostgreSQL connection with `pg` library
- Updated all database queries to use new connection

### File Storage
- Replaced Supabase Storage with Amazon S3
- Presigned URL generation for secure file uploads
- S3 SDK for file operations

### API Routes
- Updated all API routes to use AWS services
- Removed Supabase client dependencies
- Direct database connections for server-side operations

## File Structure

```
lib/aws/
├── auth.ts           # Cognito authentication
├── config.ts         # AWS Amplify configuration
├── context.tsx       # React context for auth
├── database.ts       # PostgreSQL connection
├── projects.ts       # Project management
├── server-auth.ts    # Server-side auth
├── storage.ts        # S3 file operations
└── user-management.ts # User database operations
```

## Migration Notes

- All Supabase-specific code has been removed
- Authentication now uses Cognito JWT tokens
- Database operations use direct PostgreSQL queries
- File uploads use S3 presigned URLs
- Row Level Security replaced with application-level authorization

The migration is complete and the application is ready for development with AWS services.