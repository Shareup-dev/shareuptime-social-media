-- Performance Optimization Indexes for ShareUpTime Social Media Platform
-- This script creates indexes to improve query performance

-- User table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_username ON users USING btree (username);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users USING btree (email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at ON users USING btree (created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_is_verified ON users USING btree (is_verified) WHERE is_verified = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_location ON users USING gin (to_tsvector('english', location)) WHERE location IS NOT NULL;

-- Posts table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_user_id ON posts USING btree (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_created_at ON posts USING btree (created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_privacy_created ON posts USING btree (privacy_level, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_user_created ON posts USING btree (user_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_is_deleted ON posts USING btree (is_deleted) WHERE is_deleted = false;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_content_search ON posts USING gin (to_tsvector('english', content));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_location ON posts USING gin (to_tsvector('english', location)) WHERE location IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_feeling ON posts USING btree (feeling) WHERE feeling IS NOT NULL;

-- Follows table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_follows_follower_id ON follows USING btree (follower_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_follows_following_id ON follows USING btree (following_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_follows_created_at ON follows USING btree (created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_follows_status ON follows USING btree (status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_follows_follower_status ON follows USING btree (follower_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_follows_following_status ON follows USING btree (following_id, status);
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_follows_unique ON follows USING btree (follower_id, following_id);

-- Messages table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_conversation_id ON messages USING btree (conversation_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_sender_id ON messages USING btree (sender_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_created_at ON messages USING btree (created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_conversation_created ON messages USING btree (conversation_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_is_read ON messages USING btree (is_read) WHERE is_read = false;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_is_deleted ON messages USING btree (is_deleted) WHERE is_deleted = false;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_message_type ON messages USING btree (message_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_reply_to ON messages USING btree (reply_to_message_id) WHERE reply_to_message_id IS NOT NULL;

-- Conversations table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversations_type ON conversations USING btree (type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversations_creator_id ON conversations USING btree (creator_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversations_created_at ON conversations USING btree (created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversations_updated_at ON conversations USING btree (updated_at DESC);

-- Conversation participants table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversation_participants_conversation_id ON conversation_participants USING btree (conversation_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversation_participants_user_id ON conversation_participants USING btree (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversation_participants_is_active ON conversation_participants USING btree (is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversation_participants_role ON conversation_participants USING btree (role);
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_conversation_participants_unique ON conversation_participants USING btree (conversation_id, user_id);

-- Notifications table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_recipient_id ON notifications USING btree (recipient_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_actor_id ON notifications USING btree (actor_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_type ON notifications USING btree (type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_created_at ON notifications USING btree (created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_recipient_created ON notifications USING btree (recipient_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_is_read ON notifications USING btree (is_read) WHERE is_read = false;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_post_id ON notifications USING btree (post_id) WHERE post_id IS NOT NULL;

-- User sessions table indexes (if exists)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_user_id ON user_sessions USING btree (user_id) WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_sessions');
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_session_id ON user_sessions USING btree (session_id) WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_sessions');
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions USING btree (expires_at) WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_sessions');

-- Composite indexes for common query patterns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_feed_query ON posts USING btree (user_id, privacy_level, is_deleted, created_at DESC) 
WHERE is_deleted = false AND privacy_level IN ('public', 'friends');

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_conversation_unread ON messages USING btree (conversation_id, is_read, created_at DESC) 
WHERE is_deleted = false;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_unread ON notifications USING btree (recipient_id, is_read, created_at DESC) 
WHERE is_read = false;

-- Search optimization indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_search_name ON users USING gin (
  to_tsvector('english', coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' || coalesce(username, ''))
);

-- Partial indexes for active/non-deleted records
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_active ON posts USING btree (created_at DESC) WHERE is_deleted = false;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_active ON messages USING btree (created_at DESC) WHERE is_deleted = false;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_follows_active ON follows USING btree (created_at DESC) WHERE status = 'accepted';

-- Performance statistics update
ANALYZE users;
ANALYZE posts; 
ANALYZE follows;
ANALYZE messages;
ANALYZE conversations;
ANALYZE conversation_participants;
ANALYZE notifications;

-- Create views for common queries
CREATE OR REPLACE VIEW active_posts AS
SELECT p.*, u.username, u.first_name, u.last_name, u.profile_picture_url
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.is_deleted = false;

CREATE OR REPLACE VIEW user_feed_view AS
SELECT p.*, u.username, u.first_name, u.last_name, u.profile_picture_url,
       COUNT(DISTINCT l.id) as like_count,
       COUNT(DISTINCT c.id) as comment_count
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN post_likes l ON p.id = l.post_id
LEFT JOIN post_comments c ON p.id = c.post_id
WHERE p.is_deleted = false AND p.privacy_level IN ('public', 'friends')
GROUP BY p.id, u.id;

-- Function to get user activity summary
CREATE OR REPLACE FUNCTION get_user_activity_summary(user_id_param UUID)
RETURNS TABLE (
  post_count BIGINT,
  follower_count BIGINT,
  following_count BIGINT,
  unread_notifications BIGINT,
  unread_messages BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM posts WHERE user_id = user_id_param AND is_deleted = false),
    (SELECT COUNT(*) FROM follows WHERE following_id = user_id_param AND status = 'accepted'),
    (SELECT COUNT(*) FROM follows WHERE follower_id = user_id_param AND status = 'accepted'),
    (SELECT COUNT(*) FROM notifications WHERE recipient_id = user_id_param AND is_read = false),
    (SELECT COUNT(DISTINCT m.conversation_id) 
     FROM messages m 
     JOIN conversation_participants cp ON m.conversation_id = cp.conversation_id 
     WHERE cp.user_id = user_id_param AND m.is_read = false AND m.sender_id != user_id_param);
END;
$$ LANGUAGE plpgsql;

-- Performance monitoring function
CREATE OR REPLACE FUNCTION get_performance_stats()
RETURNS TABLE (
  table_name TEXT,
  row_count BIGINT,
  size_pretty TEXT,
  last_analyzed TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    schemaname||'.'||tablename as table_name,
    n_tup_ins + n_tup_upd - n_tup_del as row_count,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size_pretty,
    last_analyze
  FROM pg_stat_user_tables
  WHERE schemaname = 'public'
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
END;
$$ LANGUAGE plpgsql;

COMMIT;