#!/bin/bash
set -x

source_dir="./build"
destination_dir="/var/www/html/offer-creator"

if [ ! -d "$source_dir" ]; then
    echo "Source directory not found: $source_dir"
    exit 1
fi

if [ ! -d "$destination_dir" ]; then
    echo "Destination directory not found, creating: $destination_dir"
    mkdir -p "$destination_dir"
fi

cp -r "$source_dir"/* "$destination_dir"

echo "Contents of '$source_dir' copied to '$destination_dir'"