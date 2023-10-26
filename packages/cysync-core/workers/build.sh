FOLDERPATH='../src/generated/workers'
FILEPATH='../src/generated/workers/graph.js'

cd workers

rm -rf ${FOLDERPATH}/*
mkdir -p ${FOLDERPATH}

pnpm build

echo "/* eslint-disable */" > ${FILEPATH}
cp parcel/index.js ${FILEPATH}
