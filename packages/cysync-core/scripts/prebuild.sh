#!/bin/bash

set -e

TEMPDIR='.parcel-temp'
BASEPATH='src/generated'

mkdir -p ${BASEPATH}
rm ${BASEPATH}/*

./node_modules/.bin/parcel build ./scripts/dependencies --dist-dir ${TEMPDIR} --no-cache --no-source-maps 
echo "/* eslint-disable */" > ${BASEPATH}/index.js
cat ${TEMPDIR}/index.js >> ${BASEPATH}/index.js
rm -rf ${TEMPDIR}
