#!/bin/bash

set -e

TEMPDIR='scripts/dependencies/dist'
BASEPATH='src/generated'

mkdir -p ${BASEPATH}
rm -f ${BASEPATH}/*

cd scripts/dependencies
# https://github.com/parcel-bundler/parcel/issues/7702
pnpm build
cd ../../

echo "/* eslint-disable */" > ${BASEPATH}/index.js
cat ${TEMPDIR}/index.js >> ${BASEPATH}/index.js
rm -rf ${TEMPDIR}
