
import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, MapPin, ExternalLink, Save, X, AlertCircle, Clock, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface TimelineEvent {
  id: string;
  title: string;
  organization: string;
  description: string;
  event_type: string;
  start_date: string;
  end_date?: string | null;
  location?: string | null;
  link_url?: string | null;
  image_url?: string | null;
  is_featured: boolean;
  order_index: number;
  skills?: string[] | null;
  created_at: string;
  updated_at: string;
}

interface FormData {
  title: string;
  organization: string;
  description: string;
  event_type: string;
  start_date: string;
  end_date: string;
  location: string;
  link_url: string;
  image_url: string;
  is_featured: boolean;
  order_index: number;
  skills: string[];
}

const TimelineManager = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialFormData: FormData = {
    title: '',
    organization: '',
    description: '',
    event_type: 'work',
    start_date: '',
    end_date: '',
    location: '',
    link_url: '',
    image_url: '',
    is_featured: false,
    order_index: 0,
    skills: []
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    fetchEvents();
    
    // Setup real-time subscription
    const channel = supabase
      .channel('timeline-events-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'timeline_events' 
      }, () => {
        console.log('Timeline events changed, refetching...');
        fetchEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching timeline events...');
      
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      console.log('Timeline events fetched:', data?.length || 0);
      
      // Transform the data to handle the skills type properly
      const transformedEvents: TimelineEvent[] = (data || []).map(event => ({
        ...event,
        skills: Array.isArray(event.skills) ? event.skills : 
                typeof event.skills === 'string' ? event.skills.split(',').map(s => s.trim()) :
                null,
        end_date: event.end_date || null,
        location: event.location || null,
        link_url: event.link_url || null,
        image_url: event.image_url || null
      }));
      
      setEvents(transformedEvents);
    } catch (error: any) {
      console.error('Failed to fetch timeline events:', error);
      toast.error(`Failed to load timeline events: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.organization.trim()) {
      newErrors.organization = 'Organization is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.event_type) {
      newErrors.event_type = 'Event type is required';
    }

    if (formData.end_date && formData.start_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      newErrors.end_date = 'End date must be after start date';
    }

    if (formData.link_url && !isValidUrl(formData.link_url)) {
      newErrors.link_url = 'Please enter a valid URL';
    }

    if (formData.image_url && !isValidUrl(formData.image_url)) {
      newErrors.image_url = 'Please enter a valid image URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const eventData = {
        title: formData.title.trim(),
        organization: formData.organization.trim(),
        description: formData.description.trim(),
        event_type: formData.event_type,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        location: formData.location.trim() || null,
        link_url: formData.link_url.trim() || null,
        image_url: formData.image_url.trim() || null,
        is_featured: formData.is_featured,
        order_index: formData.order_index,
        skills: formData.skills.length > 0 ? formData.skills : null,
        updated_at: new Date().toISOString()
      };

      let result;
      if (editingEvent) {
        console.log('Updating timeline event:', editingEvent.id);
        result = await supabase
          .from('timeline_events')
          .update(eventData)
          .eq('id', editingEvent.id)
          .select()
          .single();
      } else {
        console.log('Creating new timeline event');
        result = await supabase
          .from('timeline_events')
          .insert(eventData)
          .select()
          .single();
      }

      if (result.error) {
        console.error('Database error:', result.error);
        throw result.error;
      }

      console.log('Timeline event saved successfully:', result.data);
      toast.success(editingEvent ? 'Timeline event updated successfully!' : 'Timeline event created successfully!');
      
      resetForm();
      await fetchEvents();
    } catch (error: any) {
      console.error('Error saving timeline event:', error);
      toast.error(`Failed to save timeline event: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingEvent(null);
    setShowForm(false);
    setErrors({});
  };

  const handleEdit = (event: TimelineEvent) => {
    console.log('Editing timeline event:', event.id);
    setEditingEvent(event);
    setFormData({
      title: event.title,
      organization: event.organization,
      description: event.description,
      event_type: event.event_type,
      start_date: event.start_date,
      end_date: event.end_date || '',
      location: event.location || '',
      link_url: event.link_url || '',
      image_url: event.image_url || '',
      is_featured: event.is_featured,
      order_index: event.order_index,
      skills: Array.isArray(event.skills) ? event.skills : []
    });
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this timeline event?')) {
      return;
    }

    try {
      console.log('Deleting timeline event:', eventId);
      const { error } = await supabase
        .from('timeline_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast.success('Timeline event deleted successfully');
      await fetchEvents();
    } catch (error: any) {
      console.error('Error deleting timeline event:', error);
      toast.error(`Failed to delete timeline event: ${error.message}`);
    }
  };

  const handleSkillsChange = (skillsString: string) => {
    const skills = skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    setFormData(prev => ({ ...prev, skills }));
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'work': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'education': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'project': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'achievement': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Timeline Events</h2>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="loading-skeleton h-32 w-full rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Timeline Events</h2>
          <Badge className="bg-blue-500/20 text-blue-400">
            {events.length} events
          </Badge>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="cyber-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="glass-card-enhanced">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              {editingEvent ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingEvent ? 'Edit Timeline Event' : 'Add New Timeline Event'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Title *</label>
                <Input
                  placeholder="Event title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Organization *</label>
                <Input
                  placeholder="Company/Institution name"
                  value={formData.organization}
                  onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                  className={errors.organization ? 'border-red-500' : ''}
                />
                {errors.organization && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.organization}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Event Type *</label>
                <Select value={formData.event_type} onValueChange={(value) => setFormData(prev => ({ ...prev, event_type: value }))}>
                  <SelectTrigger className={errors.event_type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work Experience</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                  </SelectContent>
                </Select>
                {errors.event_type && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.event_type}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Order Index</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.order_index}
                  onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Start Date *</label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  className={errors.start_date ? 'border-red-500' : ''}
                />
                {errors.start_date && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.start_date}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">End Date</label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  className={errors.end_date ? 'border-red-500' : ''}
                />
                {errors.end_date && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.end_date}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Location</label>
                <Input
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Link URL</label>
                <Input
                  placeholder="https://example.com"
                  value={formData.link_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                  className={errors.link_url ? 'border-red-500' : ''}
                />
                {errors.link_url && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.link_url}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Description *</label>
              <Textarea
                placeholder="Describe the event, role, or achievement..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Skills/Technologies</label>
              <Input
                placeholder="React, TypeScript, Node.js (comma separated)"
                value={formData.skills.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Image URL</label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                className={errors.image_url ? 'border-red-500' : ''}
              />
              {errors.image_url && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.image_url}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked as boolean }))}
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-300">
                Featured Event
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="cyber-button flex-1"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </div>
                )}
              </Button>
              <Button 
                onClick={resetForm}
                variant="outline"
                className="flex-1"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No timeline events yet. Create your first event!</p>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="glass-card-enhanced hover:scale-[1.02] transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex flex-col items-center">
                      <Badge className={getEventTypeColor(event.event_type)}>
                        {event.event_type}
                      </Badge>
                      {event.is_featured && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 mt-2">
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-white">{event.title}</h3>
                        {event.link_url && (
                          <a href={event.link_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 text-purple-400 hover:text-purple-300" />
                          </a>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {event.organization}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(event.start_date)} - {event.end_date ? formatDate(event.end_date) : 'Present'}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-300 mb-3">{event.description}</p>
                      
                      {event.skills && Array.isArray(event.skills) && event.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {event.skills.map((skill, index) => (
                            <Badge key={index} className="bg-purple-500/20 text-purple-400">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(event)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(event.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TimelineManager;
