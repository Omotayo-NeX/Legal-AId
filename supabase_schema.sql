-- Legal AI.d Users Table
-- Tracks user emails and rate limiting

-- Step 1: Backup existing data (run this first if table exists)
-- CREATE TABLE IF NOT EXISTS legal_aid_users_backup AS SELECT * FROM legal_aid_users;

-- Step 2: Drop all existing policies
DROP POLICY IF EXISTS "Service role can do anything" ON legal_aid_users;
DROP POLICY IF EXISTS "Users can insert their own email" ON legal_aid_users;
DROP POLICY IF EXISTS "Users can read their own data" ON legal_aid_users;
DROP POLICY IF EXISTS "Users can update their own usage" ON legal_aid_users;
DROP POLICY IF EXISTS "anon_users_can_insert" ON legal_aid_users;
DROP POLICY IF EXISTS "anon_users_can_select" ON legal_aid_users;
DROP POLICY IF EXISTS "anon_users_can_update" ON legal_aid_users;

-- Step 3: Disable RLS and drop table
ALTER TABLE IF EXISTS legal_aid_users DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS legal_aid_users CASCADE;

-- Step 4: Create table with proper structure
CREATE TABLE legal_aid_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    query_count_today INTEGER DEFAULT 0,
    query_count_month INTEGER DEFAULT 0,
    last_query_date DATE DEFAULT CURRENT_DATE,
    last_query_month VARCHAR(7) DEFAULT TO_CHAR(CURRENT_DATE, 'YYYY-MM'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_blocked BOOLEAN DEFAULT FALSE,
    block_reason TEXT
);

-- Step 5: Set proper ownership (allows service_role to bypass RLS automatically)
ALTER TABLE legal_aid_users OWNER TO postgres;

-- Step 6: Restore data from backup (run this if you had existing data)
-- INSERT INTO legal_aid_users SELECT * FROM legal_aid_users_backup;
-- DROP TABLE legal_aid_users_backup;

-- Step 7: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_legal_aid_users_email ON legal_aid_users(email);
CREATE INDEX IF NOT EXISTS idx_legal_aid_users_ip ON legal_aid_users(ip_address);
CREATE INDEX IF NOT EXISTS idx_legal_aid_users_blocked ON legal_aid_users(is_blocked) WHERE is_blocked = true;
CREATE INDEX IF NOT EXISTS idx_legal_aid_users_last_query ON legal_aid_users(last_query_date);

-- Step 8: Create database functions
CREATE OR REPLACE FUNCTION increment_user_usage(user_email TEXT)
RETURNS void AS $$
BEGIN
    UPDATE legal_aid_users
    SET
        query_count_today = query_count_today + 1,
        query_count_month = query_count_month + 1,
        last_query_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION reset_daily_counts()
RETURNS void AS $$
BEGIN
    UPDATE legal_aid_users
    SET query_count_today = 0
    WHERE last_query_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION reset_monthly_counts()
RETURNS void AS $$
BEGIN
    UPDATE legal_aid_users
    SET query_count_month = 0
    WHERE last_query_month < TO_CHAR(CURRENT_DATE, 'YYYY-MM');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Grant function permissions
GRANT EXECUTE ON FUNCTION increment_user_usage(TEXT) TO service_role, anon;
GRANT EXECUTE ON FUNCTION reset_daily_counts() TO service_role;
GRANT EXECUTE ON FUNCTION reset_monthly_counts() TO service_role;

-- Step 10: Enable RLS (service_role will bypass automatically, no policy needed for it)
ALTER TABLE legal_aid_users ENABLE ROW LEVEL SECURITY;

-- Step 11: Create policies ONLY for anon role (service_role bypasses RLS automatically)
CREATE POLICY "anon_users_can_insert"
ON legal_aid_users
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "anon_users_can_select"
ON legal_aid_users
FOR SELECT
TO anon
USING (true);

CREATE POLICY "anon_users_can_update"
ON legal_aid_users
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Step 12: Add table and column comments
COMMENT ON TABLE legal_aid_users IS 'Stores user emails and tracks API usage for rate limiting';
COMMENT ON COLUMN legal_aid_users.email IS 'User email address (required for tool access)';
COMMENT ON COLUMN legal_aid_users.ip_address IS 'User IP address (backup tracking)';
COMMENT ON COLUMN legal_aid_users.query_count_today IS 'Number of queries made today';
COMMENT ON COLUMN legal_aid_users.query_count_month IS 'Number of queries made this month';
COMMENT ON COLUMN legal_aid_users.last_query_date IS 'Date of last query';
COMMENT ON COLUMN legal_aid_users.is_blocked IS 'Whether user is blocked for abuse';
