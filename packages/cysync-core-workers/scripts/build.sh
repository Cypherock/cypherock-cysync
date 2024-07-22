FOLDERPATH="lib"

rm -f ${FOLDERPATH:?}/*
mkdir -p ${FOLDERPATH}

cd scripts/dependencies
# https://github.com/parcel-bundler/parcel/issues/7702
pnpm build
cd ../../

pnpm build:parcel

echo "/* eslint-disable */" > ${FOLDERPATH}/index.js
cat scripts/dependencies/dist/index.js >> ${FOLDERPATH}/index.js
cat parcel/index.js >> ${FOLDERPATH}/index.js
