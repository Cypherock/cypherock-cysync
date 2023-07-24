#! /bin/bash

set -e

pnpm build:cli
cd apps/cli
pnpm dev $*
