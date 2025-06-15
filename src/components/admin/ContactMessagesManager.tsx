
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, Mail, User, Calendar, Send, 
  Trash2, MarkAsRead, MarkAsUnread, Search,
  Bell, Archive, Reply, RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at: string;
}

export const ContactMessagesManager = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  // Fetch messages from database with real-time subscription
  useEffect(() => {
    fetchMessages();
    
    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel('contact_messages_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'contact_messages' 
      }, (payload) => {
        console.log('Real-time message update:', payload);
        fetchMessages();
        
        if (payload.eventType === 'INSERT') {
          toast({
            title: "New Message Received!",
            description: `Message from ${payload.new.name}`,
            variant: "default",
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [toast]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update message status
  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) throw error;
      
      await fetchMessages();
      toast({
        title: "Success",
        description: `Message marked as ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update message: " + error.message,
        variant: "destructive",
      });
    }
  };

  // Delete message
  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      
      await fetchMessages();
      setSelectedMessage(null);
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete message: " + error.message,
        variant: "destructive",
      });
    }
  };

  // Filter messages based on search and tab
  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || message.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'read': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'replied': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'archived': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Count messages by status
  const messageCounts = {
    all: messages.length,
    unread: messages.filter(m => m.status === 'unread').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
    archived: messages.filter(m => m.status === 'archived').length,
  };

  if (isLoading) {
    return (
      <Card className="glass-card-enhanced p-6">
        <div className="flex items-center justify-center h-64">
          <div className="quantum-loader"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
          <p className="text-gray-400">Manage and respond to visitor messages</p>
        </div>
        <Button 
          onClick={fetchMessages}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Search and filters */}
      <Card className="glass-card-enhanced p-4">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          <Search className="w-5 h-5 text-gray-400 mt-3" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full bg-black/20">
            <TabsTrigger value="all" className="text-xs">
              All ({messageCounts.all})
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread ({messageCounts.unread})
            </TabsTrigger>
            <TabsTrigger value="read" className="text-xs">
              Read ({messageCounts.read})
            </TabsTrigger>
            <TabsTrigger value="replied" className="text-xs">
              Replied ({messageCounts.replied})
            </TabsTrigger>
            <TabsTrigger value="archived" className="text-xs">
              Archived ({messageCounts.archived})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages list */}
        <Card className="glass-card-enhanced">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Messages ({filteredMessages.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto space-y-3">
            <AnimatePresence>
              {filteredMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/10 ${
                    selectedMessage?.id === message.id ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-white">{message.name}</h4>
                      <p className="text-sm text-gray-400">{message.email}</p>
                    </div>
                    <Badge className={getStatusColor(message.status)}>
                      {message.status}
                    </Badge>
                  </div>
                  <h5 className="text-sm font-medium text-gray-300 mb-1">{message.subject}</h5>
                  <p className="text-xs text-gray-500 truncate">{message.message}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    {new Date(message.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredMessages.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No messages found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message detail */}
        <Card className="glass-card-enhanced">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Message Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedMessage.subject}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <User className="w-4 h-4" />
                      {selectedMessage.name} ({selectedMessage.email})
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </div>
                  </div>
                  <Badge className={getStatusColor(selectedMessage.status)}>
                    {selectedMessage.status}
                  </Badge>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-300 leading-relaxed">{selectedMessage.message}</p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <MarkAsRead className="w-4 h-4 mr-1" />
                    Mark Read
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Reply className="w-4 h-4 mr-1" />
                    Mark Replied
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => updateMessageStatus(selectedMessage.id, 'archived')}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Archive className="w-4 h-4 mr-1" />
                    Archive
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMessage(selectedMessage.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>

                {/* Quick reply */}
                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-white font-medium mb-2">Quick Reply</h4>
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="bg-white/5 border-white/20 text-white mb-2"
                    rows={3}
                  />
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => {
                      // Here you would implement email sending logic
                      toast({
                        title: "Feature Coming Soon",
                        description: "Email reply functionality will be available soon!",
                      });
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Select a message to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
