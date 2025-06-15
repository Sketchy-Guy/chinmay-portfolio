import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, Edit, Trash2, Save, X, 
  Briefcase, GraduationCap, Trophy, Calendar,
  ArrowUp, ArrowDown, Star, Link
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface TimelineEvent {
  id?: string;
  title: string;
  organization: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  event_type: 'work' | 'education' | 'project' | 'achievement';
  skills: string[];
  image_url: string;
  link_url: string;
  order_index: number;
  is_featured: boolean;
}

const defaultEvent: TimelineEvent = {
  title: '',
  organization: '',
  location: '',
  start_date: '',
  end_date: '',
  description: '',
  event_type: 'work',
  skills: [],
  image_url: '',
  link_url: '',
  order_index: 0,
  is_featured: false,
};

export const TimelineManager = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .order('order_index', { ascending: false });

      if (error) throw error;

      const typedEvents: TimelineEvent[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        organization: item.organization,
        location: item.location || '',
        start_date: item.start_date,
        end_date: item.end_date || '',
        description: item.description,
        event_type: item.event_type as 'work' | 'education' | 'project' | 'achievement',
        skills: item.skills ? (Array.isArray(item.skills) ? item.skills.map(skill => String(skill)) : []) : [],
        image_url: item.image_url || '',
        link_url: item.link_url || '',
        order_index: item.order_index || 0,
        is_featured: item.is_featured || false,
      }));

      setEvents(typedEvents);
    } catch (error: any) {
      console.error('Error fetching timeline events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch timeline events: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveEvent = async () => {
    if (!editingEvent) return;

    try {
      const eventData = {
        title: editingEvent.title,
        organization: editingEvent.organization,
        location: editingEvent.location || null,
        start_date: editingEvent.start_date,
        end_date: editingEvent.end_date || null,
        description: editingEvent.description,
        event_type: editingEvent.event_type,
        skills: editingEvent.skills.length > 0 ? editingEvent.skills : null,
        image_url: editingEvent.image_url || null,
        link_url: editingEvent.link_url || null,
        order_index: editingEvent.order_index,
        is_featured: editingEvent.is_featured,
        updated_at: new Date().toISOString(),
      };

      if (editingEvent.id) {
        // Update existing event
        const { error } = await supabase
          .from('timeline_events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;
      } else {
        // Create new event
        const { error } = await supabase
          .from('timeline_events')
          .insert(eventData);

        if (error) throw error;
      }

      await fetchEvents();
      setEditingEvent(null);
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: `Timeline event ${editingEvent.id ? 'updated' : 'created'} successfully!`,
      });
    } catch (error: any) {
      console.error('Error saving timeline event:', error);
      toast({
        title: "Error",
        description: "Failed to save timeline event: " + error.message,
        variant: "destructive",
      });
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('timeline_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      await fetchEvents();
      toast({
        title: "Success",
        description: "Timeline event deleted successfully!",
      });
    } catch (error: any) {
      console.error('Error deleting timeline event:', error);
      toast({
        title: "Error",
        description: "Failed to delete timeline event: " + error.message,
        variant: "destructive",
      });
    }
  };

  const moveEvent = async (eventId: string, direction: 'up' | 'down') => {
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return;

    const newIndex = direction === 'up' ? eventIndex + 1 : eventIndex - 1;
    if (newIndex < 0 || newIndex >= events.length) return;

    try {
      const event1 = events[eventIndex];
      const event2 = events[newIndex];

      await supabase
        .from('timeline_events')
        .update({ order_index: event2.order_index })
        .eq('id', event1.id);

      await supabase
        .from('timeline_events')
        .update({ order_index: event1.order_index })
        .eq('id', event2.id);

      await fetchEvents();
      
      toast({
        title: "Success",
        description: "Timeline event order updated!",
      });
    } catch (error: any) {
      console.error('Error moving timeline event:', error);
      toast({
        title: "Error",
        description: "Failed to move timeline event: " + error.message,
        variant: "destructive",
      });
    }
  };

  const addSkill = () => {
    if (!currentSkill.trim() || !editingEvent) return;
    
    setEditingEvent({
      ...editingEvent,
      skills: [...editingEvent.skills, currentSkill.trim()]
    });
    setCurrentSkill('');
  };

  const removeSkill = (index: number) => {
    if (!editingEvent) return;
    
    const newSkills = [...editingEvent.skills];
    newSkills.splice(index, 1);
    setEditingEvent({
      ...editingEvent,
      skills: newSkills
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'work': return Briefcase;
      case 'education': return GraduationCap;
      case 'achievement': return Trophy;
      case 'project': return Calendar;
      default: return Calendar;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'work': return 'from-green-500 to-emerald-500';
      case 'education': return 'from-blue-500 to-cyan-500';
      case 'project': return 'from-purple-500 to-pink-500';
      case 'achievement': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-[#0f0f23]/90 to-[#1a1a2e]/90 backdrop-blur-xl border border-gray-700/50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-t-[#00d4ff] border-r-transparent border-b-[#ff006e] border-l-transparent rounded-full animate-spin"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Timeline Manager</h2>
          <p className="text-gray-400">Manage your professional journey timeline</p>
        </div>
        <Button 
          onClick={() => {
            setEditingEvent({ ...defaultEvent, order_index: events.length });
            setIsEditing(true);
          }}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Event List */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {events.map((event, index) => {
            const Icon = getEventIcon(event.event_type);
            const colorScheme = getEventColor(event.event_type);
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-[#0f0f23]/90 to-[#1a1a2e]/90 backdrop-blur-xl border border-gray-700/50 p-6 hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorScheme} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-white">{event.title}</h3>
                          {event.is_featured && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-purple-400 font-medium mb-1">{event.organization}</p>
                        <p className="text-gray-400 text-sm mb-2">{event.location}</p>
                        <p className="text-gray-400 text-sm mb-3">
                          {event.start_date} {event.end_date ? `- ${event.end_date}` : '- Present'}
                        </p>
                        <p className="text-gray-300 mb-3">{event.description}</p>
                        
                        {event.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {event.skills.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="px-2 py-1 bg-white/10 text-purple-300 text-xs rounded-full border border-purple-500/30"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {event.link_url && (
                          <a 
                            href={event.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-cyan-400 text-sm hover:underline"
                          >
                            <Link className="w-3 h-3" />
                            View Project
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => moveEvent(event.id!, 'up')}
                          disabled={index === 0}
                          className="bg-blue-600 hover:bg-blue-700 p-2"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => moveEvent(event.id!, 'down')}
                          disabled={index === events.length - 1}
                          className="bg-blue-600 hover:bg-blue-700 p-2"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingEvent(event);
                            setIsEditing(true);
                          }}
                          className="bg-yellow-600 hover:bg-yellow-700 p-2"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => deleteEvent(event.id!)}
                          className="bg-red-600 hover:bg-red-700 p-2"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      {isEditing && editingEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingEvent.id ? 'Edit Event' : 'Add New Event'}
              </h3>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setEditingEvent(null);
                }}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Title *</Label>
                  <Input
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="Event title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Organization *</Label>
                  <Input
                    value={editingEvent.organization}
                    onChange={(e) => setEditingEvent({...editingEvent, organization: e.target.value})}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="Company/School name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Event Type *</Label>
                  <Select
                    value={editingEvent.event_type}
                    onValueChange={(value: any) => setEditingEvent({...editingEvent, event_type: value})}
                  >
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work Experience</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="achievement">Achievement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Start Date *</Label>
                  <Input
                    value={editingEvent.start_date}
                    onChange={(e) => setEditingEvent({...editingEvent, start_date: e.target.value})}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="2023"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">End Date</Label>
                  <Input
                    value={editingEvent.end_date}
                    onChange={(e) => setEditingEvent({...editingEvent, end_date: e.target.value})}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="2024 or leave empty for present"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Location</Label>
                <Input
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="City, Country"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Description *</Label>
                <Textarea
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                  className="bg-white/5 border-white/20 text-white"
                  rows={3}
                  placeholder="Describe your role and achievements..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Skills/Technologies</Label>
                <div className="flex gap-2">
                  <Input
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="Add a skill..."
                  />
                  <Button onClick={addSkill} size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingEvent.skills.map((skill, index) => (
                    <Badge 
                      key={index}
                      className="bg-purple-500/20 text-purple-300 border-purple-500/30 cursor-pointer"
                      onClick={() => removeSkill(index)}
                    >
                      {skill} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Image URL</Label>
                  <Input
                    value={editingEvent.image_url}
                    onChange={(e) => setEditingEvent({...editingEvent, image_url: e.target.value})}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Link URL</Label>
                  <Input
                    value={editingEvent.link_url}
                    onChange={(e) => setEditingEvent({...editingEvent, link_url: e.target.value})}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingEvent.is_featured}
                  onCheckedChange={(checked) => setEditingEvent({...editingEvent, is_featured: checked})}
                />
                <Label className="text-gray-300">Featured Event</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={saveEvent} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Event
                </Button>
                <Button 
                  onClick={() => {
                    setIsEditing(false);
                    setEditingEvent(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
