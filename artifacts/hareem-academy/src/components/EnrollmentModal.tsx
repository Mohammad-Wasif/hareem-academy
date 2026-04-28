import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateEnrollment, useListCourses } from "@workspace/api-client-react";
import { CreateEnrollmentBody } from "@workspace/api-client-react";
import { FaWhatsapp } from "react-icons/fa";
import { CheckCircle2 } from "lucide-react";

export default function EnrollmentModal({ children, defaultCourseSlug = "" }: { children: React.ReactNode, defaultCourseSlug?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: courses = [] } = useListCourses();
  const createEnrollment = useCreateEnrollment();

  const form = useForm({
    resolver: zodResolver(CreateEnrollmentBody),
    defaultValues: {
      fullName: "",
      age: 18,
      whatsappNumber: "",
      city: "",
      country: "",
      courseSlug: defaultCourseSlug,
      notes: "",
    },
  });

  const onSubmit = (data: any) => {
    // ensure age is number
    data.age = Number(data.age);
    createEnrollment.mutate(
      { data },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        // reset success state on close after delay
        setTimeout(() => setIsSuccess(false), 500);
      }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-primary">Alhamdulillah!</h2>
              <p className="text-muted-foreground">
                Your enrollment request has been received. Our team will contact you on WhatsApp shortly to confirm your admission.
              </p>
            </div>
            <Button asChild className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-6 text-lg rounded-full mt-4">
              <a href="https://wa.me/919315118289" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <FaWhatsapp className="w-5 h-5" />
                Message Us on WhatsApp
              </a>
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-primary">Enroll Now</DialogTitle>
              <DialogDescription>
                Fill out this form to register. We will contact you on WhatsApp to complete the process.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="courseSlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Course</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.slug} value={course.slug}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="whatsappNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+91..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Your city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Your country" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Any questions or notes? (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Let us know..." {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 flex flex-col gap-3">
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-serif text-lg rounded-full"
                    disabled={createEnrollment.isPending}
                  >
                    {createEnrollment.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    By submitting, you agree to our terms. For girls and women only.
                  </p>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
