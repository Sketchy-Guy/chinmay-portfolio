
class ConnectionManager {
  private static instance: ConnectionManager;
  private activeChannels = new Map<string, any>();
  private connectionPool = new Map<string, any>();
  private debounceTimers = new Map<string, NodeJS.Timeout>();

  static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  createUniqueChannelId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  debounce(key: string, callback: () => void, delay: number = 500) {
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key)!);
    }
    
    const timer = setTimeout(() => {
      callback();
      this.debounceTimers.delete(key);
    }, delay);
    
    this.debounceTimers.set(key, timer);
  }

  registerChannel(channelId: string, channel: any) {
    this.activeChannels.set(channelId, channel);
  }

  unregisterChannel(channelId: string) {
    const channel = this.activeChannels.get(channelId);
    if (channel) {
      try {
        // Add small delay to prevent WebSocket close errors
        setTimeout(() => {
          if (typeof channel.unsubscribe === 'function') {
            channel.unsubscribe();
          }
        }, 100);
      } catch (error) {
        console.warn(`Error cleaning up channel ${channelId}:`, error);
      } finally {
        this.activeChannels.delete(channelId);
      }
    }
  }

  cleanup() {
    // Clear all debounce timers
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();
    
    // Clean up all channels
    this.activeChannels.forEach((channel, channelId) => {
      this.unregisterChannel(channelId);
    });
  }
}

export const connectionManager = ConnectionManager.getInstance();
