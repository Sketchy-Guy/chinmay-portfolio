
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Send, Calendar, Clock, Video } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const HireMe = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Submit to Supabase database
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: `${formData.projectType} - ${formData.budget}`,
          message: `Company: ${formData.company}\nProject Type: ${formData.projectType}\nBudget: ${formData.budget}\nTimeline: ${formData.timeline}\n\nDescription:\n${formData.description}`
        });

      if (error) throw error;

      toast.success("Request submitted successfully! I'll get back to you within 24 hours.");
      setFormData({
        name: "",
        email: "",
        company: "",
        projectType: "",
        budget: "",
        timeline: "",
        description: "",
      });
      
      // Navigate back after successful submission
      setTimeout(() => navigate('/'), 2000);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-indigo-950/30">
      <Header />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-8 text-white hover:bg-white/10 border border-white/20"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Portfolio
          </Button>
        
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 font-orbitron">
                Hire Me
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-slate-300 max-w-2xl mx-auto text-lg">
                I'm currently available for freelance work and exciting opportunities. 
                Please fill out the form below to get in touch about your project.
              </p>
            </div>
          
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-blue-400/30 rounded-xl p-8 shadow-2xl">
                  <h2 className="text-2xl font-bold mb-6 text-blue-400 font-orbitron">Project Details</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-slate-300">
                          Your Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                        />
                    </div>
                    
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-slate-300">
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
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                        />
                      </div>
                  </div>
                  
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium text-slate-300">
                        Company (Optional)
                      </label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your company name"
                        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="projectType" className="text-sm font-medium text-slate-300">
                          Project Type
                        </label>
                        <select
                          id="projectType"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                        <option value="" disabled>Select project type</option>
                        <option value="Website Development">Website Development</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="Software Development">Software Development</option>
                        <option value="AI/ML Project">AI/ML Project</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                      <div className="space-y-2">
                        <label htmlFor="budget" className="text-sm font-medium text-slate-300">
                          Budget Range (USD)
                        </label>
                        <select
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                        <option value="" disabled>Select budget range</option>
                        <option value="Less than $1,000">Less than $1,000</option>
                        <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                        <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                        <option value="$10,000+">$10,000+</option>
                        <option value="Not sure yet">Not sure yet</option>
                      </select>
                    </div>
                  </div>
                  
                    <div className="space-y-2">
                      <label htmlFor="timeline" className="text-sm font-medium text-slate-300">
                        Project Timeline
                      </label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                      <option value="" disabled>Select timeline</option>
                      <option value="Less than 1 month">Less than 1 month</option>
                      <option value="1-3 months">1-3 months</option>
                      <option value="3-6 months">3-6 months</option>
                      <option value="6+ months">6+ months</option>
                      <option value="Ongoing">Ongoing</option>
                    </select>
                  </div>
                  
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium text-slate-300">
                        Project Description
                      </label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Please describe your project in detail..."
                        rows={5}
                        required
                        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-orbitron"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> Submit Request
                        </>
                      )}
                    </Button>
                </form>
              </div>
            </div>
            
              <div className="lg:col-span-1">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-blue-400/30 rounded-xl p-8 shadow-2xl space-y-8">
                  <h2 className="text-2xl font-bold mb-6 text-blue-400 font-orbitron">Schedule a Call</h2>
                  
                  <div className="space-y-4">
                    <p className="text-slate-300">
                      Prefer to discuss your project directly? Schedule a free 30-minute consultation call.
                    </p>
                  
                    <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                      <Calendar className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-white">Select a Date</h3>
                        <p className="text-sm text-slate-400">Flexible availability on weekdays</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                      <Clock className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-white">Choose a Time</h3>
                        <p className="text-sm text-slate-400">Time slots available in your timezone</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                      <Video className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-white">Video Platform</h3>
                        <p className="text-sm text-slate-400">Google Meet, Zoom, or Microsoft Teams</p>
                      </div>
                    </div>
                </div>
                
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-orbitron mt-4">
                    Schedule Consultation
                  </Button>
                  
                  <div className="text-center pt-4 border-t border-slate-600 mt-4">
                    <p className="text-sm text-slate-400">
                      I'll respond to your inquiry within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HireMe;
