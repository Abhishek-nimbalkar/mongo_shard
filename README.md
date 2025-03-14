# MongoDB Sharding Project

This project demonstrates how to set up and use a **sharded MongoDB cluster** with **replica sets** for high availability and scalability. The cluster includes:
- **Config servers** for metadata management.
- **Shards** (with replica sets) for data storage.
- **Mongos** for query routing.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Sharding Configuration](#sharding-configuration)
4. [Data Seeding](#data-seeding)
5. [Query Testing](#query-testing)
6. [Failover Testing](#failover-testing)
7. [Key Concepts](#key-concepts)
8. [Troubleshooting](#troubleshooting)
9. [Architecture Diagram](#architecture-diagram)

---

## Prerequisites

Before starting, ensure you have the following installed:
- **Docker** and **Docker Compose**.
- **MongoDB Shell** (`mongosh`).

---

## Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Start the MongoDB Cluster
Run the following command to start the MongoDB cluster using Docker Compose:
```bash
docker-compose up -d
```

### 3. Initialize Shards and Replica Sets
Run the `init_shards.sh` script to initialize the config server and shard replica sets:
```bash
chmod +x init_shards.sh
./init_shards.sh
```

### 4. Enable Sharding
Run the `enable_sharding.sh` script to enable sharding for the database and collections:
```bash
chmod +x enable_sharding.sh
./enable_sharding.sh
```

---

## Sharding Configuration

### Shard Key
The `some.products` collection is sharded by the `category` field. This means:
- Data is distributed across shards based on the `category` value.
- Queries are routed to the appropriate shard(s) based on the `category`.

### Chunk Distribution
Chunks are split and distributed across shards as follows:
- **shard1ReplSet**: `MinKey` to `'g'` and `'g'` to `'m'`.
- **shard2ReplSet**: `'m'` to `'s'` and `'s'` to `MaxKey`.

To verify chunk distribution:
```bash
mongosh --port 27017 <<EOF
use config
db.chunks.find({ ns: "some.products" })
EOF
```

---

## Data Seeding

### Seed Products
To seed the `some.products` collection with sample data, run:
```bash
curl -X POST http://localhost:3000/seed/products
```

### Seed Users
To seed the `some.users` collection with sample data, run:
```bash
curl -X POST http://localhost:3000/seed/users
```

### Delete All Data
To delete all data from the collections, run:
```bash
curl -X DELETE http://localhost:3000/seed
```

---

## Query Testing

### Query for Data on a Specific Shard
To query for data stored on a specific shard, use the `category` field. For example:
```bash
mongosh --port 27017 <<EOF
use some
db.products.find({ category: "electronics" })
EOF
```

### Verify Query Routing
To see which shard a query is routed to, use the `explain(true)` method:
```bash
mongosh --port 27017 <<EOF
use some
db.products.find({ category: "electronics" }).explain(true)
EOF
```

---

## Failover Testing

### Simulate Shard Failure
To simulate a shard failure, stop the primary node of a shard:
```bash
docker stop shard1_primary
```

### Verify Failover
Check the replica set status to ensure a secondary node is elected as the new primary:
```bash
mongosh --port 27020 --eval "rs.status()"
```

### Test Query Routing After Failover
Run queries to ensure the `mongos` router can still route queries correctly:
```bash
mongosh --port 27017 <<EOF
use some
db.products.find({ category: "electronics" })
EOF
```

### Restart the Shard
To restore the shard, restart the stopped node:
```bash
docker start shard1_primary
```

---

## Key Concepts

### Sharding
Sharding distributes data across multiple servers to handle large datasets and high query loads.

### Replica Sets
Replica sets provide high availability by maintaining multiple copies of data. If the primary node fails, a secondary node is elected as the new primary.

### Mongos
The `mongos` router is responsible for routing queries to the correct shard(s) based on the shard key.

---

## Troubleshooting

### Queries Fail
If queries fail, check the following:
1. **Shard Status**:
   ```bash
   mongosh --port 27020 --eval "rs.status()"
   ```
2. **Chunk Distribution**:
   ```bash
   mongosh --port 27017 <<EOF
   use config
   db.chunks.find({ ns: "some.products" })
   EOF
   ```
3. **Sharding Status**:
   ```bash
   mongosh --port 27017 --eval "sh.status()"
   ```

### Shard is Down
If a shard is down, restart it:
```bash
docker start shard1_primary
docker start shard1_secondary1
docker start shard1_secondary2
```

---

## Architecture Diagram

### MongoDB Sharded Cluster Overview
```plaintext
+-------------------+       +-------------------+       +-------------------+
|   Config Server   |       |   Config Server   |       |   Config Server   |
|   (Replica Set)   |       |   (Replica Set)   |       |   (Replica Set)   |
+-------------------+       +-------------------+       +-------------------+
          |                         |                         |
          |                         |                         |
          v                         v                         v
+-------------------+       +-------------------+       +-------------------+
|     Mongos        |<------|     Mongos        |<------|     Mongos        |
|  (Query Router)   |       |  (Query Router)   |       |  (Query Router)   |
+-------------------+       +-------------------+       +-------------------+
          |                         |                         |
          |                         |                         |
          v                         v                         v
+-------------------+       +-------------------+       +-------------------+
|   Shard1 (RS)     |       |   Shard2 (RS)     |       |   Shard3 (RS)     |
|  (Replica Set)    |       |  (Replica Set)    |       |  (Replica Set)    |
+-------------------+       +-------------------+       +-------------------+
```

### Replica Set Structure
```plaintext
+-------------------+
|   Primary Node    |
|  (Read/Write)     |
+-------------------+
          |
          | Replication
          v
+-------------------+       +-------------------+
|  Secondary Node   |       |  Secondary Node   |
|  (Read-Only)      |       |  (Read-Only)      |
+-------------------+       +-------------------+
```

### Shard Key and Chunk Distribution
```plaintext
+-------------------+       +-------------------+       +-------------------+
|   Shard1 (RS)     |       |   Shard2 (RS)     |       |   Shard3 (RS)     |
|  (MinKey - 'g')   |       |  ('g' - 'm')      |       |  ('m' - MaxKey)   |
+-------------------+       +-------------------+       +-------------------+
```

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.