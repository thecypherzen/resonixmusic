#!/bin/bash

# Update package list
apt-get update

# Install Redis
apt-get install -y redis-server

# Backup original Redis configuration
cp /etc/redis/redis.conf /etc/redis/redis.conf.backup

# Create custom Redis configuration
cat > /etc/redis/redis.conf << EOF
port 6379
bind 127.0.0.1
daemonize yes
maxmemory 100mb
maxmemory-policy allkeys-lru
EOF

# Start Redis with custom configuration
redis-server /etc/redis/redis.conf

# Wait for Redis to start
sleep 2

# Check Redis status
redis-cli -p 6379 ping