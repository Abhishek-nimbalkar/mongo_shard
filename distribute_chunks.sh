#!/bin/bash

# Connect to mongos
mongosh --port 27017 <<EOF
use some

// Split the initial chunk into smaller ranges
db.adminCommand({ split: "some.products", middle: { category: "g" } })
db.adminCommand({ split: "some.products", middle: { category: "m" } })
db.adminCommand({ split: "some.products", middle: { category: "s" } })

// Move chunks to shard1ReplSet
db.adminCommand({ moveChunk: "some.products", find: { category: "a" }, to: "shard1ReplSet" })
db.adminCommand({ moveChunk: "some.products", find: { category: "g" }, to: "shard1ReplSet" })

// Move chunks to shard2ReplSet
db.adminCommand({ moveChunk: "some.products", find: { category: "m" }, to: "shard2ReplSet" })
db.adminCommand({ moveChunk: "some.products", find: { category: "s" }, to: "shard2ReplSet" })

// Verify chunk distribution
use config
db.chunks.find({ ns: "some.products" }).forEach(chunk => {
  print(`Chunk: ${chunk.min.category} to ${chunk.max.category}, Shard: ${chunk.shard}`);
})

EOF

echo "Chunks distributed successfully!" 