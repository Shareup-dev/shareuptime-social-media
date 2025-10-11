#!/bin/bash
# shareuptime_social_network_db.sh - Sosyal Ağlar için Full Stack Veritabanı Kurulumu

# ---------------------------
# 1. TEMEL AYARLAR
# ---------------------------
echo "🔵 ShareUpTime Sosyal Ağ Veritabanı Kurulumu Başlıyor..."
export INSTALL_DIR="/opt/shareuptime"
mkdir -p $INSTALL_DIR/{data,backups,logs}

# ---------------------------
# 2. POSTGRESQL (Kullanıcı Verileri)
# ---------------------------
sudo apt install -y postgresql-14 postgresql-contrib
sudo systemctl start postgresql

# Sosyal ağ için optimize edilmiş DB
sudo -u postgres psql <<EOF
CREATE DATABASE shareup_social;
CREATE USER social_admin WITH PASSWORD 'SocialPass123!';
GRANT ALL PRIVILEGES ON DATABASE shareup_social TO social_admin;

\c shareup_social
-- Sosyal ağ için özel tablolar
CREATE TABLE users (
 user_id BIGSERIAL PRIMARY KEY,
 username VARCHAR(50) UNIQUE NOT NULL,
 email VARCHAR(100) UNIQUE NOT NULL,
 created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE friendships (
 user1_id BIGINT REFERENCES users(user_id),
 user2_id BIGINT REFERENCES users(user_id),
 status VARCHAR(20) DEFAULT 'pending',
 PRIMARY KEY (user1_id, user2_id)
);

-- Performans için indexler
CREATE INDEX idx_friendships_user1 ON friendships(user1_id);
CREATE INDEX idx_friendships_user2 ON friendships(user2_id);
ALTER SYSTEM SET shared_buffers = '4GB';
EOF

# ---------------------------
# 3. REDIS (Gerçek Zamanlı Feed)
# ---------------------------
sudo apt install -y redis-server
sudo systemctl start redis

# Sosyal feed için Redis konfigürasyonu
redis-cli CONFIG SET notify-keyspace-events KEA
redis-cli CONFIG SET maxmemory 2GB
redis-cli CONFIG SET maxmemory-policy allkeys-lru

# ---------------------------
# 4. NEO4J (Arkadaşlık Grafiği)
# ---------------------------
wget https://neo4j.com/artifact.php?name=neo4j-community-5.12.0-unix.tar.gz
tar -xf neo4j-community-5.12.0-unix.tar.gz
mv neo4j-community-5.12.0 $INSTALL_DIR/neo4j

# Neo4j ayarları
cat > $INSTALL_DIR/neo4j/conf/neo4j.conf <<EOF
dbms.default_database=socialgraph
dbms.memory.heap.initial_size=2G
dbms.memory.heap.max_size=4G
dbms.security.procedures.unrestricted=apoc.*
EOF

# ---------------------------
# 5. MONGODB (İçerik Depolama)
# ---------------------------
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Sosyal içerik için şema
mongosh <<EOF
use shareup_social
db.createCollection('posts', {
 validator: {
   $jsonSchema: {
     bsonType: "object",
     required: ["user_id", "content"],
     properties: {
       user_id: { bsonType: "objectId" },
       content: { bsonType: "string" },
       likes: { bsonType: "array" },
       comments: { bsonType: "array" }
     }
   }
 }
})

db.posts.createIndex({ user_id: 1, created_at: -1 })
EOF

# ---------------------------
# 6. ELASTICSEARCH (Arama)
# ---------------------------
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.9.0-linux-x86_64.tar.gz
tar -xzf elasticsearch-8.9.0-linux-x86_64.tar.gz
mv elasticsearch-8.9.0 $INSTALL_DIR/elasticsearch

# Sosyal arama için ayarlar
cat > $INSTALL_DIR/elasticsearch/config/elasticsearch.yml <<EOF
cluster.name: shareuptime-search
node.name: node-1
network.host: 0.0.0.0
discovery.type: single-node
xpack.security.enabled: false
EOF

# ---------------------------
# 7. ORTAM DEĞİŞKENLERİ
# ---------------------------
cat > /etc/shareuptime.env <<EOF
# PostgreSQL
export PG_URL="postgresql://social_admin:SocialPass123!@localhost:5432/shareup_social"

# Redis
export REDIS_URL="redis://localhost:6379/0"

# Neo4j
export NEO4J_URL="bolt://localhost:7687"
export NEO4J_USER="neo4j"
export NEO4J_PASS="graph123!"

# MongoDB
export MONGO_URI="mongodb://localhost:27017/shareup_social"

# Elasticsearch
export ES_URL="http://localhost:9200"
EOF

# ---------------------------
# 8. BAŞLATMA SCRIPTİ
# ---------------------------
cat > $INSTALL_DIR/start_all.sh <<EOF
#!/bin/bash
source /etc/shareuptime.env

# PostgreSQL
sudo systemctl start postgresql

# Redis
sudo systemctl start redis-server

# Neo4j
$INSTALL_DIR/neo4j/bin/neo4j start

# MongoDB
sudo systemctl start mongod

# Elasticsearch
$INSTALL_DIR/elasticsearch/bin/elasticsearch -d -p $INSTALL_DIR/data/es.pid
EOF

chmod +x $INSTALL_DIR/start_all.sh

# ---------------------------
# 9. TEST KOMUTLARI
# ---------------------------
echo "✅ Kurulum Tamamlandı!"
echo "🛠️ Test Komutları:"
echo "1. PostgreSQL: psql $PG_URL -c 'SELECT count(*) FROM users'"
echo "2. Redis: redis-cli ping"
echo "3. Neo4j: curl -H 'Content-Type: application/json' -d '{\"statements\":[{\"statement\":\"MATCH (n) RETURN count(n)\"}]}' http://localhost:7474/db/socialgraph/tx/commit"
echo "4. MongoDB: mongosh $MONGO_URI --eval 'db.posts.countDocuments()'"
echo "5. Elasticsearch: curl -X GET $ES_URL/_cat/indices?v"

# ---------------------------
# 10. YEDEKLEME CRON JOB
# ---------------------------
(crontab -l 2>/dev/null; echo "0 3 * * * $INSTALL_DIR/backup.sh") | crontab 
