const { ipcRenderer, contextBridge } = require('electron');
const { ElectronHandler } = require('./ipcRendererHandler');

// Mock the contextBridge.exposeInMainWorld method
jest.mock('electron', () => ({
  contextBridge: {
    exposeInMainWorld: jest.fn(),
  },
  ipcRenderer: {
    send: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    invoke: jest.fn(),
  },
}));

describe('IPC Renderer Handler', () => {
  let electronHandler;

  beforeEach(() => {
    // Create a new instance of the ElectronHandler
    electronHandler = new ElectronHandler();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  test('IPC Renderer methods are exposed correctly', () => {
    // Call the exposeInMainWorld method
    electronHandler.expose();

    // Assert that contextBridge.exposeInMainWorld is called with the correct arguments
    expect(contextBridge.exposeInMainWorld).toHaveBeenCalledWith('electron', {
      ipcRenderer: {
        sendMessage: expect.any(Function),
        on: expect.any(Function),
        once: expect.any(Function),
        invoke: expect.any(Function),
      },
    });
  });


});
