
import { useState } from "react";
import { usePortfolioData, CertificationData } from "@/components/DataManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Edit, ExternalLink, Award, Calendar, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CertificationsManager() {
  const { data, addCertification, removeCertification, updateCertification } = usePortfolioData();
  const { toast } = useToast();
  const [newCertification, setNewCertification] = useState<CertificationData>({ 
    title: "", 
    issuer: "", 
    date: "", 
    credential: "",
    link: "",
    logo: ""
  });
  const [editingCertification, setEditingCertification] = useState<{ index: number; certification: CertificationData } | null>(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleAddCertification = () => {
    if (!newCertification.title || !newCertification.issuer || !newCertification.date) {
      toast({
        title: "Error",
        description: "Title, issuer, and date are required.",
        variant: "destructive",
      });
      return;
    }
    
    addCertification(newCertification);
    setNewCertification({ 
      title: "", 
      issuer: "", 
      date: "", 
      credential: "",
      link: "",
      logo: ""
    });
    setOpen(false);
    
    toast({
      title: "Certification Added",
      description: `${newCertification.title} has been added to your certifications.`,
    });
  };

  const handleUpdateCertification = () => {
    if (!editingCertification) return;
    
    updateCertification(editingCertification.index, editingCertification.certification);
    setEditingCertification(null);
    setEditOpen(false);
    
    toast({
      title: "Certification Updated",
      description: `${editingCertification.certification.title} has been updated.`,
    });
  };

  const handleEditCertification = (index: number) => {
    setEditingCertification({ index, certification: { ...data.certifications[index] } });
    setEditOpen(true);
  };

  const handleDeleteCertification = (index: number) => {
    const certTitle = data.certifications[index].title;
    removeCertification(index);
    
    toast({
      title: "Certification Removed",
      description: `${certTitle} has been removed from your certifications.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-portfolio-purple">Manage Certifications</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-portfolio-purple hover:bg-portfolio-purple/90 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <PlusCircle size={16} /> Add New Certification
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Certification</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="certTitle" className="text-right">Title</Label>
                  <Input
                    id="certTitle"
                    value={newCertification.title}
                    onChange={(e) => setNewCertification({ ...newCertification, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="certIssuer" className="text-right">Issuer</Label>
                  <Input
                    id="certIssuer"
                    value={newCertification.issuer}
                    onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="certDate" className="text-right">Date</Label>
                  <Input
                    id="certDate"
                    value={newCertification.date}
                    onChange={(e) => setNewCertification({ ...newCertification, date: e.target.value })}
                    placeholder="e.g., Jun 2023 or In Progress"
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="certCredential" className="text-right">Credential ID</Label>
                  <Input
                    id="certCredential"
                    value={newCertification.credential}
                    onChange={(e) => setNewCertification({ ...newCertification, credential: e.target.value })}
                    placeholder="e.g., ABC123XYZ or In Progress"
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="certLink" className="text-right">Verification Link</Label>
                  <div className="col-span-3 flex gap-2">
                    <Input
                      id="certLink"
                      value={newCertification.link || ""}
                      onChange={(e) => setNewCertification({ ...newCertification, link: e.target.value })}
                      placeholder="Optional verification URL"
                      className="flex-1"
                    />
                    <ExternalLink className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="certLogo" className="text-right">Logo URL</Label>
                  <div className="col-span-3 flex gap-2">
                    <Input
                      id="certLogo"
                      value={newCertification.logo}
                      onChange={(e) => setNewCertification({ ...newCertification, logo: e.target.value })}
                      placeholder="URL to issuer logo"
                      className="flex-1"
                    />
                    <Image className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleAddCertification}>Add Certification</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {data.certifications.map((certification, index) => (
                <motion.div
                  key={`${certification.title}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="p-5 flex items-start gap-4">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                      {certification.logo ? (
                        <img 
                          src={certification.logo} 
                          alt={certification.issuer}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <Award className="h-8 w-8 text-portfolio-purple" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{certification.title}</h3>
                      <p className="text-gray-700 font-medium">{certification.issuer}</p>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{certification.date}</span>
                      </div>
                      
                      {certification.credential && (
                        <p className="text-sm text-gray-500 mt-1">
                          ID: {certification.credential}
                        </p>
                      )}
                      
                      {certification.link && (
                        <a 
                          href={certification.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-portfolio-purple hover:text-portfolio-purple/80 mt-2"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Verify
                        </a>
                      )}
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-gray-100 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => handleEditCertification(index)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-gray-100 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDeleteCertification(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Certification</DialogTitle>
          </DialogHeader>
          {editingCertification && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editCertTitle" className="text-right">Title</Label>
                <Input
                  id="editCertTitle"
                  value={editingCertification.certification.title}
                  onChange={(e) => setEditingCertification({
                    ...editingCertification,
                    certification: { ...editingCertification.certification, title: e.target.value }
                  })}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editCertIssuer" className="text-right">Issuer</Label>
                <Input
                  id="editCertIssuer"
                  value={editingCertification.certification.issuer}
                  onChange={(e) => setEditingCertification({
                    ...editingCertification,
                    certification: { ...editingCertification.certification, issuer: e.target.value }
                  })}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editCertDate" className="text-right">Date</Label>
                <Input
                  id="editCertDate"
                  value={editingCertification.certification.date}
                  onChange={(e) => setEditingCertification({
                    ...editingCertification,
                    certification: { ...editingCertification.certification, date: e.target.value }
                  })}
                  placeholder="e.g., Jun 2023 or In Progress"
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editCertCredential" className="text-right">Credential ID</Label>
                <Input
                  id="editCertCredential"
                  value={editingCertification.certification.credential}
                  onChange={(e) => setEditingCertification({
                    ...editingCertification,
                    certification: { ...editingCertification.certification, credential: e.target.value }
                  })}
                  placeholder="e.g., ABC123XYZ or In Progress"
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editCertLink" className="text-right">Verification Link</Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="editCertLink"
                    value={editingCertification.certification.link || ""}
                    onChange={(e) => setEditingCertification({
                      ...editingCertification,
                      certification: { ...editingCertification.certification, link: e.target.value }
                    })}
                    placeholder="Optional verification URL"
                    className="flex-1"
                  />
                  <ExternalLink className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editCertLogo" className="text-right">Logo URL</Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="editCertLogo"
                    value={editingCertification.certification.logo}
                    onChange={(e) => setEditingCertification({
                      ...editingCertification,
                      certification: { ...editingCertification.certification, logo: e.target.value }
                    })}
                    placeholder="URL to issuer logo"
                    className="flex-1"
                  />
                  <Image className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateCertification}>Update Certification</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
