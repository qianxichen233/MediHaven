const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const {
    toBase64,
    generateKeyPair,
    get_pubkey_path,
    get_prikey_path,
    strip_public_key,
} = require('./utility');

const mediHeavenDir = path.join(os.homedir(), '.mediheaven');

const create_key = async (role, email) => {
    if (!fs.existsSync(mediHeavenDir)) {
        fs.mkdirSync(mediHeavenDir, { recursive: true });
    }

    return strip_public_key(
        await generateKeyPair(
            mediHeavenDir,
            toBase64(role + email),
            (err, pubkey, _) => {
                if (err) console.log(err);
            },
        ),
    );
};

const remove_key = async (role, email) => {
    if (!fs.existsSync(mediHeavenDir)) return false;

    fs.unlink(get_pubkey_path(mediHeavenDir, toBase64(role + email)), (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        } else {
            console.log('File deleted successfully');
        }
    });

    fs.unlink(get_prikey_path(mediHeavenDir, toBase64(role + email)), (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        } else {
            console.log('File deleted successfully');
        }
    });

    return true;
};

const get_password = async (role, email) => {
    const privateKeyFilePath = get_prikey_path(
        mediHeavenDir,
        toBase64(role + email),
    );

    console.log(toBase64(role + email));

    const privateKeyPEM = fs.readFileSync(privateKeyFilePath, 'utf8');

    const hash = crypto.createHash('sha256');

    // Update the hash object with the input string
    hash.update(privateKeyPEM);

    // Generate the hash digest in hexadecimal format
    return hash.digest('hex').substring(0, 20);
};

const get_public_key = async (role, email) => {
    try {
        const publicKeyBase64 = fs.readFileSync(
            get_pubkey_path(mediHeavenDir, toBase64(role + email)),
            'utf8',
        );
        return strip_public_key(publicKeyBase64);
    } catch (err) {
        console.error('Error reading file:', err);
    }
};

const sign = async (data, role, email) => {
    const privateKeyFilePath = get_prikey_path(
        mediHeavenDir,
        toBase64(role + email),
    );

    if (typeof data !== 'string') data = JSON.stringify(data);

    // console.log(data);

    let privateKeyPEM;

    try {
        privateKeyPEM = fs.readFileSync(privateKeyFilePath, 'utf8');
    } catch (error) {
        console.log(`${privateKeyFilePath} not found!`);
        return null;
    }

    // console.log(privateKeyPEM);

    const privateKey = crypto.createPrivateKey({
        key: privateKeyPEM,
        passphrase: 'mediheaven',
    });

    const signer = crypto.createSign('sha256');
    signer.update(data);

    const signature = signer.sign(privateKey, 'base64');

    return signature;
};

module.exports = {
    create_key,
    remove_key,
    get_public_key,
    sign,
    get_password,
};
