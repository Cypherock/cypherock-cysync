#!/bin/bash

set -e

mkdir -p release

OSNAME=$OSTYPE

TARGET=""
EXT=""

echo $OSNAME

case "$OSNAME" in
  darwin*)  
    TARGET="macos"
    ;; 
  linux*)   
    TARGET="linux"
    ;;
  msys*)
    TARGET="win"
    EXT=".exe"
    ;;
  cygwin*)  
    TARGET="win"
    EXT=".exe"
    ;;
  *)        
    echo "unknown: $OSTYPE"
    exit 1
    ;;
esac

echo "Building for target '$TARGET'..."

CMD="pkg package.json -t $TARGET -o \"release/cysync-cli$EXT\""

echo "$CMD"

eval "$CMD"
