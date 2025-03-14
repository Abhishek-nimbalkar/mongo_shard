#!/bin/bash

echo "Enabling sharding for database..."
mongosh --port 27017 <<EOF
use some

// Enable sharding for the database
sh.enableSharding("some")

// Shard products collection by category (shard key)
sh.shardCollection("some.products", { category: 1 })

// Shard orders collection by userId (shard key)
sh.shardCollection("some.orders", { userId: 1 })

// Shard users collection by email (shard key)
sh.shardCollection("some.users", { email: 1 })

// Create indexes for sharded collections
db.products.createIndex({ category: 1 })
db.orders.createIndex({ userId: 1 })
db.users.createIndex({ email: 1 })

// Verify sharding status
sh.status()
EOF

echo "Sharding enabled and collections sharded!" 