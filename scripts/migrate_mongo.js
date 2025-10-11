// MongoDB migration: posts collection
use('shareup_social');
db.createCollection('posts', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "content"],
      properties: {
        user_id: { bsonType: "objectId" },
        content: { bsonType: "string" },
        likes: { bsonType: "array" },
        comments: { bsonType: "array" },
        created_at: { bsonType: "date" }
      }
    }
  }
});
db.posts.createIndex({ user_id: 1, created_at: -1 });
