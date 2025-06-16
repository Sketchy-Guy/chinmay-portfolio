
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Search, Filter, Eye, Trash2, Mail, Clock, User, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

const ContactMessagesOptimized = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [totalMessages, setTotalMessages] = useState(0);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('contact_messages')
        .select('*', { count: 'exact' });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const typedMessages = (data || []).map(msg => ({
        ...msg,
        status: msg.status as 'unread' | 'read' | 'replied'
      }));

      setMessages(typedMessages);
      setTotalMessages(count || 0);
      console.log('Contact messages loaded:', data?.length || 0);
    } catch (error: any) {
      console.error('Error fetching contact messages:', error);
      toast.error(`Failed to load messages: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    // Create unique channel name to prevent conflicts
    const channelId = `messages_admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'contact_messages' 
      }, (payload) => {
        console.log(`Contact message changed (${channelId}):`, payload);
        fetchMessages();
      })
      .subscribe((status) => {
        console.log(`Messages admin channel ${channelId} status:`, status);
      });

    return () => {
      console.log(`Cleaning up messages admin channel: ${channelId}`);
      supabase.removeChannel(channel);
    };
  }, [fetchMessages]);

  const updateMessageStatus = async (messageId: string, newStatus: 'read' | 'replied') => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: newStatus, updated_at: new Date().toISOString() }
          : msg
      ));

      toast.success(`Message marked as ${newStatus}`);
    } catch (error: any) {
      console.error('Error updating message status:', error);
      toast.error(`Failed to update message: ${error.message}`);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setTotalMessages(prev => prev - 1);
      toast.success('Message deleted successfully');
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast.error(`Failed to delete message: ${error.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'read': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'replied': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            {totalMessages} total
          </Badge>
        </div>
        <Button 
          onClick={fetchMessages} 
          variant="outline" 
          size="sm" 
          disabled={isLoading}
          className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-400"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-purple-500/30 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800/50 border-purple-500/30 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <Card className="bg-gray-900/50 border-purple-500/20">
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No messages match your filters' 
                  : 'No contact messages yet'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <Card key={message.id} className="bg-gradient-to-br from-gray-900/95 to-purple-900/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(message.status)}>
                      {message.status}
                    </Badge>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      {new Date(message.created_at).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {message.status === 'unread' && (
                      <Button
                        onClick={() => updateMessageStatus(message.id, 'read')}
                        variant="outline"
                        size="sm"
                        className="text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/10"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    {message.status !== 'replied' && (
                      <Button
                        onClick={() => updateMessageStatus(message.id, 'replied')}
                        variant="outline"
                        size="sm"
                        className="text-green-400 border-green-400/30 hover:bg-green-400/10"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteMessage(message.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-400" />
                    <span className="font-semibold text-white">{message.name}</span>
                    <span className="text-gray-400">({message.email})</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white">{message.subject}</h3>
                  <p className="text-gray-300 leading-relaxed">{message.message}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactMessagesOptimized;
