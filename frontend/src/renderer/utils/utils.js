const getCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return timestamp;
};

const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const date = `${year}-${month}-${day}`;
    return date;
};

const encodeMessage = (type, message) => {
    const msg = {
        type,
        message,
        timestamp: getCurrentTime(),
    };

    return JSON.stringify(msg);
};

const decodeMessage = (message) => {
    return JSON.parse(message);
};

const decodeSender = (sender) => {
    let name = sender.split('@')[0];
    name.replace('_at_', '@');

    const index = name.indexOf('_');

    return {
        role: name.substring(0, index),
        email: name.substring(index + 1),
    };
};

const calcAge = (birthday) => {
    const birthDate = new Date(birthday);

    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();

    if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
            currentDate.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
};

export {
    getCurrentTime,
    getCurrentDate,
    encodeMessage,
    decodeMessage,
    decodeSender,
    calcAge,
};
