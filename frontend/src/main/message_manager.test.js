const { assert } = require('console');
const { store_message, get_messages } = require('./message_manager');

const main = async () => {
    await store_message(
        'admin',
        'nedb@nyu.edu',
        '{"type":"message","message":"something1","timestamp":"2024-04-26 15:33:17","uuid":"123"}',
    );
    await store_message(
        'admin',
        'nedb@nyu.edu',
        '{"type":"message","message":"something1","timestamp":"2024-04-26 15:33:17","uuid":"123"}',
    );
    await store_message(
        'admin',
        'nedb@nyu.edu',
        '{"type":"message","message":"something3","timestamp":"2024-04-26 15:33:17","uuid":"145"}',
    );

    const result = await get_messages('admin', 'nedb@nyu.edu');

    assert(result.length === 2);
    assert(
        result.includes(
            '{"type":"message","message":"something1","timestamp":"2024-04-26 15:33:17","uuid":"123"}',
        ),
    );
    assert(
        result.includes(
            '{"type":"message","message":"something3","timestamp":"2024-04-26 15:33:17","uuid":"145"}',
        ),
    );
};

main();
