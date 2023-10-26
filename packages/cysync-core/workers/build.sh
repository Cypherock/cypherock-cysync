BUFFER_FILE_PATH='../scripts/dependencies/dist/buffer.js'
FOLDERPATH='../src/generated/workers'
FILEPATH='../src/generated/workers/graph.js'

cd workers

pnpm i
rm -rf ${FOLDERPATH:?}/*
mkdir -p ${FOLDERPATH}

pnpm build

echo "/* eslint-disable */" > ${FILEPATH}
cat ${BUFFER_FILE_PATH} >> ${FILEPATH}
cat parcel/index.js >> ${FILEPATH}
