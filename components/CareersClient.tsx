"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Mail } from "lucide-react";

interface JobPosition {
  id: string;
  title: string;
  type: "Full-time" | "Internship" | "Contract";
  location: string;
  experience?: string;
  duration?: string;
  description: string;
  tagColor: string;
}

interface CareersClientProps {
  position: JobPosition;
}

export default function CareersClient({ position }: CareersClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const isNewRole = position.id === "new-role";

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-black text-white hover:bg-gray-900 transition-colors group"
      >
        {isNewRole ? (
          <>
            Apply Now
            <Mail className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </>
        ) : (
          <>
            Apply Now
            <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white text-black border border-gray-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {isNewRole
                ? "Apply for a New Role"
                : `Apply for ${position.title}`}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {isNewRole
                ? "Fill out the form below to express your interest. We'll review your application and reach out if we have a suitable position."
                : "Fill out the form below to submit your application. We'll review it and get back to you soon."}
            </DialogDescription>
          </DialogHeader>
          <ApplicationForm
            position={position}
            onSuccess={() => {
              setIsModalOpen(false);
              toast({
                title: "Application Submitted! 🎉",
                description:
                  "Thank you for your interest. We'll review your application soon.",
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

interface ApplicationFormProps {
  position: JobPosition;
  onSuccess: () => void;
}

function ApplicationForm({ position, onSuccess }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    resume: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "resume" && files && files[0]) {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in your email and phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("position", position.id === "new-role" ? "new-role" : position.title);
      formDataToSend.append("positionId", position.id);
      if (formData.resume) {
        formDataToSend.append("resume", formData.resume);
      }

      const response = await fetch("/api/careers/apply", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      // Reset form
      setFormData({
        email: "",
        phone: "",
        resume: null,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="your.email@example.com"
          required
          className="bg-white border-gray-300"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+91 9876543210"
          required
          className="bg-white border-gray-300"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resume">Resume/CV (Optional)</Label>
        <Input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleInputChange}
          className="bg-white border-gray-300"
        />
        <p className="text-xs text-gray-500">
          Accepted formats: PDF, DOC, DOCX
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-black text-white hover:bg-gray-800"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Submitting...
          </div>
        ) : (
          "Submit Application"
        )}
      </Button>
    </form>
  );
}

