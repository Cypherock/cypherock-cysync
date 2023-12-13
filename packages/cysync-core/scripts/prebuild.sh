#!/bin/bash

set -e

TEMPDIR='scripts/dependencies/dist'
BASEPATH='src/generated'
WORKER_PACKAGE_PATH='./node_modules/@cypherock/cysync-core-workers'

rm -rf ${BASEPATH}
mkdir -p ${BASEPATH}
mkdir -p ${BASEPATH}/workers

cd scripts/dependencies
# https://github.com/parcel-bundler/parcel/issues/7702
pnpm build
cd ../../

echo "/* eslint-disable */" > ${BASEPATH}/index.js
cat ${TEMPDIR}/index.js >> ${BASEPATH}/index.js

cp ${WORKER_PACKAGE_PATH}/lib/index.js ${BASEPATH}/workers/index.js
