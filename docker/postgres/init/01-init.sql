-- Initialize the lemonade database
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions that might be useful for the application
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone
SET timezone = 'UTC';

-- Create additional schemas if needed
-- CREATE SCHEMA IF NOT EXISTS public;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE lemonade TO lemonade_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO lemonade_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO lemonade_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO lemonade_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO lemonade_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO lemonade_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO lemonade_user;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'Database lemonade initialized successfully';
END $$;
