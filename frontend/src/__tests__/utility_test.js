const fs = require('fs');
const path = require('path');
const { generateKeyPair, get_prikey_path, get_pubkey_path, strip_public_key, toBase64 } = require('../main/utility');
.
describe('Utility Functions', () => {
    describe('toBase64', () => {
        it('should convert string to base64', () => {
            const inputString = 'hello';
            const expectedBase64 = Buffer.from(inputString).toString('base64');
            expect(toBase64(inputString)).toEqual(expectedBase64);
        });
    });

    describe('get_pubkey_path', () => {
        it('should return the correct public key path', () => {
            const _path = '/some/path';
            const identifier = 'identifier';
            const expectedPath = path.join(_path, `public_key_${identifier}.pem`);
            expect(get_pubkey_path(_path, identifier)).toEqual(expectedPath);
        });
    });

    describe('get_prikey_path', () => {
        it('should return the correct private key path', () => {
            const _path = '/some/path';
            const identifier = 'identifier';
            const expectedPath = path.join(_path, `private_key_${identifier}.pem`);
            expect(get_prikey_path(_path, identifier)).toEqual(expectedPath);
        });
    });

    describe('strip_public_key', () => {
        it('should strip public key format and convert', () => {
            const publicKey = '-----BEGIN RSA PUBLIC KEY-----\nABCD\n-----END RSA PUBLIC KEY-----\n';
            const expectedConvertedKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AABCD';
            expect(strip_public_key(publicKey)).toEqual(expectedConvertedKey);
        });
    });

    describe('generateKeyPair', () => {
        it('should generate key pair and write to files', async () => {
            const _path = '/some/path';
 
