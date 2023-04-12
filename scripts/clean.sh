#!/bin/bash

set -e

# This is because node.js cannot remove the root node_modules folder
rm -rf node_modules
