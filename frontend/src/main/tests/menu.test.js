const { MenuBuilder, BrowserWindow } = require('electron');

// Mock BrowserWindow class
jest.mock('electron', () => ({
  BrowserWindow: jest.fn(),
}));

describe('Menu Builder', () => {
  let mainWindow;

  beforeEach(() => {
    // Mock BrowserWindow instance
    mainWindow = new BrowserWindow();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  test('Menu is built correctly', () => {
    // Create a new MenuBuilder instance
    const menuBuilder = new MenuBuilder(mainWindow);

    // Call the buildMenu method
    const menu = menuBuilder.buildMenu();

    // Assert that the menu is built correctly
    expect(menu).toBeDefined();

  });

});
