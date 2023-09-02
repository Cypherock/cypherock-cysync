#!/bin/bash

set -e

# browserify library function $1:Global variable name, $2:Library name
BASEPATH='src/generated'
browserify_library () {
	./node_modules/.bin/browserify --standalone $1 - -o ${BASEPATH}/$2 <<<"module.exports = require('$2');"
	echo "/* eslint-disable */" > ${BASEPATH}/$2.js
	cat ${BASEPATH}/$2 >> ${BASEPATH}/$2.js
	rm ${BASEPATH}/$2
}

browserify_library 'BitcoinJsLib' 'bitcoinjs-lib'
browserify_library 'NearApiJs' 'near-api-js'
