
import { useState, useEffect } from "react";
import { Calendar, MapPin, Briefcase, GraduationCap } from "lucide-react";

interface TimelineEvent {
  id: string;
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  type: 'work' | 'education' | 'project';
  skills: string[];
}

const Timeline = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [events, setEvents] = useState<TimelineEvent[]>([]);

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

  useEffect(() => {
    // Mock timeline data
    setEvents([
      {
        id: '1',
        title: 'Full Stack Developer',
        organization: 'Tech Corp',
        location: 'San Francisco, CA',
        startDate: '2023',
        endDate: 'Present',
        description: 'Leading development of scalable web applications using React, Node.js, and cloud technologies.',
        type: 'work',
        skills: ['React', 'Node.js', 'AWS', 'MongoDB']
      },
      {
        id: '2',
        title: 'Software Engineering Intern',
        organization: 'StartupXYZ',
        location: 'Remote',
        startDate: '2022',
        endDate: '2023',
        description: 'Developed and maintained web applications, collaborated with cross-functional teams.',
        type: 'work',
        skills: ['JavaScript', 'Python', 'SQL', 'Git']
      },
      {
        id: '3',
        title: 'Computer Science Degree',
        organization: 'University of Technology',
        location: 'California',
        startDate: '2020',
        endDate: '2024',
        description: 'Bachelor of Science in Computer Science with focus on software engineering and AI.',
        type: 'education',
        skills: ['Data Structures', 'Algorithms', 'Machine Learning', 'Database Systems']
      },
      {
        id: '4',
        title: 'E-Commerce Platform',
        organization: 'Personal Project',
        location: 'Online',
        startDate: '2023',
        endDate: '2023',
        description: 'Built a full-stack e-commerce platform with payment integration and admin dashboard.',
        type: 'project',
        skills: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL']
      }
    ]);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'work': return Briefcase;
      case 'education': return GraduationCap;
      case 'project': return Calendar;
      default: return Calendar;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'work': return 'from-green-500 to-emerald-500';
      case 'education': return 'from-blue-500 to-cyan-500';
      case 'project': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const TimelineCard = ({ event, index, isLeft }: { 
    event: TimelineEvent, 
    index: number,
    isLeft: boolean 
  }) => {
    const Icon = getIcon(event.type);
    
    return (
      <div className={`flex items-center w-full ${isLeft ? 'md:flex-row-reverse' : ''}`}>
        <div className={`w-full md:w-5/12 ${isLeft ? 'md:text-right md:pr-8' : 'md:pl-8'}`}>
          <div
            className={`glass-card-enhanced p-6 group ${isVisible ? 'reveal-stagger active' : 'reveal-stagger'}`}
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <div className={`flex items-center gap-3 mb-4 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTypeColor(event.type)} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className={isLeft ? 'md:text-right' : ''}>
                <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                <p className="text-purple-400 font-medium">{event.organization}</p>
              </div>
            </div>

            <div className={`flex items-center gap-2 text-gray-400 text-sm mb-2 ${isLeft ? 'md:justify-end' : ''}`}>
              <Calendar className="w-4 h-4" />
              <span>{event.startDate} - {event.endDate}</span>
            </div>

            <div className={`flex items-center gap-2 text-gray-400 text-sm mb-4 ${isLeft ? 'md:justify-end' : ''}`}>
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>

            <p className="text-gray-300 mb-4 leading-relaxed">{event.description}</p>

            <div className={`flex flex-wrap gap-2 ${isLeft ? 'md:justify-end' : ''}`}>
              {event.skills.map((skill, skillIndex) => (
                <span
                  key={skillIndex}
                  className="px-3 py-1 bg-white/10 text-purple-300 text-xs rounded-full border border-purple-500/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline line and dot */}
        <div className="hidden md:flex flex-col items-center w-2/12">
          <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full border-4 border-gray-900 shadow-lg"></div>
          {index < events.length - 1 && (
            <div className="w-1 h-24 bg-gradient-to-b from-purple-500/50 to-cyan-400/50"></div>
          )}
        </div>

        <div className="hidden md:block w-5/12"></div>
      </div>
    );
  };

  return (
    <section id="timeline" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-4xl mx-auto text-center mb-16 ${isVisible ? 'reveal active' : 'reveal'}`}>
          <h2 className="section-title">Professional Timeline</h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mt-6">
            My journey through education, work experience, and key projects
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
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
        </div>
      </div>
    </section>
  );
};

export default Timeline;
