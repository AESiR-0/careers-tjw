"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Briefcase,
  Clock,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
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

const newRolePosition: JobPosition = {
  id: "new-role",
  title: "New Role Application",
  type: "Full-time",
  location: "TBD",
  description: "You're applying for a role that isn't currently listed.",
  tagColor: "bg-blue-500",
};

const jobPositions: JobPosition[] = [
  {
    id: "event-manager",
    title: "Event Manager",
    type: "Full-time",
    location: "Ahmedabad / Remote",
    experience: "2+ years",
    description:
      "Plan and execute amazing events. Lead event planning, coordinate with vendors, manage logistics, and ensure memorable experiences for our attendees.",
    tagColor: "bg-blue-500",
  },
  {
    id: "marketing-lead",
    title: "Marketing Lead",
    type: "Full-time",
    location: "Ahmedabad / Remote",
    experience: "3+ years",
    description:
      "Drive marketing strategy and campaigns. Create engaging content, manage social media, analyze performance metrics, and grow our brand presence.",
    tagColor: "bg-blue-500",
  },
  {
    id: "content-specialist",
    title: "Content Specialist",
    type: "Full-time",
    location: "Ahmedabad / Remote",
    experience: "1+ years",
    description:
      "Create engaging content across platforms. Write compelling copy, create social media content, manage content calendar, and maintain brand voice.",
    tagColor: "bg-blue-500",
  },
  {
    id: "operations-associate",
    title: "Operations Associate",
    type: "Full-time",
    location: "Ahmedabad (Onsite)",
    experience: "1+ years",
    description:
      "Keep everything running smoothly. Support day-to-day operations, coordinate with teams, manage documentation, and ensure efficient processes.",
    tagColor: "bg-blue-500",
  },
  {
    id: "developer",
    title: "Developer (React.js/Next.js)",
    type: "Full-time",
    location: "Ahmedabad / Remote",
    experience: "2+ years",
    description:
      "Build our platform and features. Develop responsive web applications, write clean code, collaborate with team, and maintain high code quality.",
    tagColor: "bg-blue-500",
  },
  {
    id: "sales-intern",
    title: "Inside Sales Intern",
    type: "Internship",
    location: "Ahmedabad (Onsite)",
    duration: "3-6 months",
    description:
      "Gain hands-on experience in technology sales, business development, and customer relations. Opportunity for full-time role (PPO) upon completion.",
    tagColor: "bg-yellow-500",
  },
  {
    id: "ui-designer",
    title: "UI/UX Designer",
    type: "Full-time",
    location: "Ahmedabad / Remote",
    experience: "2+ years",
    description:
      "Create beautiful user experiences. Design intuitive interfaces, create prototypes, conduct user research, and collaborate with development team.",
    tagColor: "bg-blue-500",
  },
];

function JoinUsPageContent() {
  const searchParams = useSearchParams();
  const [selectedPosition, setSelectedPosition] = useState<JobPosition | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const positionId = searchParams.get("position");
    if (positionId) {
      const position = jobPositions.find((job) => job.id === positionId);
      if (position) {
        setSelectedPosition(position);
        setIsModalOpen(true);
      }
    }
  }, [searchParams]);

  const handleApplyClick = (position: JobPosition) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
  };

  const handleNewRoleClick = () => {
    setSelectedPosition(newRolePosition);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header Section */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center">
          <img
            src="https://talaash.thejaayveeworld.com/static/logos/png%20with%20tagline%20(black)/the%20jaayvee%20world%20logo%20with%20full%20tagline-03.png"
            alt="The Jaayvee World Logo"
            className="h-20 md:h-28 mb-6 transition-all duration-300"
          />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-center">
            Join Our World
          </h1>
        </div>
      </header>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-black mb-6 leading-tight tracking-tight">
            Open Positions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Discover exciting career opportunities and join our innovative,
            design-forward team at{" "}
            <span className="font-semibold text-black">The Jaayvee World</span>.
          </p>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {jobPositions.map((position) => (
            <Card
              key={position.id}
              className="border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 rounded-xl hover:-translate-y-1"
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold">{position.title}</h3>
                  <Badge className={`${position.tagColor} text-white`}>
                    <Briefcase className="h-3 w-3 mr-1" />
                    {position.type}
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow">
                  {position.description}
                </p>

                <div className="space-y-2 text-sm text-gray-700 mb-6">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    {position.location}
                  </div>
                  {position.experience && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      {position.experience}
                    </div>
                  )}
                  {position.duration && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      {position.duration}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleApplyClick(position)}
                  className="w-full bg-black text-white hover:bg-gray-900 transition-colors"
                >
                  Apply Now
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* New Role CTA Section */}
        <div className="mt-16 mb-8">
          <Card className="border-2 border-gray-300 shadow-lg bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="p-10 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-black">
                Looking for a role that is not here?
              </h3>
              <p className="text-gray-600 mb-6 text-lg max-w-2xl mx-auto">
                We're always looking for talented individuals to join our team. 
                If you don't see a position that matches your skills, we'd still love to hear from you!
              </p>
              <Button
                onClick={handleNewRoleClick}
                className="bg-black text-white hover:bg-gray-900 transition-all duration-300 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                size="lg"
              >
                Apply Now
                <ExternalLink className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Modal */}
        {selectedPosition && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-md bg-black text-white border border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {selectedPosition.id === "new-role" 
                    ? "Apply for a New Role" 
                    : `Apply for ${selectedPosition.title}`}
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  {selectedPosition.id === "new-role"
                    ? "Fill out the form below to express your interest. We'll review your application and reach out if we have a suitable position."
                    : "Fill out the form below to submit your application. We'll review it and get back to you soon."}
                </DialogDescription>
              </DialogHeader>
              <ApplicationForm
                position={selectedPosition}
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
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} The Jaayvee World — Crafted with ambition.
      </footer>
    </div>
  );
}

export default function JoinUsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <JoinUsPageContent />
    </Suspense>
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
