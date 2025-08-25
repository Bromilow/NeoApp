import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileFormData {
  displayName?: string;
  bio?: string;
  location?: string;
  phone?: string;
  heightCm?: number;
  hairColor?: string;
  eyeColor?: string;
  skinTone?: string;
  tags: string[];
}

export default function CreatorProfile() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [tagInput, setTagInput] = useState("");

  const { register, handleSubmit, setValue, watch, reset } = useForm<ProfileFormData>({
    defaultValues: {
      tags: []
    }
  });

  const watchedTags = watch("tags");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/creator/profile'],
    enabled: !!user,
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        location: profile.location || '',
        phone: profile.phone || '',
        heightCm: profile.heightCm || undefined,
        hairColor: profile.hairColor || '',
        eyeColor: profile.eyeColor || '',
        skinTone: profile.skinTone || '',
        tags: profile.tags || [],
      });
    }
  }, [profile, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      if (profile) {
        const response = await apiRequest('PUT', '/api/creator/profile', data);
        return response.json();
      } else {
        const response = await apiRequest('POST', '/api/creator/profile', data);
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/creator/profile'] });
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      setValue("tags", [...watchedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue("tags", watchedTags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-cyber-dark">
      <Sidebar userRole="creator" />
      
      <main className={`flex-1 min-h-screen ${isMobile ? 'pb-20' : 'ml-64'}`}>
        <header className="bg-cyber-surface/90 backdrop-blur-md border-b border-neon-purple/20 px-8 py-4">
          <div>
            <h2 className="text-2xl font-orbitron font-bold text-neon-purple">CREATOR PROFILE</h2>
            <p className="text-cyber-muted text-sm mt-1">Manage your professional information</p>
          </div>
        </header>
        
        <div className="p-8 max-w-4xl">
          {profileLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-cyber-surface border-neon-purple/20">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-cyber-dark/50 rounded w-1/4"></div>
                      <div className="h-10 bg-cyber-dark/50 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <Card className="bg-cyber-surface border-neon-purple/20">
                <CardHeader>
                  <CardTitle className="text-neon-purple font-orbitron">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="displayName" className="text-cyber-muted uppercase text-sm">Display Name</Label>
                      <Input
                        id="displayName"
                        {...register("displayName")}
                        className="bg-cyber-dark border-neon-purple/30 text-cyber-text focus:border-neon-cyan"
                        placeholder="Your professional name"
                        data-testid="input-display-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-cyber-muted uppercase text-sm">Location</Label>
                      <Input
                        id="location"
                        {...register("location")}
                        className="bg-cyber-dark border-neon-purple/30 text-cyber-text focus:border-neon-cyan"
                        placeholder="City, State/Country"
                        data-testid="input-location"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-cyber-muted uppercase text-sm">Phone</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      className="bg-cyber-dark border-neon-purple/30 text-cyber-text focus:border-neon-cyan"
                      placeholder="Your contact number"
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio" className="text-cyber-muted uppercase text-sm">Bio</Label>
                    <Textarea
                      id="bio"
                      {...register("bio")}
                      className="bg-cyber-dark border-neon-purple/30 text-cyber-text focus:border-neon-cyan min-h-[100px]"
                      placeholder="Tell us about yourself and your experience..."
                      data-testid="input-bio"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Physical Attributes */}
              <Card className="bg-cyber-surface border-neon-purple/20">
                <CardHeader>
                  <CardTitle className="text-neon-purple font-orbitron">Physical Attributes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="heightCm" className="text-cyber-muted uppercase text-sm">Height (cm)</Label>
                      <Input
                        id="heightCm"
                        type="number"
                        {...register("heightCm", { valueAsNumber: true })}
                        className="bg-cyber-dark border-neon-purple/30 text-cyber-text focus:border-neon-cyan"
                        placeholder="175"
                        data-testid="input-height"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hairColor" className="text-cyber-muted uppercase text-sm">Hair Color</Label>
                      <Select onValueChange={(value) => setValue("hairColor", value)}>
                        <SelectTrigger className="bg-cyber-dark border-neon-purple/30 text-cyber-text focus:border-neon-cyan" data-testid="select-hair-color">
                          <SelectValue placeholder="Select hair color" />
                        </SelectTrigger>
                        <SelectContent className="bg-cyber-surface border-neon-purple/30">
                          <SelectItem value="blonde">Blonde</SelectItem>
                          <SelectItem value="brunette">Brunette</SelectItem>
                          <SelectItem value="black">Black</SelectItem>
                          <SelectItem value="red">Red</SelectItem>
                          <SelectItem value="brown">Brown</SelectItem>
                          <SelectItem value="gray">Gray</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="eyeColor" className="text-cyber-muted uppercase text-sm">Eye Color</Label>
                      <Select onValueChange={(value) => setValue("eyeColor", value)}>
                        <SelectTrigger className="bg-cyber-dark border-neon-purple/30 text-cyber-text focus:border-neon-cyan" data-testid="select-eye-color">
                          <SelectValue placeholder="Select eye color" />
                        </SelectTrigger>
                        <SelectContent className="bg-cyber-surface border-neon-purple/30">
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="brown">Brown</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="hazel">Hazel</SelectItem>
                          <SelectItem value="gray">Gray</SelectItem>
                          <SelectItem value="amber">Amber</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="skinTone" className="text-cyber-muted uppercase text-sm">Skin Tone</Label>
                      <Select onValueChange={(value) => setValue("skinTone", value)}>
                        <SelectTrigger className="bg-cyber-dark border-neon-purple/30 text-cyber-text focus:border-neon-cyan" data-testid="select-skin-tone">
                          <SelectValue placeholder="Select skin tone" />
                        </SelectTrigger>
                        <SelectContent className="bg-cyber-surface border-neon-purple/30">
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="olive">Olive</SelectItem>
                          <SelectItem value="tan">Tan</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="bg-cyber-surface border-neon-purple/20">
                <CardHeader>
                  <CardTitle className="text-neon-purple font-orbitron">Skills & Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="bg-cyber-dark border-neon-purple/30 text-cyber-text focus:border-neon-cyan"
                      placeholder="Add a tag (e.g., fashion, portrait, commercial)"
                      data-testid="input-tag"
                    />
                    <Button 
                      type="button"
                      onClick={addTag}
                      className="bg-neon-cyan hover:bg-neon-cyan/80 text-cyber-dark"
                      data-testid="button-add-tag"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {watchedTags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-full text-sm flex items-center gap-2"
                        data-testid={`tag-${tag}`}
                      >
                        {tag}
                        <button 
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-neon-magenta"
                          data-testid={`button-remove-tag-${tag}`}
                        >
                          <i className="fas fa-times text-xs"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button 
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="px-8 py-3 bg-gradient-to-r from-neon-purple to-neon-magenta hover:from-neon-purple/80 hover:to-neon-magenta/80 text-white font-bold rounded-lg transition-all duration-300 shadow-neon-purple uppercase tracking-wide"
                  data-testid="button-save-profile"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
