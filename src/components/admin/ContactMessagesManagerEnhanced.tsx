import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const ContactMessagesManagerEnhanced = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const messagesPerPage = 10;

  // Fetch messages with pagination and filtering
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('contact_messages')
        .select('*', { count: 'exact' });

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Apply search filter
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%`);
      }

      // Apply pagination
      const from = (currentPage - 1) * messagesPerPage;
      const to = from + messagesPerPage - 1;
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Type cast the data to ensure status is the correct union type
      const typedMessages = (data || []).map(msg => ({
        ...msg,
        status: msg.status as 'unread' | 'read' | 'replied'
      }));

      setMessages(typedMessages);
      setTotalMessages(count || 0);
      console.log('Contact messages fetched:', data?.length || 0);
    } catch (error: any) {
      console.error('Error fetching contact messages:', error);
      toast.error(`Failed to load messages: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Update message status
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

      // Update local state
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

  // Delete message
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

  // Setup real-time subscription
  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('contact-messages-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'contact_messages' 
      }, () => {
        console.log('Contact messages changed, refetching...');
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentPage, statusFilter, searchTerm]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      fetchMessages();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'read': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'replied': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalPages = Math.ceil(totalMessages / messagesPerPage);

  if (isLoading && messages.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-6 h-6 text-purple-400" />
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
          <Badge className="bg-blue-500/20 text-blue-400">
            {totalMessages} total
          </Badge>
        </div>
        <Button onClick={fetchMessages} variant="outline" size="sm" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass-card-enhanced">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
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
          <Card className="glass-card">
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
            <Card key={message.id} className="glass-card-enhanced hover:scale-[1.01] transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(message.status)}>
                      {message.status}
                    </Badge>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      {formatDate(message.created_at)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                className={currentPage === i + 1 ? "cyber-button" : ""}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          
          <Button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContactMessagesManagerEnhanced;
