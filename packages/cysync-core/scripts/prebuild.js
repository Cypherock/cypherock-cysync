const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const babelify = require('babelify');

const BASEPATH = 'src/generated';

const browserifyLibrary = (name, module) => {
  return new Promise((resolve, reject) => {
    try {
      browserify(path.join('node_modules', module), {
        standalone: name,
        plugin: [[require('esmify')]],
      })
        .transform(
          babelify.configure({
            presets: ['@babel/preset-env'],
            ignore: [/node_modules\/(?!@walletconnect)/],
          }),
        )
        .bundle((error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        });
    } catch (error) {
      reject(error);
    }
  });

  // ./node_modules/.bin/browserify --transform babelify --standalone $1 - -o ${BASEPATH}/$2 <<<"module.exports = require('$2');"
  // echo "/* eslint-disable */" > ${BASEPATH}/$2.js
  // cat ${BASEPATH}/$2 >> ${BASEPATH}/$2.js
  // rm ${BASEPATH}/$2
};

const packageModule = async (name, module) => {
  try {
    const packagedFile = await browserifyLibrary(name, module);
    fs.writeFileSync(
      path.join(BASEPATH, `${name}.js`),
      '/* eslint-disable */\n' + packagedFile,
    );
  } catch (error) {
    console.log(error);
    console.log(error.stack);
  }
};

// packageModule('BitcoinJsLib', 'bitcoinjs-lib');
packageModule('WalletConnect', '@walletconnect/web3wallet');
// browserifyLibrary('NearApiJs','near-api-js')
