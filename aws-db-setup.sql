-- AWS RDS PostgreSQL Database Setup
-- Run this script in your AWS RDS PostgreSQL instance

-- Create database (run as admin user)
-- CREATE DATABASE tensorus_db;

-- Connect to tensorus_db and run the following:

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enums
CREATE TYPE user_plan AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE api_key_status AS ENUM ('active', 'revoked');
CREATE TYPE project_status AS ENUM ('uploading', 'processing', 'completed', 'error');

-- Create users table (replaces auth.users from Supabase)
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cognito_sub VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    plan user_plan DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table (keeps same structure but references users table)
CREATE TABLE public.profiles (
    id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    plan user_plan DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create API keys table
CREATE TABLE public.api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    masked_key VARCHAR(255) NOT NULL,
    description TEXT,
    status api_key_status DEFAULT 'active',
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255),
    file_url TEXT,
    file_size INTEGER,
    tensor_id UUID,
    status project_status DEFAULT 'uploading',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tensors table
CREATE TABLE public.tensors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    dimensions INTEGER NOT NULL,
    shape INTEGER[] NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    sparsity DECIMAL(5,4) DEFAULT 0,
    transformation_method VARCHAR(100) NOT NULL,
    fields TEXT[] NOT NULL,
    stats JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create queries table
CREATE TABLE public.queries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    tensor_id UUID REFERENCES public.tensors(id) ON DELETE CASCADE NOT NULL,
    query_text TEXT NOT NULL,
    result TEXT,
    visual_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_messages table
CREATE TABLE public.agent_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    agent_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_cognito_sub ON public.users(cognito_sub);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_api_keys_status ON public.api_keys(status);
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_tensors_project_id ON public.tensors(project_id);
CREATE INDEX idx_tensors_user_id ON public.tensors(user_id);
CREATE INDEX idx_queries_user_id ON public.queries(user_id);
CREATE INDEX idx_queries_project_id ON public.queries(project_id);
CREATE INDEX idx_agent_messages_user_id ON public.agent_messages(user_id);
CREATE INDEX idx_agent_messages_project_id ON public.agent_messages(project_id);

-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.api_keys
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.tensors
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle new user registration from Cognito
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into profiles table as well for backward compatibility
    INSERT INTO public.profiles (id, email, name, avatar_url, plan)
    VALUES (NEW.id, NEW.email, NEW.name, NEW.avatar_url, NEW.plan);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for new user registration
CREATE TRIGGER on_user_created
    AFTER INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_signup();