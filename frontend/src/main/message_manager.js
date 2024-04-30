const fs = require('fs');
const path = require('path');
const os = require('os');

const Datastore = require('nedb');
const { toBase64 } = require('./utility');

const mediHeavenDir = path.join(os.homedir(), '.mediheaven');

if (!fs.existsSync(mediHeavenDir)) {
    fs.mkdirSync(mediHeavenDir, { recursive: true });
}

const dbPath = path.join(os.homedir(), '.mediheaven', 'data.db');

const db = new Datastore({ filename: dbPath, autoload: true });

const get_uuid = (message) => {
    return JSON.parse(message).uuid;
};

const check_message = async (user, message) => {
    const uuid = get_uuid(message);

    const result = await new Promise((res, rej) => {
        db.find({ uuid: uuid, user: user }, function (err, docs) {
            if (err) rej(err);
            else res(docs);
        });
    });

    return result.length > 0;
};

const store_message = async (role, email, messages) => {
    console.log('store message');
    let messageList = [];
    if (Array.isArray(messages)) {
        messageList = messages;
    } else messageList = [messages];

    const user = toBase64(role + email);

    for (const message of messageList) {
        let data = message;
        if (typeof message !== 'string') data = JSON.stringify(message);

        if (await check_message(user, message.message)) return false;
        const uuid = get_uuid(message.message);

        await new Promise((res, rej) => {
            db.insert(
                { user: user, msg: data, uuid: uuid },
                function (err, newDoc) {
                    if (err) {
                        // console.error('Error inserting document:', err);
                        rej(`Error inserting document: ${err}`);
                    } else res();
                },
            );
        });
    }

    return true;
};

const get_messages = async (role, email) => {
    const messageList = [];

    const user = toBase64(role + email);

    const result = await new Promise((res, rej) => {
        db.find({ user: user }, function (err, docs) {
            if (err) rej(err);
            else res(docs);
        });
    });

    return result.map((msg) => msg.msg);
};

module.exports = { store_message, get_messages, check_message };
