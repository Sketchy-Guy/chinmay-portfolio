
import { useState } from "react";
import { usePortfolioData, SkillData } from "@/components/DataManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Edit, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function SkillsManager() {
  const { data, addSkill, removeSkill, updateSkill } = usePortfolioData();
  const { toast } = useToast();
  const [newSkill, setNewSkill] = useState<SkillData>({ name: "", category: "", level: 80 });
  const [editingSkill, setEditingSkill] = useState<{ index: number; skill: SkillData } | null>(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = Array.from(new Set(data.skills.map(skill => skill.category)));

  // Filter skills based on search term and selected category
  const filteredSkills = data.skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         skill.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? skill.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleAddSkill = () => {
    if (!newSkill.name || !newSkill.category) {
      toast({
        title: "Error",
        description: "Skill name and category are required.",
        variant: "destructive",
      });
      return;
    }
    
    addSkill(newSkill);
    setNewSkill({ name: "", category: "", level: 80 });
    setOpen(false);
    
    toast({
      title: "Skill Added",
      description: `${newSkill.name} has been added to your skills.`,
    });
  };

  const handleUpdateSkill = () => {
    if (!editingSkill) return;
    
    updateSkill(editingSkill.index, editingSkill.skill);
    setEditingSkill(null);
    setEditOpen(false);
    
    toast({
      title: "Skill Updated",
      description: `${editingSkill.skill.name} has been updated.`,
    });
  };

  const handleEditSkill = (index: number) => {
    setEditingSkill({ index, skill: { ...data.skills[index] } });
    setEditOpen(true);
  };

  const handleDeleteSkill = (index: number) => {
    const skillName = data.skills[index].name;
    removeSkill(index);
    
    toast({
      title: "Skill Removed",
      description: `${skillName} has been removed from your skills.`,
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
          <CardTitle className="text-2xl font-bold text-portfolio-purple">Manage Skills</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-portfolio-purple hover:bg-portfolio-purple/90 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <PlusCircle size={16} /> Add New Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Skill</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="skillName" className="text-right">Name</Label>
                  <Input
                    id="skillName"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="skillCategory" className="text-right">Category</Label>
                  <Input
                    id="skillCategory"
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="skillLevel" className="text-right">Level (0-100)</Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input
                      id="skillLevel"
                      type="range"
                      min="0"
                      max="100"
                      value={newSkill.level}
                      onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                    />
                    <span>{newSkill.level}%</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleAddSkill}>Add Skill</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={selectedCategory === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={`${skill.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow relative group"
                >
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                      onClick={() => handleEditSkill(index)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={() => handleDeleteSkill(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  
                  <h3 className="font-semibold text-lg">{skill.name}</h3>
                  <Badge className="mt-1 mb-2">{skill.category}</Badge>
                  
                  <div className="mt-2">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-portfolio-purple"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 mt-1">{skill.level}%</span>
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
            <DialogTitle>Edit Skill</DialogTitle>
          </DialogHeader>
          {editingSkill && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editSkillName" className="text-right">Name</Label>
                <Input
                  id="editSkillName"
                  value={editingSkill.skill.name}
                  onChange={(e) => setEditingSkill({
                    ...editingSkill,
                    skill: { ...editingSkill.skill, name: e.target.value }
                  })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editSkillCategory" className="text-right">Category</Label>
                <Input
                  id="editSkillCategory"
                  value={editingSkill.skill.category}
                  onChange={(e) => setEditingSkill({
                    ...editingSkill,
                    skill: { ...editingSkill.skill, category: e.target.value }
                  })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editSkillLevel" className="text-right">Level (0-100)</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="editSkillLevel"
                    type="range"
                    min="0"
                    max="100"
                    value={editingSkill.skill.level}
                    onChange={(e) => setEditingSkill({
                      ...editingSkill,
                      skill: { ...editingSkill.skill, level: parseInt(e.target.value) }
                    })}
                  />
                  <span>{editingSkill.skill.level}%</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateSkill}>Update Skill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
