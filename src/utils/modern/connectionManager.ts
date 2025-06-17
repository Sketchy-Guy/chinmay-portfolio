
/**
 * Modern Connection Manager
 * Handles WebSocket connections, real-time subscriptions, and connection pooling
 * Prevents memory leaks and connection errors with proper cleanup
 */
class ModernConnectionManager {
  private static instance: ModernConnectionManager;
  private activeChannels = new Map<string, any>();
  private debounceTimers = new Map<string, NodeJS.Timeout>();
  private connectionPool = new Map<string, any>();
  private cleanupQueue: string[] = [];

  static getInstance(): ModernConnectionManager {
    if (!ModernConnectionManager.instance) {
      ModernConnectionManager.instance = new ModernConnectionManager();
    }
    return ModernConnectionManager.instance;
  }

  /**
   * Create unique channel identifier with timestamp and random string
   * @param prefix - Channel prefix for identification
   * @returns Unique channel ID
   */
  createUniqueChannelId(prefix: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Debounce function calls to prevent excessive API requests
   * @param key - Unique key for the debounced function
   * @param callback - Function to execute after delay
   * @param delay - Delay in milliseconds (default: 500ms)
   */
  debounce(key: string, callback: () => void, delay: number = 500): void {
    // Clear existing timer if present
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key)!);
    }
    
    // Set new timer
    const timer = setTimeout(() => {
      try {
        callback();
      } catch (error) {
        console.error(`Error in debounced function ${key}:`, error);
      } finally {
        this.debounceTimers.delete(key);
      }
    }, delay);
    
    this.debounceTimers.set(key, timer);
  }

  /**
   * Register a new channel with the connection manager
   * @param channelId - Unique channel identifier
   * @param channel - Channel object to register
   */
  registerChannel(channelId: string, channel: any): void {
    try {
      // Clean up existing channel if present
      if (this.activeChannels.has(channelId)) {
        this.unregisterChannel(channelId);
      }
      
      this.activeChannels.set(channelId, channel);
      console.log(`Channel registered: ${channelId}`);
    } catch (error) {
      console.error(`Error registering channel ${channelId}:`, error);
    }
  }

  /**
   * Unregister and cleanup a channel
   * @param channelId - Channel identifier to unregister
   */
  unregisterChannel(channelId: string): void {
    const channel = this.activeChannels.get(channelId);
    
    if (channel) {
      try {
        // Add to cleanup queue for delayed cleanup
        this.cleanupQueue.push(channelId);
        
        // Immediate cleanup attempt
        setTimeout(() => {
          this.performChannelCleanup(channelId, channel);
        }, 100);
        
      } catch (error) {
        console.warn(`Error during channel cleanup ${channelId}:`, error);
      } finally {
        this.activeChannels.delete(channelId);
      }
    }
  }

  /**
   * Perform actual channel cleanup with error handling
   * @param channelId - Channel identifier
   * @param channel - Channel object to cleanup
   */
  private performChannelCleanup(channelId: string, channel: any): void {
    try {
      if (typeof channel.unsubscribe === 'function') {
        channel.unsubscribe();
      }
      
      if (typeof channel.close === 'function') {
        channel.close();
      }
      
      console.log(`Channel cleaned up: ${channelId}`);
    } catch (error) {
      console.warn(`Failed to cleanup channel ${channelId}:`, error);
    }
  }

  /**
   * Add connection to connection pool for reuse
   * @param key - Connection key
   * @param connection - Connection object
   */
  addToPool(key: string, connection: any): void {
    this.connectionPool.set(key, {
      connection,
      lastUsed: Date.now(),
      useCount: 0
    });
  }

  /**
   * Get connection from pool if available
   * @param key - Connection key
   * @returns Connection object or null
   */
  getFromPool(key: string): any {
    const poolItem = this.connectionPool.get(key);
    if (poolItem) {
      poolItem.lastUsed = Date.now();
      poolItem.useCount++;
      return poolItem.connection;
    }
    return null;
  }

  /**
   * Clean up all connections, timers, and resources
   */
  cleanup(): void {
    console.log('Starting connection manager cleanup...');
    
    // Clear all debounce timers
    this.debounceTimers.forEach((timer, key) => {
      clearTimeout(timer);
      console.log(`Cleared timer: ${key}`);
    });
    this.debounceTimers.clear();
    
    // Clean up all active channels
    const channelIds = Array.from(this.activeChannels.keys());
    channelIds.forEach(channelId => {
      this.unregisterChannel(channelId);
    });
    
    // Clean up connection pool
    this.connectionPool.forEach((poolItem, key) => {
      try {
        if (poolItem.connection && typeof poolItem.connection.close === 'function') {
          poolItem.connection.close();
        }
      } catch (error) {
        console.warn(`Error closing pooled connection ${key}:`, error);
      }
    });
    this.connectionPool.clear();
    
    // Clear cleanup queue
    this.cleanupQueue.length = 0;
    
    console.log('Connection manager cleanup completed');
  }

  /**
   * Get connection manager statistics
   * @returns Object with current connection stats
   */
  getStats(): {
    activeChannels: number;
    activeTimers: number;
    pooledConnections: number;
    queuedCleanups: number;
  } {
    return {
      activeChannels: this.activeChannels.size,
      activeTimers: this.debounceTimers.size,
      pooledConnections: this.connectionPool.size,
      queuedCleanups: this.cleanupQueue.length
    };
  }

  /**
   * Force cleanup of stale connections
   * @param maxAge - Maximum age in milliseconds (default: 5 minutes)
   */
  cleanupStaleConnections(maxAge: number = 5 * 60 * 1000): void {
    const now = Date.now();
    
    this.connectionPool.forEach((poolItem, key) => {
      if (now - poolItem.lastUsed > maxAge) {
        try {
          if (poolItem.connection && typeof poolItem.connection.close === 'function') {
            poolItem.connection.close();
          }
          this.connectionPool.delete(key);
          console.log(`Cleaned up stale connection: ${key}`);
        } catch (error) {
          console.warn(`Error cleaning up stale connection ${key}:`, error);
        }
      }
    });
  }
}

// Export singleton instance
export const modernConnectionManager = ModernConnectionManager.getInstance();

// Auto-cleanup stale connections every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    modernConnectionManager.cleanupStaleConnections();
  }, 5 * 60 * 1000);
}
