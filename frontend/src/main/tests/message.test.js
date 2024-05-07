const fs = require('fs');
const path = require('path');
const Datastore = require('nedb');
const { store_message, get_messages, check_message } = require('./message_manager');

describe('Message Manager', () => {
  let db;
  const testRole = 'testRole';
  const testEmail = 'test@example.com';
  const testUser = 'dGVzdFJvbGVfdGVzdEBleGFtcGxlLmNvbQ=='; // Base64 encoded testRole + testEmail
  const testMessage = { from: 'sender@example.com', message: 'Hello, world!' };
  
  beforeAll(() => {
    // Create an in-memory NeDB database for testing
    db = new Datastore();
  });

  afterEach((done) => {
    // Clear the database after each test
    db.remove({}, { multi: true }, done);
  });

  test('store_message stores message successfully', async () => {
    // Call the store_message function
    const result = await store_message(testRole, testEmail, testMessage);

    // Assert that the message is stored successfully
    expect(result).toBe(true);

    // Retrieve messages from the database and assert that the stored message is present
    const messages = await get_messages(testRole, testEmail);
    expect(messages).toContainEqual(testMessage);
  });

  test('get_messages retrieves messages successfully', async () => {
    // Store a test message in the database
    await store_message(testRole, testEmail, testMessage);

    // Call the get_messages function
    const messages = await get_messages(testRole, testEmail);

    // Assert that the stored message is retrieved successfully
    expect(messages).toContainEqual(testMessage);
  });

  test('check_message returns true if message exists', async () => {
    // Store a test message in the database
    await store_message(testRole, testEmail, testMessage);

    // Call the check_message function with the stored message
    const exists = await check_message(testUser, testMessage.message);

    // Assert that check_message returns true since the message exists
    expect(exists).toBe(true);
  });

  test('check_message returns false if message does not exist', async () => {
    // Call the check_message function with a non-existing message
    const exists = await check_message(testUser, 'Non-existing message');

    // Assert that check_message returns false since the message does not exist
    expect(exists).toBe(false);
  });

  
});
