// Neo4j migration: create constraints for socialgraph
CREATE CONSTRAINT user_id_unique IF NOT EXISTS
FOR (u:User)
REQUIRE u.user_id IS UNIQUE;

CREATE CONSTRAINT friendship_unique IF NOT EXISTS
FOR ()-[f:FRIEND_WITH]-()
REQUIRE (f.user1_id, f.user2_id) IS UNIQUE;
