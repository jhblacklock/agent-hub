#!/bin/bash

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker and try again."
  exit 1
fi

# Find the Supabase container
container_name=$(docker ps -a --format "{{.Names}}" | grep "supabase")

if [ -z "$container_name" ]; then
  echo "Supabase container not found. Please ensure it is set up correctly."
  exit 1
fi

# Start the Supabase container if it's not running
if [ "$(docker ps -q -f name=$container_name)" ]; then
  echo "Supabase container '$container_name' is already running."
else
  echo "Starting the Supabase container '$container_name'..."
  docker start $container_name
fi
