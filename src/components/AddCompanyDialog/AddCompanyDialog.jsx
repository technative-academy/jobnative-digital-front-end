import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCreateCompany } from "../../hooks/useCreateCompany";

function AddCompanyDialog({ open, onOpenChange }) {
  const createCompany = useCreateCompany();
  const [industry, setIndustry] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const newCompany = {
      name: formData.get("name"),
      website: formData.get("website"),
      linkedin: formData.get("linkedin"),
      technologies: formData.get("technologies"),
      industry: formData.get("industry"),
      description: formData.get("description"),
    };

    try {
      await createCompany(newCompany);
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to create company", err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Company</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Company Name</Label>
            <Input id="name" name="name" placeholder="Company name" />
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" placeholder="https://..." />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              name="linkedin"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <Label htmlFor="industry">Industry</Label>
            <select
              id="industry"
              name="industry"
              className="w-full border rounded-md p-2"
            >
              <option value="">Select industry</option>
              <option value="Fintech">Fintech</option>
              <option value="Health">Health</option>
              <option value="AI">AI</option>
              <option value="Ecommerce">Ecommerce</option>
            </select>
          </div>

          <div>
            <Label htmlFor="technologies">Technologies</Label>
            <select
              id="technologies"
              name="technologies"
              className="w-full border rounded-md p-2"
            >
              <option value="">Select technologies</option>
              <option value="React">React</option>
              <option value="Node.js">Node.js</option>
              <option value="AI">AI</option>
              <option value="JavaScript">JavaScript</option>
            </select>
          </div>
          {/* Job roles */}
          <div>
            <Label htmlFor="jobroles">Job Roles</Label>
            <Input
              id="jobroles"
              name="jobroles"
              placeholder="Frontend, Backend, UX..."
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Company description"
            />
          </div>

          <DialogFooter>
            <Button type="submit">Add Company</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddCompanyDialog;
