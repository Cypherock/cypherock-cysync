#!/bin/bash

set -e

# This is because node.js cannot remove the root node_modules folder
echo "Deleting: root node_modules"
rm -rf node_modules
