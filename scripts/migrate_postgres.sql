-- PostgreSQL migration: users and friendships tables
CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS friendships (
    user1_id BIGINT REFERENCES users(user_id),
    user2_id BIGINT REFERENCES users(user_id),
    status VARCHAR(20) DEFAULT 'pending',
    PRIMARY KEY (user1_id, user2_id)
);

CREATE INDEX IF NOT EXISTS idx_friendships_user1 ON friendships(user1_id);
CREATE INDEX IF NOT EXISTS idx_friendships_user2 ON friendships(user2_id);
