const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const toBase64 = (string) => {
    return Buffer.from(string).toString('base64');
};

const get_pubkey_path = (_path, identifier) => {
    return path.join(_path, `public_key_${identifier}.pem`);
};

const get_prikey_path = (_path, identifier) => {
    return path.join(_path, `private_key_${identifier}.pem`);
};

const convert_pubkey = (pubkey) => {
    return 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A' + pubkey;
};

const strip_public_key = (pubkey) => {
    return convert_pubkey(
        pubkey
            .replace('-----BEGIN RSA PUBLIC KEY-----', '')
            .replace('-----END RSA PUBLIC KEY-----', '')
            .replace(/\r?\n|\r/g, ''),
    );
};

const generateKeyPair = async (_path, identifier, callback) => {
    const publicKeyPath = get_pubkey_path(_path, identifier);
    const privateKeyPath = get_prikey_path(_path, identifier);

    return new Promise((res, rej) => {
        crypto.generateKeyPair(
            'rsa',
            {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem',
                    cipher: 'aes-256-cbc',
                    passphrase: 'mediheaven',
                },
            },
            (err, publicKey, privateKey) => {
                if (err) {
                    console.error('Key pair generation failed:', err);
                    callback(err);
                    return;
                }

                fs.writeFileSync(publicKeyPath, publicKey);
                fs.writeFileSync(privateKeyPath, privateKey);

                fs.chmodSync(publicKeyPath, 0o644);
                fs.chmodSync(privateKeyPath, 0o600);

                callback(null, publicKey, privateKey);

                res(publicKey);
            },
        );
    });
};

module.exports = {
    toBase64,
    generateKeyPair,
    get_pubkey_path,
    get_prikey_path,
    strip_public_key,
};
