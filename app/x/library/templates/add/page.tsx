'use client'

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Breadcrumb, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/context/auth-context"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  desc: z.string().min(1, "Description is required"),
  type: z.enum(["cost-group", "schedule", "todos"]),
  csvFile: z.any(),
  image: z.any(),
});

export default function AddTemplatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!user) {
      router.push('/x');
    } else {
      const userID = user.uid;
      const fetchUserName = async () => {
        const userDoc = await getDoc(doc(db, "users", userID));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name);
        }
      };
      fetchUserName();
    }
  }, [user, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      desc: "",
      type: "cost-group",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const storage = getStorage();
      
      // Validate CSV file
      const csvFile = (values.csvFile as FileList)[0];
      if (!csvFile.name.endsWith('.csv')) {
        throw new Error('Please upload a CSV file');
      }
      if (csvFile.size > 5 * 1024 * 1024) {
        throw new Error('CSV file size must be less than 5MB');
      }

      // Validate image file
      const imageFile = (values.image as FileList)[0];
      if (!imageFile.type.startsWith('image/')) {
        throw new Error('Please upload a valid image file');
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        throw new Error('Image file size must be less than 5MB');
      }

      // Upload files with metadata
      const csvFileName = `${Date.now()}_${csvFile.name}`;
      const csvRef = ref(storage, `library/csv/${csvFileName}`);
      await uploadBytes(csvRef, csvFile, {
        contentType: 'text/csv'
      });
      const csvFileURL = await getDownloadURL(csvRef);

      const imageFileName = `${Date.now()}_${imageFile.name}`;
      const imageRef = ref(storage, `library/images/${imageFileName}`);
      await uploadBytes(imageRef, imageFile, {
        contentType: imageFile.type
      });
      const imageURL = await getDownloadURL(imageRef);

      // Save to Firestore
      const templateId = Date.now().toString();
      await setDoc(doc(db, "library", templateId), {
        name: values.name,
        desc: values.desc,
        type: values.type,
        downloads: 0,
        createdAt: new Date(),
        author: userName,
        authorID: user?.uid,
        csvFileName,
        csvFileURL,
        imageFileName,
        imageURL,
        rating: 0,
      });

      router.push('/x/library/templates');
    } catch (error) {
      console.error("Error adding template:", error);
      // Show error to user
      alert(error instanceof Error ? error.message : 'An error occurred while uploading files');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col flex-1 p-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink>Library</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/x/library/templates">Templates</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Add New Template</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-2xl font-bold">Add New Template</h1>
        <Card>
          <CardHeader>
          
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cost-group">Cost Group</SelectItem>
                        <SelectItem value="schedule">Schedule</SelectItem>
                        <SelectItem value="todos">Todos</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="csvFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CSV File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files?.length) {
                            field.onChange(files);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preview Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files?.length) {
                            field.onChange(files);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading}>
                {loading ? "Adding Template..." : "Add Template"}
              </Button>
            </form>
          </Form>
        </CardContent>
        </Card>
      </div>
    </main>
  );
}
