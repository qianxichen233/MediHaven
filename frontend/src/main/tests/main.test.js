const { app } = require('electron');
const { createWindow } = require('./main');
// Mock the app.on method to test its behavior
jest.mock('electron', () => ({
  app: {
    whenReady: jest.fn().mockReturnValueOnce(Promise.resolve()),
    on: jest.fn(),
  },
}));

describe('Main Process', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  test('App is initialized correctly', async () => {
    // Call the createWindow function to initialize the app
    await createWindow();

    // Check if app.whenReady and app.on methods are called
    expect(app.whenReady).toHaveBeenCalled();
    expect(app.on).toHaveBeenCalled();
  });

});
