
import { useState, useEffect } from 'react';
import { Mail, MessageCircle, Clock, CheckCircle, Trash2, Eye, EyeOff, Filter, Search, RefreshCw, AlertCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
}

const ContactMessagesManager = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
    
    // Setup real-time subscription for new messages
    const channel = supabase
      .channel('contact-messages-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'contact_messages' 
      }, (payload) => {
        console.log('Contact message change detected:', payload);
        fetchMessages();
        
        // Show notification for new messages
        if (payload.eventType === 'INSERT') {
          toast.success('New contact message received!');
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching contact messages...');
      
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      console.log('Messages fetched:', data?.length || 0);
      setMessages((data as ContactMessage[]) || []);
    } catch (error: any) {
      console.error('Failed to fetch messages:', error);
      setError(`Failed to load messages: ${error.message}`);
      toast.error(`Failed to load messages: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: 'read' | 'replied') => {
    try {
      console.log(`Updating message ${messageId} status to ${newStatus}`);
      
      const { error } = await supabase
        .from('contact_messages')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) {
        console.error('Error updating message status:', error);
        throw error;
      }

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: newStatus, updated_at: new Date().toISOString() }
          : msg
      ));

      // Update selected message if it's the one being updated
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(prev => prev ? { ...prev, status: newStatus } : null);
      }

      toast.success(`Message marked as ${newStatus}`);
    } catch (error: any) {
      console.error('Error updating message status:', error);
      toast.error(`Failed to update status: ${error.message}`);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }

    try {
      console.log(`Deleting message ${messageId}`);
      
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        console.error('Error deleting message:', error);
        throw error;
      }

      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      // Clear selected message if it's the one being deleted
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      
      toast.success('Message deleted successfully');
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast.error(`Failed to delete message: ${error.message}`);
    }
  };

  const refreshMessages = () => {
    setIsRefreshing(true);
    fetchMessages().finally(() => setIsRefreshing(false));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'read': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'replied': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return Mail;
      case 'read': return Eye;
      case 'replied': return CheckCircle;
      default: return MessageCircle;
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const unreadCount = messages.filter(msg => msg.status === 'unread').length;
  const totalCount = messages.length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <MessageCircle className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="loading-skeleton h-24 w-full rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <MessageCircle className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
        </div>
        <Card className="glass-card border-red-500/50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Error Loading Messages</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="cyber-button">
              Reload Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Badge className="bg-red-500/20 text-red-400">
                {unreadCount} unread
              </Badge>
            )}
            <Badge className="bg-blue-500/20 text-blue-400">
              {totalCount} total
            </Badge>
          </div>
        </div>
        <Button 
          onClick={refreshMessages}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search messages by name, email, subject, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/20">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messages ({totalCount})</SelectItem>
            <SelectItem value="unread">Unread ({messages.filter(m => m.status === 'unread').length})</SelectItem>
            <SelectItem value="read">Read ({messages.filter(m => m.status === 'read').length})</SelectItem>
            <SelectItem value="replied">Replied ({messages.filter(m => m.status === 'replied').length})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredMessages.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No messages match your filters' 
                    : 'No messages yet'
                  }
                </p>
                {(searchTerm || statusFilter !== 'all') && (
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    variant="outline"
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredMessages.map((message) => {
              const StatusIcon = getStatusIcon(message.status);
              const isSelected = selectedMessage?.id === message.id;
              
              return (
                <Card 
                  key={message.id} 
                  className={`glass-card cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    isSelected ? 'ring-2 ring-purple-500/50 bg-purple-500/10' : ''
                  } ${message.status === 'unread' ? 'border-l-4 border-l-red-500' : ''}`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <StatusIcon className="w-5 h-5 text-purple-400" />
                        <div>
                          <h3 className="font-semibold text-white flex items-center gap-2">
                            {message.name}
                            {message.status === 'unread' && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
                          </h3>
                          <p className="text-sm text-gray-400">{message.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(message.status)}>
                          {message.status}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {new Date(message.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <h4 className="font-medium text-white mb-2">{message.subject}</h4>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {message.message}
                    </p>
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <span>
                        {new Date(message.created_at).toLocaleString()}
                      </span>
                      {message.status === 'unread' && (
                        <span className="text-red-400 font-medium">New</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-1">
          {selectedMessage ? (
            <Card className="glass-card sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Message Details</CardTitle>
                  <Badge className={getStatusColor(selectedMessage.status)}>
                    {selectedMessage.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">From</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-white">{selectedMessage.name}</p>
                      <p className="text-sm text-gray-400">{selectedMessage.email}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Subject</label>
                  <p className="text-white mt-1">{selectedMessage.subject}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Message</label>
                  <div className="bg-gray-800/50 p-3 rounded-lg mt-1">
                    <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Received</label>
                  <p className="text-gray-300 mt-1">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </p>
                </div>

                {selectedMessage.updated_at !== selectedMessage.created_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Last Updated</label>
                    <p className="text-gray-300 mt-1">
                      {new Date(selectedMessage.updated_at).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-4">
                  {selectedMessage.status === 'unread' && (
                    <Button 
                      onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Mark as Read
                    </Button>
                  )}
                  
                  {selectedMessage.status === 'read' && (
                    <Button 
                      onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                      className="w-full"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Replied
                    </Button>
                  )}

                  {selectedMessage.status === 'replied' && (
                    <Button 
                      onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                      variant="outline"
                      className="w-full"
                    >
                      <EyeOff className="w-4 h-4 mr-2" />
                      Mark as Unread
                    </Button>
                  )}
                  
                  <Button 
                    onClick={() => deleteMessage(selectedMessage.id)}
                    variant="outline"
                    className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-card">
              <CardContent className="p-8 text-center">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Select a message to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMessagesManager;
