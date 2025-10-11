#!/bin/bash
# Elasticsearch index setup for social posts
curl -X PUT "localhost:9200/posts" -H 'Content-Type: application/json' -d '{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "user_id": { "type": "keyword" },
      "content": { "type": "text" },
      "created_at": { "type": "date" },
      "likes": { "type": "integer" },
      "comments": { "type": "integer" }
    }
  }
}'
