# ShareUpTime Social Media Infrastructure

## Overview
This project provides a modern and scalable infrastructure for a social media platform. It includes the following components:

- **PostgreSQL**: For user data and relationships.
- **Redis**: For real-time feeds and caching.
- **Neo4j**: For managing friendship graphs.
- **MongoDB**: For storing posts and content.
- **Elasticsearch**: For search functionality.

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed on your system.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Shareup-dev/shareuptime-social-media.git
   cd shareuptime-social-media
   ```

2. Start the infrastructure using Docker Compose:
   ```bash
   docker compose up -d
   ```

3. Run migration scripts for each service:
   - **PostgreSQL**:
     ```bash
     docker cp scripts/migrate_postgres.sql shareup_postgres:/migrate_postgres.sql
     docker exec -e PGPASSWORD=SocialPass123! shareup_postgres psql -U social_admin -d shareup_social -f /migrate_postgres.sql
     ```
   - **MongoDB**:
     ```bash
     docker cp scripts/migrate_mongo.js shareup_mongo:/migrate_mongo.js
     docker exec shareup_mongo mongosh shareup_social /migrate_mongo.js
     ```
   - **Neo4j**:
     ```bash
     docker cp scripts/migrate_neo4j.cypher shareup_neo4j:/migrate_neo4j.cypher
     docker exec -it shareup_neo4j cypher-shell -u neo4j -p graph123! -d socialgraph -f /migrate_neo4j.cypher
     ```
   - **Elasticsearch**:
     ```bash
     bash scripts/migrate_elasticsearch.sh
     ```
   - **Redis**:
     ```bash
     bash scripts/migrate_redis.sh
     ```

## Service Details
- **PostgreSQL**: `localhost:5432` (user: `social_admin`, pass: `SocialPass123!`)
- **Redis**: `localhost:6379`
- **Neo4j**: `localhost:7474` (user: `neo4j`, pass: `graph123!`)
- **MongoDB**: `localhost:27017`
- **Elasticsearch**: `localhost:9200`

## Notes
- All migration and test scripts are located in the `scripts/` directory.
- This infrastructure is designed for modern and scalable social media platforms.

## Future Enhancements
- Integration with DigitalOcean for large file storage.
- CI/CD pipeline setup for automated deployments.
- Advanced monitoring and logging solutions.

## Folder Structure

The project is organized into the following folders:

- **database/**: Contains all database-related files, such as migration scripts and schemas for PostgreSQL, MongoDB, and Neo4j.
- **scripts/**: Contains utility and migration scripts for setting up and managing the infrastructure.
- **configs/**: Contains configuration files for various services such as Elasticsearch, Redis, and others.

Each folder includes a `README.md` file explaining its purpose.