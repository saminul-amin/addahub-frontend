"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { api } from "@/app/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  MapPin,
  DollarSign,
  Users,
  Image as ImageIcon,
} from "lucide-react";
import ImageUpload from "@/components/ui/image-upload";

export default function CreateEventClient() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const image = watch("image");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role !== "host" && decoded.role !== "admin") {
        toast.error("Unauthorized", {
          description: "Only hosts can create events.",
        });
        router.push("/dashboard");
        return;
      }
      setUserId(decoded.userId);
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        organizer: userId,
        date: new Date(`${data.date}T${data.time}`),
        participants: [],
        status: "open",
      };

      const res = await api.post("/events", payload);
      if (res.data.success) {
        toast.success("Event Created!", {
          description: "Your event is now live.",
        });
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Creation Failed", {
        description: error.response?.data?.message || "Could not create event.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Event</CardTitle>
          <CardDescription>
            Fill in the details to organize your next activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Sunday Morning Hike"
                    {...register("title", { required: true })}
                  />
                  {errors.title && (
                    <span className="text-xs text-red-500">
                      Title is required
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category/Type</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("category", { required: true })}
                  >
                    <option value="">Select Category</option>
                    <option value="Social">Social</option>
                    <option value="Sports">Sports</option>
                    <option value="Outdoors">Outdoors</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Food">Food & Drink</option>
                    <option value="Arts">Arts & Culture</option>
                  </select>
                  {errors.category && (
                    <span className="text-xs text-red-500">
                      Category is required
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you'll be doing..."
                  {...register("description", { required: true })}
                />
                {errors.description && (
                  <span className="text-xs text-red-500">
                    Description is required
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register("date", { required: true })}
                  />
                  {errors.date && (
                    <span className="text-xs text-red-500">
                      Date is required
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    {...register("time", { required: true })}
                  />
                  {errors.time && (
                    <span className="text-xs text-red-500">
                      Time is required
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    className="pl-10"
                    placeholder="Address or Place Name"
                    {...register("location", { required: true })}
                  />
                </div>
                {errors.location && (
                  <span className="text-xs text-red-500">
                    Location is required
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="maxParticipants"
                      type="number"
                      min="2"
                      className="pl-10"
                      {...register("maxParticipants", {
                        required: true,
                        min: {
                          value: 2,
                          message: "Must be at least 2 participants",
                        },
                      })}
                    />
                  </div>
                  {errors.maxParticipants && (
                    <span className="text-xs text-red-500">
                      {errors.maxParticipants.message?.toString() || "Required"}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Joining Fee ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      placeholder="0"
                      className="pl-10"
                      {...register("price", {
                        required: true,
                        min: { value: 0, message: "Price cannot be negative" },
                      })}
                    />
                  </div>
                  {errors.price && (
                    <span className="text-xs text-red-500">
                      {errors.price.message?.toString() || "Required"}
                    </span>
                  )}
                </div>
                <div className="space-y-2 col-span-3 md:col-span-1">
                  <Label>Event Banner (Required)</Label>
                  <ImageUpload
                    value={image}
                    onChange={(url) => setValue("image", url)}
                  />
                  <input
                    type="hidden"
                    {...register("image", {
                      required: "Banner image is required",
                    })}
                  />
                  {errors.image && (
                    <span className="text-xs text-red-500">
                      {errors.image.message?.toString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Event..." : "Create Event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
