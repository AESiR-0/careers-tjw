import { Metadata } from 'next';
import { Briefcase, MapPin, Clock, Users, ArrowRight, Sparkles, Zap, Target, TrendingUp, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CareersClient from '@/components/CareersClient';

export const metadata: Metadata = {
  title: 'Careers - Join Our Team | The Jaayvee World',
  description: 'Discover exciting career opportunities at The Jaayvee World. Join our innovative, design-forward team and help shape the future of events and community building.',
  openGraph: {
    title: 'Careers - Join Our Team | The Jaayvee World',
    description: 'Discover exciting career opportunities at The Jaayvee World.',
    type: 'website',
  },
};

interface JobPosition {
  id: string;
  title: string;
  type: 'Full-time' | 'Internship' | 'Contract';
  location: string;
  experience?: string;
  duration?: string;
  description: string;
  tagColor: string;
}

// Fetch careers data on the server
async function getCareers(): Promise<JobPosition[]> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://talaash.thejaayveeworld.com';
    const apiUrl = `${API_BASE_URL}/api/careers?activeOnly=true`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Revalidate every 60 seconds
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('Failed to fetch careers:', response.status);
      return [];
    }

    const result = await response.json();

    if (result.success && result.data && Array.isArray(result.data)) {
      return result.data.map((career: any) => ({
        id: career.id,
        title: career.title,
        type: career.type as 'Full-time' | 'Internship' | 'Contract',
        location: career.location,
        experience: career.experience || undefined,
        duration: career.duration || undefined,
        description: career.description,
        tagColor: career.tagColor || 'bg-blue-500',
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching careers:', error);
    return [];
  }
}

export default async function CareersPage() {
  const jobPositions = await getCareers();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time':
        return 'bg-blue-500';
      case 'Internship':
        return 'bg-green-500';
      case 'Contract':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <img
                src="https://www.thejaayveeworld.com/static/logo(icon)%20white/jaayvee%20world%20icon-03.png"
                alt="The Jaayvee World Logo"
                className="h-16 md:h-24 mx-auto mb-6 transition-all duration-300 hover:scale-105"
              />
            </div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium">Join Our World</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              Build Your Career With Us
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover exciting opportunities to grow, innovate, and make an impact in the world of events and community building
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Users className="h-4 w-4" />
                <span>{jobPositions.length} Open Positions</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <MapPin className="h-4 w-4" />
                <span>Multiple Locations</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Zap className="h-4 w-4" />
                <span>Fast-Growing Team</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
              Why Join The Jaayvee World?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're building something special, and we want you to be part of it
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Target,
                title: 'Impact',
                description: 'Work on projects that shape the future of events and community building',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: TrendingUp,
                title: 'Growth',
                description: 'Continuous learning opportunities and career advancement paths',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: Users,
                title: 'Culture',
                description: 'Collaborative environment with passionate, creative team members',
                color: 'from-green-500 to-emerald-500',
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-black mb-4 tracking-tight">
                Open Positions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {jobPositions.length === 0 
                  ? "We don't have any open positions at the moment, but we're always looking for talented people!"
                  : `Discover ${jobPositions.length} ${jobPositions.length === 1 ? 'exciting opportunity' : 'exciting opportunities'} to join our team`}
              </p>
            </div>

            {jobPositions.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-300 max-w-2xl mx-auto">
                <CardContent className="py-16 text-center">
                  <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Open Positions</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    We don't have any open positions at the moment, but we're always looking for talented people!
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Check back soon or follow us on social media for updates.
                  </p>
                  <Link href="mailto:careers@thejaayveeworld.com">
                    <Button size="lg" className="bg-black text-white hover:bg-gray-900">
                      <Mail className="mr-2 h-5 w-5" />
                      Send Us Your Resume
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {jobPositions.map((position) => (
                  <Card
                    key={position.id}
                    className="border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 rounded-xl hover:-translate-y-1 group"
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex-1 pr-2">
                          {position.title}
                        </h3>
                        <Badge className={`${getTypeColor(position.type)} text-white shrink-0`}>
                          <Briefcase className="h-3 w-3 mr-1" />
                          {position.type}
                        </Badge>
                      </div>

                      <p className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow line-clamp-3">
                        {position.description}
                      </p>

                      <div className="space-y-2 text-sm text-gray-700 mb-6">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                          <span className="truncate">{position.location}</span>
                        </div>
                        {position.experience && (
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                            <span>{position.experience}</span>
                          </div>
                        )}
                        {position.duration && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                            <span>{position.duration}</span>
                          </div>
                        )}
                      </div>

                      <CareersClient position={position} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* New Role CTA Section */}
            <Card className="border-2 border-gray-300 shadow-lg bg-gradient-to-br from-gray-50 to-white max-w-4xl mx-auto">
              <CardContent className="p-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-6">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-4 text-black tracking-tight">
                  Looking for a role that is not here?
                </h3>
                <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
                  We're always looking for talented individuals to join our team. 
                  If you don't see a position that matches your skills, we'd still love to hear from you!
                </p>
                <CareersClient position={{
                  id: 'new-role',
                  title: 'New Role Application',
                  type: 'Full-time',
                  location: 'TBD',
                  description: "You're applying for a role that isn't currently listed.",
                  tagColor: 'bg-blue-500',
                }} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} The Jaayvee World — Crafted with ambition.
          </p>
        </div>
      </footer>
    </div>
  );
}
