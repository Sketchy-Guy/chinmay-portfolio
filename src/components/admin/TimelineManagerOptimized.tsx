
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Briefcase, GraduationCap, Trophy, Plus, Edit, Trash2, Save, X, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TimelineEvent {
  id: string;
  title: string;
  organization: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  description: string;
  event_type: 'work' | 'education' | 'project' | 'achievement';
  skills: string[] | null;
  image_url: string | null;
  link_url: string | null;
  order_index: number;
  is_featured: boolean;
}

const TimelineManagerOptimized = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      console.log('Fetching timeline events...');
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .order('order_index', { ascending: false })
        .order('start_date', { ascending: false });

      if (error) throw error;

      if (data) {
        const typedEvents: TimelineEvent[] = data.map(item => ({
          id: item.id,
          title: item.title,
          organization: item.organization,
          location: item.location,
          start_date: item.start_date,
          end_date: item.end_date,
          description: item.description,
          event_type: item.event_type as 'work' | 'education' | 'project' | 'achievement',
          skills: Array.isArray(item.skills) ? item.skills.map(skill => String(skill)) : null,
          image_url: item.image_url,
          link_url: item.link_url,
          order_index: item.order_index || 0,
          is_featured: item.is_featured || false
        }));
        
        setEvents(typedEvents);
        console.log('Timeline events loaded:', typedEvents.length);
      }
    } catch (error: any) {
      console.error('Error fetching timeline events:', error);
      toast.error(`Failed to load events: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();

    // Create unique channel name to prevent conflicts
    const channelId = `timeline_admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'timeline_events' 
      }, (payload) => {
        console.log(`Timeline event changed (${channelId}):`, payload);
        fetchEvents();
      })
      .subscribe((status) => {
        console.log(`Timeline admin channel ${channelId} status:`, status);
      });

    return () => {
      console.log(`Cleaning up timeline admin channel: ${channelId}`);
      supabase.removeChannel(channel);
    };
  }, [fetchEvents]);

  const handleSave = async (eventData: Partial<TimelineEvent>) => {
    setIsSaving(true);
    try {
      if (isCreating) {
        const { error } = await supabase
          .from('timeline_events')
          .insert([{
            ...eventData,
            order_index: eventData.order_index || events.length + 1
          }]);
        if (error) throw error;
        toast.success('Event created successfully!');
      } else if (editingEvent) {
        const { error } = await supabase
          .from('timeline_events')
          .update(eventData)
          .eq('id', editingEvent.id);
        if (error) throw error;
        toast.success('Event updated successfully!');
      }
      
      setEditingEvent(null);
      setIsCreating(false);
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast.error(`Failed to save event: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('timeline_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Event deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error(`Failed to delete event: ${error.message}`);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'work': return Briefcase;
      case 'education': return GraduationCap;
      case 'achievement': return Trophy;
      case 'project': return Calendar;
      default: return Calendar;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'work': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'education': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'project': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'achievement': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Timeline Events</h2>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            {events.length} events
          </Badge>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={fetchEvents} 
            variant="outline" 
            size="sm"
            disabled={isLoading}
            className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-400"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {events.map((event) => {
          const Icon = getTypeIcon(event.event_type);
          
          return (
            <Card key={event.id} className="bg-gradient-to-br from-gray-900/95 to-purple-900/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">{event.title}</CardTitle>
                      <p className="text-purple-400 font-medium">{event.organization}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(event.event_type)}>
                      {event.event_type}
                    </Badge>
                    {event.is_featured && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        Featured
                      </Badge>
                    )}
                    <Button
                      onClick={() => setEditingEvent(event)}
                      variant="outline"
                      size="sm"
                      className="text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(event.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{event.start_date}{event.end_date ? ` - ${event.end_date}` : ' - Present'}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed">{event.description}</p>
                  
                  {event.skills && event.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {event.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/10 text-purple-300 text-xs rounded border border-purple-500/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineManagerOptimized;
