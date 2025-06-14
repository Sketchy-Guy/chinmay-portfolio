
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Download, Send, MessageSquare, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePortfolioData } from "@/contexts/DataContext";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { data } = usePortfolioData();

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit contact form to database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the form errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting contact form...');
      
      // Insert contact message into database
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim() || 'Portfolio Contact',
          message: formData.message.trim(),
          status: 'unread'
        });

      if (error) {
        console.error('Contact form submission error:', error);
        throw error;
      }

      console.log('Contact message submitted successfully');

      // Track analytics event
      try {
        await supabase
          .from('analytics_data')
          .insert({
            event_type: 'contact_form',
            event_data: { 
              form_type: 'contact',
              has_subject: !!formData.subject.trim(),
              message_length: formData.message.trim().length
            },
            page_url: window.location.href,
            referrer: document.referrer || null
          });
      } catch (analyticsError) {
        console.error('Failed to track analytics:', analyticsError);
        // Don't fail the form submission if analytics fails
      }

      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for your message. I'll get back to you soon!",
      });

      // Reset form and show success state
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setSubmitted(true);
      
      // Reset success state after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);

    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to Send Message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate and download vCard
  const downloadVCard = async () => {
    if (!data?.user) {
      toast({
        title: "Data Not Available",
        description: "Contact data is still loading. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${data.user.name}
ORG:${data.user.title}
EMAIL:${data.user.email}
TEL:${data.user.phone || 'Not provided'}
ADR:;;${data.user.location || 'Remote'};;;;
URL:${data.user.social?.linkedin || ''}
URL:${data.user.social?.github || ''}
NOTE:Portfolio: ${window.location.origin}
END:VCARD`;

      const blob = new Blob([vCardData], { type: 'text/vcard' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${data.user.name.replace(/\s+/g, '_')}_contact.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Track download event
      try {
        await supabase
          .from('analytics_data')
          .insert({
            event_type: 'download',
            event_data: { type: 'vcard', name: data.user.name },
            page_url: window.location.href,
            referrer: document.referrer || null
          });
      } catch (error) {
        console.error('Failed to track download:', error);
      }

      toast({
        title: "Contact Card Downloaded",
        description: "VCard has been saved to your downloads folder.",
      });
    } catch (error: any) {
      console.error('Error downloading vCard:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate contact card. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!data?.user) {
    return (
      <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="loading-skeleton h-96 w-full rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 reveal">
          <h2 className="section-title">Get In Touch</h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mt-6">
            Ready to collaborate on your next project? Let's discuss how we can bring your ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information Card */}
          <div className="space-y-8">
            <Card className="glass-card-enhanced p-8 hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold gradient-text flex items-center gap-3">
                  <MessageSquare className="w-6 h-6" />
                  Contact Information
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Multiple ways to reach out and connect
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email */}
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-medium">{data.user.email}</p>
                  </div>
                </div>

                {/* Phone */}
                {data.user.phone && (
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Phone</p>
                      <p className="text-white font-medium">{data.user.phone}</p>
                    </div>
                  </div>
                )}

                {/* Location */}
                {data.user.location && (
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Location</p>
                      <p className="text-white font-medium">{data.user.location}</p>
                    </div>
                  </div>
                )}

                {/* Enhanced Download Contact Card Button */}
                <div className="pt-4 border-t border-white/10">
                  <Button
                    onClick={downloadVCard}
                    className="w-full relative overflow-hidden group h-14 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-lg shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 border-2 border-transparent hover:border-cyan-400/50 rounded-xl"
                  >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                    
                    {/* Button content */}
                    <div className="relative flex items-center justify-center gap-3 z-10">
                      <Download className="w-6 h-6 group-hover:animate-bounce" />
                      <span className="font-bold tracking-wide">Download Contact Card</span>
                    </div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 -skew-x-12 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[150%] transition-transform duration-1000"></div>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
                  </Button>
                  
                  <p className="text-gray-400 text-sm text-center mt-3">
                    Save my contact details to your device instantly
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="glass-card-enhanced p-8">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold gradient-text flex items-center gap-3">
                {submitted ? <CheckCircle className="w-6 h-6" /> : <Send className="w-6 h-6" />}
                {submitted ? 'Message Sent!' : 'Send Message'}
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                {submitted 
                  ? 'Thank you for your message! I\'ll get back to you soon.' 
                  : 'Drop me a line and I\'ll get back to you promptly'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Message Delivered!</h3>
                  <p className="text-gray-300">I'll review your message and respond as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-300">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Subject Input */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-300">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                    />
                  </div>

                  {/* Message Textarea */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-300">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell me about your project or just say hi!"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className={`bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 resize-none ${errors.message ? 'border-red-500' : ''}`}
                    />
                    {errors.message && (
                      <p className="text-red-400 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {formData.message.length}/500 characters
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full cyber-button text-lg py-4"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending Message...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Send className="w-5 h-5" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
