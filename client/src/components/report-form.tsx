import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload, MapPin, Plus } from "lucide-react";

const reportFormSchema = z.object({
  location: z.string().min(1, "Location is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  violationType: z.enum([
    "Unauthorized Content",
    "Illegal Placement",
    "Size Violation",
    "Permit Expired"
  ]),
  description: z.string().optional(),
  userId: z.string().min(1)
});

type ReportFormData = z.infer<typeof reportFormSchema>;

export default function ReportForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      location: "",
      latitude: 0,
      longitude: 0,
      violationType: "Unauthorized Content",
      description: "",
      userId: "user-1" // In production, get from auth context
    }
  });

  const submitReport = useMutation({
    mutationFn: async (data: ReportFormData & { file: File }) => {
      const formData = new FormData();
      formData.append('image', data.file);
      formData.append('location', data.location);
      formData.append('latitude', data.latitude.toString());
      formData.append('longitude', data.longitude.toString());
      formData.append('violationType', data.violationType);
      formData.append('description', data.description || '');
      formData.append('userId', data.userId);

      const response = await fetch('/api/reports', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Your billboard compliance report has been submitted successfully."
      });
      form.reset();
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/heatmap'] });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleLocationClick = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("latitude", position.coords.latitude);
          form.setValue("longitude", position.coords.longitude);
          form.setValue("location", `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
          toast({
            title: "Location Captured",
            description: "Current location has been set automatically."
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please enter manually.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const onSubmit = (data: ReportFormData) => {
    if (!selectedFile) {
      toast({
        title: "Image Required",
        description: "Please select an image file to upload.",
        variant: "destructive"
      });
      return;
    }

    submitReport.mutate({ ...data, file: selectedFile });
  };

  return (
    <Card className="mb-8 border-border" data-testid="card-report-form">
      <CardHeader>
        <CardTitle className="text-foreground">Submit New Report</CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload billboard images and location data for compliance review
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-report-submission">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Billboard Image
                </label>
                <div
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('file-input')?.click()}
                  data-testid="dropzone-image-upload"
                >
                  <CloudUpload className="text-muted-foreground w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {selectedFile ? selectedFile.name : "Drop files here or click to upload"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    data-testid="input-file-upload"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter address or coordinates"
                            {...field}
                            data-testid="input-location"
                          />
                          <button
                            type="button"
                            onClick={handleLocationClick}
                            className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                            data-testid="button-get-location"
                          >
                            <MapPin className="w-4 h-4" />
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="violationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Violation Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-violation-type">
                            <SelectValue placeholder="Select violation type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Unauthorized Content">Unauthorized Content</SelectItem>
                          <SelectItem value="Illegal Placement">Illegal Placement</SelectItem>
                          <SelectItem value="Size Violation">Size Violation</SelectItem>
                          <SelectItem value="Permit Expired">Permit Expired</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional details about the violation"
                          rows={3}
                          {...field}
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  setSelectedFile(null);
                }}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitReport.isPending}
                data-testid="button-submit-report"
              >
                <Plus className="w-4 h-4 mr-2" />
                {submitReport.isPending ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
