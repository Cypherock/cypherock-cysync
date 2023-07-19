#! /bin/bash

pnpm build:cli
cd apps/cli
pnpm dev $*
