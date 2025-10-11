# ShareUpTime Social Media Infrastructure

## Kurulum ve Başlatma

1. Docker Compose ile altyapıyı başlatın:
	```bash
	docker compose up -d
	```

2. PostgreSQL şeması oluşturmak için:
	```bash
	docker cp scripts/migrate_postgres.sql shareup_postgres:/migrate_postgres.sql
	docker exec -e PGPASSWORD=SocialPass123! shareup_postgres psql -U social_admin -d shareup_social -f /migrate_postgres.sql
	```

3. MongoDB koleksiyonu oluşturmak için:
	```bash
	docker cp scripts/migrate_mongo.js shareup_mongo:/migrate_mongo.js
	docker exec shareup_mongo mongosh shareup_social /migrate_mongo.js
	```

4. Neo4j constraint'leri oluşturmak için:
	```bash
	docker cp scripts/migrate_neo4j.cypher shareup_neo4j:/migrate_neo4j.cypher
	docker exec -it shareup_neo4j cypher-shell -u neo4j -p graph123! -d socialgraph -f /migrate_neo4j.cypher
	```

5. Elasticsearch index oluşturmak için:
	```bash
	bash scripts/migrate_elasticsearch.sh
	```

6. Redis test komutları için:
	```bash
	bash scripts/migrate_redis.sh
	```

## Servis Bilgileri
- PostgreSQL: localhost:5432 (user: social_admin, pass: SocialPass123!)
- Redis: localhost:6379
- Neo4j: localhost:7474 (user: neo4j, pass: graph123!)
- MongoDB: localhost:27017
- Elasticsearch: localhost:9200

## Notlar
- Tüm migration ve test scriptleri `scripts/` klasöründedir.
- Modern ve ölçeklenebilir sosyal medya altyapısı için hazırdır.
# shareuptime-social-media