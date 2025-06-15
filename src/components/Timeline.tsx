
import { useState, useEffect } from "react";
import { Calendar, MapPin, Briefcase, GraduationCap, Trophy, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// Interface for timeline event data structure  
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
  const [isVisible, setIsVisible] = useState(false);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set up intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('timeline');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Fetch timeline events from database
  useEffect(() => {
    const fetchTimelineEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('timeline_events')
          .select('*')
          .order('order_index', { ascending: false })
          .order('start_date', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setEvents(data);
        } else {
          // Fallback to default timeline data if no database entries
          setEvents([
            {
              id: '1',
              title: 'Full Stack Developer',
              organization: 'Tech Innovation Corp',
              location: 'San Francisco, CA',
              start_date: '2023',
              end_date: null,
              description: 'Leading development of scalable web applications using React, Node.js, and cloud technologies. Implementing CI/CD pipelines and mentoring junior developers.',
              event_type: 'work',
              skills: ['React', 'Node.js', 'AWS', 'MongoDB', 'TypeScript'],
              image_url: null,
              link_url: null,
              order_index: 4,
              is_featured: true
            },
            {
              id: '2', 
              title: 'Software Engineering Intern',
              organization: 'StartupXYZ',
              location: 'Remote',
              start_date: '2022',
              end_date: '2023',
              description: 'Developed and maintained web applications, collaborated with cross-functional teams to deliver high-quality software solutions.',
              event_type: 'work',
              skills: ['JavaScript', 'Python', 'SQL', 'Git', 'React'],
              image_url: null,
              link_url: null,
              order_index: 3,
              is_featured: false
            },
            {
              id: '3',
              title: 'Bachelor of Computer Science',
              organization: 'University of Technology',
              location: 'California',
              start_date: '2020',
              end_date: '2024',
              description: 'Bachelor of Science in Computer Science with focus on software engineering, artificial intelligence, and database systems. Graduated Magna Cum Laude.',
              event_type: 'education',
              skills: ['Data Structures', 'Algorithms', 'Machine Learning', 'Database Systems', 'Software Engineering'],
              image_url: null,
              link_url: null,
              order_index: 2,
              is_featured: true
            },
            {
              id: '4',
              title: 'Portfolio Website Launch',
              organization: 'Personal Project',
              location: 'Online',
              start_date: '2024',
              end_date: '2024',
              description: 'Built a comprehensive portfolio website with modern technologies, featuring responsive design, dark mode, and dynamic content management.',
              event_type: 'project',
              skills: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Framer Motion'],
              image_url: null,
              link_url: window.location.origin,
              order_index: 1,
              is_featured: true
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching timeline events:', error);
        // Set fallback data in case of error
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimelineEvents();
  }, []);

  // Get icon component based on event type
  const getIcon = (type: string) => {
    switch (type) {
      case 'work': return Briefcase;
      case 'education': return GraduationCap;
      case 'achievement': return Trophy;
      case 'project': return Calendar;
      default: return Calendar;
    }
  };

  // Get color scheme based on event type
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'work': return 'from-green-500 to-emerald-500';
      case 'education': return 'from-blue-500 to-cyan-500';
      case 'project': return 'from-purple-500 to-pink-500';
      case 'achievement': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // Timeline card component
  const TimelineCard = ({ event, index, isLeft }: { 
    event: TimelineEvent, 
    index: number,
    isLeft: boolean 
  }) => {
    const Icon = getIcon(event.event_type);
    const colorScheme = getTypeColor(event.event_type);
    
    return (
      <div className={`flex items-center w-full ${isLeft ? 'md:flex-row-reverse' : ''}`}>
        <div className={`w-full md:w-5/12 ${isLeft ? 'md:text-right md:pr-8' : 'md:pl-8'}`}>
          <Card
            className={`glass-card-enhanced p-6 group hover:scale-105 transition-all duration-300 ${
              event.is_featured ? 'ring-2 ring-purple-500/30' : ''
            } ${isVisible ? 'reveal-stagger active' : 'reveal-stagger'}`}
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <CardContent className="p-0">
              {/* Event header */}
              <div className={`flex items-center gap-3 mb-4 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorScheme} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={isLeft ? 'md:text-right' : ''}>
                  <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                  <p className="text-purple-400 font-medium">{event.organization}</p>
                  {event.is_featured && (
                    <Badge variant="outline" className="mt-1 text-yellow-400 border-yellow-400/30">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>

              {/* Event details */}
              <div className="space-y-3">
                {/* Date range */}
                <div className={`flex items-center gap-2 text-gray-400 text-sm ${isLeft ? 'md:justify-end' : ''}`}>
                  <Calendar className="w-4 h-4" />
                  <span>
                    {event.start_date}
                    {event.end_date ? ` - ${event.end_date}` : ' - Present'}
                  </span>
                </div>

                {/* Location */}
                {event.location && (
                  <div className={`flex items-center gap-2 text-gray-400 text-sm ${isLeft ? 'md:justify-end' : ''}`}>
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}

                {/* Description */}
                <p className="text-gray-300 leading-relaxed">{event.description}</p>

                {/* Skills/Technologies */}
                {event.skills && event.skills.length > 0 && (
                  <div className={`flex flex-wrap gap-2 ${isLeft ? 'md:justify-end' : ''}`}>
                    {event.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-white/10 text-purple-300 text-xs rounded-full border border-purple-500/30 hover:bg-white/20 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* External link */}
                {event.link_url && (
                  <div className={`pt-2 ${isLeft ? 'md:text-right' : ''}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(event.link_url!, '_blank')}
                      className="text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Project
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline connector - visible only on medium screens and up */}
        <div className="hidden md:flex flex-col items-center w-2/12">
          <div className={`w-4 h-4 bg-gradient-to-r ${colorScheme} rounded-full border-4 border-gray-900 shadow-lg z-10`}></div>
          {index < events.length - 1 && (
            <div className="w-1 h-24 bg-gradient-to-b from-purple-500/50 to-cyan-400/30"></div>
          )}
        </div>

        {/* Spacer for alternating layout */}
        <div className="hidden md:block w-5/12"></div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <section id="timeline" className="py-24 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="loading-skeleton h-12 w-64 mx-auto mb-4"></div>
            <div className="loading-skeleton h-6 w-96 mx-auto"></div>
          </div>
          <div className="max-w-6xl mx-auto space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="loading-skeleton h-32 w-full rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="timeline" className="py-24 md:py-32 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className={`max-w-4xl mx-auto text-center mb-16 ${isVisible ? 'reveal active' : 'reveal'}`}>
          <h2 className="section-title">Professional Journey</h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mt-6">
            My evolution through education, work experience, and key projects that shaped my career
          </p>
        </div>

        {/* Timeline content */}
        <div className="max-w-6xl mx-auto">
          {events.length > 0 ? (
            <div className="space-y-8 md:space-y-0">
              {events.map((event, index) => (
                <TimelineCard
                  key={event.id}
                  event={event}
                  index={index}
                  isLeft={index % 2 === 1}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No timeline events available</p>
            </div>
          )}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <p className="text-gray-300 mb-4">
            Ready to be part of my next chapter?
          </p>
          <Button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="cyber-button"
          >
            Let's Connect
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
