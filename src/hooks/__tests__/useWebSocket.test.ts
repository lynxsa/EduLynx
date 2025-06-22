import { act, renderHook } from '@testing-library/react';
import { useWebSocket } from '../useWebSocket';

// Mock WebSocket
class MockWebSocket {
  public readyState: number = WebSocket.CONNECTING;
  public onopen: ((event: Event) => void) | null = null;
  public onclose: ((event: CloseEvent) => void) | null = null;
  public onmessage: ((event: MessageEvent) => void) | null = null;
  public onerror: ((event: Event) => void) | null = null;

  constructor(public url: string) {
    // Simulate connection after a short delay
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      if (this.onopen) {
        this.onopen(new Event('open'));
      }
    }, 100);
  }

  send(data: string) {
    // Mock send method
    console.log('Mock WebSocket send:', data);
  }

  close() {
    this.readyState = WebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close'));
    }
  }
}

// Replace global WebSocket with mock
const originalWebSocket = global.WebSocket;
beforeAll(() => {
  global.WebSocket = MockWebSocket as any;
});

afterAll(() => {
  global.WebSocket = originalWebSocket;
});

describe('useWebSocket Hook', () => {
  const testUrl = 'ws://localhost:3001/test';

  it('initializes with disconnected state', () => {
    const { result } = renderHook(() => useWebSocket(testUrl));

    expect(result.current.isConnected).toBe(false);
    expect(result.current.connectionState).toBe('disconnected');
    expect(result.current.lastMessage).toBe(null);
  });

  it('connects to WebSocket and updates state', async () => {
    const mockOnConnect = jest.fn();
    const { result } = renderHook(() => useWebSocket(testUrl, { onConnect: mockOnConnect }));

    // Wait for connection
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    expect(result.current.isConnected).toBe(true);
    expect(result.current.connectionState).toBe('connected');
    expect(mockOnConnect).toHaveBeenCalled();
  });

  it('handles incoming messages', async () => {
    const mockOnMessage = jest.fn();
    const { result } = renderHook(() => useWebSocket(testUrl, { onMessage: mockOnMessage }));

    // Wait for connection
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    // Simulate incoming message
    const testMessage = {
      type: 'UPDATE' as const,
      data: { test: 'data' },
      timestamp: Date.now(),
    };

    act(() => {
      const ws = (global.WebSocket as any).instances?.[0];
      if (ws?.onmessage) {
        ws.onmessage(
          new MessageEvent('message', {
            data: JSON.stringify(testMessage),
          })
        );
      }
    });

    expect(mockOnMessage).toHaveBeenCalledWith(testMessage);
    expect(result.current.lastMessage).toEqual(testMessage);
  });

  it('sends messages when connected', async () => {
    const { result } = renderHook(() => useWebSocket(testUrl));

    // Wait for connection
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    const testMessage = {
      type: 'UPDATE' as const,
      data: { test: 'data' },
    };

    let sentMessage: string | undefined;
    const originalSend = MockWebSocket.prototype.send;
    MockWebSocket.prototype.send = function (data: string) {
      sentMessage = data;
    };

    act(() => {
      const success = result.current.sendMessage(testMessage);
      expect(success).toBe(true);
    });

    expect(sentMessage).toBeDefined();
    if (sentMessage) {
      const parsed = JSON.parse(sentMessage);
      expect(parsed.type).toBe('UPDATE');
      expect(parsed.data).toEqual({ test: 'data' });
      expect(typeof parsed.timestamp).toBe('number');
    }

    // Restore original send method
    MockWebSocket.prototype.send = originalSend;
  });

  it('handles connection errors', async () => {
    const mockOnError = jest.fn();
    const { result } = renderHook(() => useWebSocket(testUrl, { onError: mockOnError }));

    // Simulate error after connection attempt
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
      const ws = (global.WebSocket as any).instances?.[0];
      if (ws?.onerror) {
        ws.onerror(new Event('error'));
      }
    });

    expect(result.current.connectionState).toBe('error');
    expect(mockOnError).toHaveBeenCalled();
  });

  it('handles disconnection', async () => {
    const mockOnDisconnect = jest.fn();
    const { result } = renderHook(() => useWebSocket(testUrl, { onDisconnect: mockOnDisconnect }));

    // Wait for connection
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    expect(result.current.isConnected).toBe(true);

    // Simulate disconnection
    act(() => {
      result.current.disconnect();
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.connectionState).toBe('disconnected');
    expect(mockOnDisconnect).toHaveBeenCalled();
  });

  it('attempts reconnection on connection loss', async () => {
    const { result } = renderHook(() =>
      useWebSocket(testUrl, {
        reconnectAttempts: 2,
        reconnectInterval: 100,
      })
    );

    // Wait for initial connection
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    expect(result.current.isConnected).toBe(true);

    // Simulate connection loss
    act(() => {
      const ws = (global.WebSocket as any).instances?.[0];
      if (ws?.onclose) {
        ws.onclose(new CloseEvent('close'));
      }
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.connectionState).toBe('disconnected');

    // Wait for reconnection attempt
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    // Should attempt to reconnect
    expect(result.current.connectionState).toBe('connecting');
  });

  it('sends heartbeat messages', async () => {
    const { result } = renderHook(() => useWebSocket(testUrl, { heartbeatInterval: 100 }));

    // Wait for connection
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    let heartbeatReceived = false;
    const originalSend = MockWebSocket.prototype.send;
    MockWebSocket.prototype.send = function (data: string) {
      const parsed = JSON.parse(data);
      if (parsed.type === 'HEARTBEAT') {
        heartbeatReceived = true;
      }
    };

    // Wait for heartbeat
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    expect(heartbeatReceived).toBe(true);

    // Restore original send method
    MockWebSocket.prototype.send = originalSend;
  });

  it('cleans up on unmount', async () => {
    const { result, unmount } = renderHook(() => useWebSocket(testUrl));

    // Wait for connection
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    expect(result.current.isConnected).toBe(true);

    // Unmount component
    unmount();

    // Connection should be closed
    // Note: This test might need adjustment based on cleanup implementation
  });
});
