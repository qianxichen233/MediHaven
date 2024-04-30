class MessageQueue {
    constructor() {
        this.messages = {};
        this.uuidSet = new Set();
    }

    addMessage(role, email, message) {
        if (message && this.uuidSet.has(message.uuid)) {
            // console.log(`dup ${typeof message}`);
            return;
        }

        // console.log(`add ${message}`);

        const key = role + '_' + email;

        if (!this.messages[key]) this.messages[key] = [];

        if (!message) return;

        this.messages[key].push(message);

        this.uuidSet.add(message.uuid);

        this.messages[key] = this.messages[key].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
        );
    }

    getMessages(key) {
        if (key) return this.messages[key];

        return this.messages;
    }
}

export { MessageQueue };
