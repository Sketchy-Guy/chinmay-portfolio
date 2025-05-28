
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Download, MessageCircle, User, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactInfo = ({ icon: Icon, title, content, link, delay }: {
  icon: any,
  title: string,
  content: string,
  link: string,
  delay: number
}) => (
  <div 
    className={`glass-card p-6 group hover:scale-105 transition-all duration-500 reveal-stagger`}
    style={{ animationDelay: `${delay}s` }}
  >
    <a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 h-full"
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-portfolio-purple to-portfolio-teal flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/25 transition-all duration-500">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-portfolio-purple group-hover:to-portfolio-teal transition-all duration-500">
          {title}
        </h4>
        <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 text-sm">
          {content}
        </p>
      </div>
    </a>
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('contact');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent Successfully! 🎉",
        description: "Thank you for reaching out! I'll get back to you within 24 hours.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };
  
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "chinmaykumarpanda004@gmail.com",
      link: "mailto:chinmaykumarpanda004@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+91 7815014638",
      link: "tel:+917815014638",
    },
    {
      icon: MapPin,
      title: "Location",
      content: "Bhubaneswar, Odisha, India",
      link: "https://maps.google.com/?q=Bhubaneswar,Odisha,India",
    },
  ];

  const downloadVCard = () => {
    const vcardData = `BEGIN:VCARD
VERSION:3.0
FN:Chinmay Kumar Panda
TEL;TYPE=CELL:+917815014638
EMAIL:chinmaykumarpanda004@gmail.com
URL:https://github.com/chinmaykumarpanda
URL:https://linkedin.com/in/chinmay-kumar-panda
ADR;TYPE=HOME:;;Bhubaneswar;Odisha;;India
END:VCARD`;
    
    const blob = new Blob([vcardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'chinmay_kumar_panda.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Contact Downloaded! 📱",
      description: "Contact details saved to your device successfully!",
    });
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-portfolio-purple/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-r from-portfolio-teal/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-500/5 to-blue-500/5 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className={`max-w-4xl mx-auto text-center mb-20 ${isVisible ? 'reveal active' : 'reveal'}`}>
          <h2 className="section-title">Let's Connect</h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mt-6">
            Ready to bring your ideas to life? Let's discuss your project and create something amazing together. 
            I'm always excited to collaborate on innovative solutions.
          </p>
          
          {/* Decorative elements */}
          <div className="flex items-center justify-center mt-8 gap-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-portfolio-purple"></div>
            <div className="w-3 h-3 rounded-full bg-portfolio-purple animate-pulse"></div>
            <div className="w-24 h-px bg-gradient-to-r from-portfolio-purple to-portfolio-teal"></div>
            <div className="w-3 h-3 rounded-full bg-portfolio-teal animate-pulse"></div>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-portfolio-teal"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-8">
            <div className={`glass-card p-8 ${isVisible ? 'reveal-stagger active' : 'reveal-stagger'}`} style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-portfolio-purple to-portfolio-teal flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold gradient-text">Get In Touch</h3>
              </div>
              
              <p className="text-gray-300 mb-8 leading-relaxed">
                I'm always open to discussing new opportunities, interesting projects, 
                or potential collaborations. Feel free to reach out through any of the channels below.
              </p>
              
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <ContactInfo 
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    content={item.content}
                    link={item.link}
                    delay={0.3 + (index * 0.1)}
                  />
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-portfolio-teal" />
                  <span className="text-gray-300 text-sm">
                    Typical response time: Within 24 hours
                  </span>
                </div>
                <Button 
                  onClick={downloadVCard}
                  className="btn-secondary w-full group"
                >
                  <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                  Download Contact Card
                </Button>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className={`glass-card p-8 ${isVisible ? 'reveal-stagger active' : 'reveal-stagger'}`} style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-portfolio-teal to-portfolio-purple flex items-center justify-center">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold gradient-text">Send a Message</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="contact-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Your Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john.doe@example.com"
                      required
                      className="contact-input"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-300">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Collaboration Opportunity"
                    required
                    className="contact-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-300">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, ideas, or how we can work together..."
                    rows={6}
                    required
                    className="contact-input resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="btn-primary w-full group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Message...
                    </div>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" /> 
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
