#!/bin/bash

set -e

TEMPDIR='.parcel-temp'
BASEPATH='src/generated'

mkdir -p ${BASEPATH}
rm -f ${BASEPATH}/*

# https://github.com/parcel-bundler/parcel/issues/7702
PARCEL_WORKERS=0 ./node_modules/.bin/parcel build ./scripts/dependencies --dist-dir ${TEMPDIR} --no-cache --no-source-maps 
echo "/* eslint-disable */" > ${BASEPATH}/index.js
cat ${TEMPDIR}/index.js >> ${BASEPATH}/index.js
rm -rf ${TEMPDIR}
