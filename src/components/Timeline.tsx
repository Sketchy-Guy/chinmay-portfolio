
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Briefcase, GraduationCap, Trophy, ExternalLink, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { connectionManager } from '@/utils/connectionManager';

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

const Timeline = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
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
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Use connection manager for realtime updates
    const channelId = connectionManager.createUniqueChannelId('timeline_public');
    
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'timeline_events' 
      }, (payload) => {
        console.log(`Timeline event changed (${channelId}):`, payload);
        connectionManager.debounce('timeline-refresh', fetchEvents, 1000);
      })
      .subscribe((status) => {
        console.log(`Timeline public channel ${channelId} status:`, status);
      });

    connectionManager.registerChannel(channelId, channel);

    return () => {
      connectionManager.unregisterChannel(channelId);
    };
  }, []);

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
      case 'work': return 'from-green-500 to-emerald-500';
      case 'education': return 'from-blue-500 to-indigo-500';
      case 'project': return 'from-purple-500 to-violet-500';
      case 'achievement': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getBadgeColor = (type: string) => {
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
      <section className="py-16 bg-gradient-to-br from-gray-900/50 via-purple-900/30 to-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-8">
                <Skeleton className="w-1 h-32 flex-shrink-0" />
                <Skeleton className="flex-1 h-32" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-900/50 via-purple-900/30 to-gray-900/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-orbitron">Professional Timeline</h2>
          <p className="text-red-400">Failed to load timeline events: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="timeline" className="py-16 bg-gradient-to-br from-gray-900/50 via-purple-900/30 to-gray-900/50 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-orbitron">
            Professional Timeline
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            My journey through various roles, projects, and achievements in the tech industry
          </p>
        </motion.div>

        {/* Timeline */}
        {events.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-cyan-500 to-purple-500 opacity-60"></div>
              
              {/* Timeline events */}
              <div className="space-y-12">
                {events.map((event, index) => {
                  const Icon = getTypeIcon(event.event_type);
                  
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="relative flex gap-8 group"
                    >
                      {/* Timeline dot */}
                      <div className="relative">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getTypeColor(event.event_type)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        {event.is_featured && (
                          <div className="absolute -top-1 -right-1">
                            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pb-8">
                        <Card className="bg-gradient-to-br from-gray-900/95 to-purple-900/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group-hover:scale-[1.02]">
                          <CardContent className="p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                                <p className="text-purple-400 font-medium text-lg">{event.organization}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getBadgeColor(event.event_type)}>
                                  {event.event_type}
                                </Badge>
                                {event.is_featured && (
                                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            {/* Date and location */}
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
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
                            
                            {/* Description */}
                            <p className="text-gray-300 leading-relaxed mb-4">{event.description}</p>
                            
                            {/* Skills */}
                            {event.skills && event.skills.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {event.skills.map((skill, skillIndex) => (
                                  <span
                                    key={skillIndex}
                                    className="px-3 py-1 bg-white/10 text-purple-300 text-sm rounded-full border border-purple-500/30 hover:bg-purple-500/20 transition-colors"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            {/* Link */}
                            {event.link_url && (
                              <div className="flex justify-end">
                                <Button
                                  asChild
                                  variant="outline"
                                  size="sm"
                                  className="text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10 hover:border-cyan-400"
                                >
                                  <a
                                    href={event.link_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    View Project
                                  </a>
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No timeline events available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Timeline;
