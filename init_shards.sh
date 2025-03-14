#!/bin/bash

# Wait for MongoDB services to become available
echo "Waiting for MongoDB services to start..."
until mongosh --port 27019 --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  sleep 1
done
until mongosh --port 27020 --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  sleep 1
done
until mongosh --port 27021 --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  sleep 1
done

# Initialize config server replica set
echo "Initializing config server replica set..."
mongosh --port 27019 <<EOF
rs.initiate({
  _id: "configReplSet",
  configsvr: true,
  members: [
    { _id: 0, host: "configsvr:27019" }
  ]
})
EOF

# Initialize shard1 replica set
echo "Initializing shard1 replica set..."
mongosh --port 27020 <<EOF
rs.initiate({
  _id: "shard1ReplSet",
  members: [
    { _id: 0, host: "shard1_primary:27018" },
    { _id: 1, host: "shard1_secondary1:27018" },
    { _id: 2, host: "shard1_secondary2:27018" }
  ]
})
EOF

# Initialize shard2 replica set
echo "Initializing shard2 replica set..."
mongosh --port 27023 <<EOF
rs.initiate({
  _id: "shard2ReplSet",
  members: [
    { _id: 0, host: "shard2_primary:27018" },
    { _id: 1, host: "shard2_secondary1:27018" },
    { _id: 2, host: "shard2_secondary2:27018" }
  ]
})
EOF

# Wait for replica sets to initialize
echo "Waiting for replica sets to initialize..."
sleep 10

# Configure sharding through mongos
echo "Configuring sharding..."
mongosh --port 27017 <<EOF
sh.addShard("shard1ReplSet/shard1_primary:27018")
sh.addShard("shard2ReplSet/shard2_primary:27018")
EOF

echo "Sharding setup complete!" 