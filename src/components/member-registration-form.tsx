"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod"; 
import { useRouter } from "next/navigation";
import { toast, useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";  
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";  
import {generateCode} from "@/components/passkeys";
import React from "react";
import { useState } from "react";



const formSchema = z.object({
  firstName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  phone:z.string().min(8, { message: "Please enter a valid phone number." }),
  gender: z.enum(["male", "female", "other"], {     
    required_error: "Please select a gender.",
  }),
  email: z.string().email({ message: "Please enter a valid email address." }),

});

export function MemberRegistrationForm() {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", gender: "", phone: "" });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("POST /api/members register called",);
  
  try {
    const response = await fetch('/api/memberRegister', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify(formData),
    }); 
    // const text = await response.text();
    // console.log("Response Text:", text);
    if (!response.ok) {
      //const errorText = await response.json();
    //  throw new Error(`Error ${response.status}: ${errorText}`);
    }  
    console.log("Member Registration Response:", response.status);   
     const result = await response.json();
    console.log("Member Registration Result:", result);
    toast({
      title: "Registration Successful!",
      description: `Welcome aboard, ${formData.firstName} ${formData.lastName}! Your Passcode is .`,
    });
  } catch (error) {
    console.error("Error registering member:", error);
  }
};

  
  const router = useRouter();
  const { toast } = useToast(); 

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      gender: "male",
      email: "",
      
    },
  });

  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   console.log("Member Registration Submitted:", values);
  //   toast({
  //     title: "Registration Successful!",
  //     description: `Welcome aboard, ${values.firstName} ${values.lastName}! Your Passcode is ${generateCode()}.`,
      
  //   });
  //   router.push("/admin/dashboard");
  // }
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle>Member Registration</CardTitle>
        <CardDescription>Register a new member by filling out the form below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form  {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Hlalele" {...field}
                    value={formData.firstName}
                    onChange={(e)=> setFormData({...formData, firstName: e.target.value})} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Khotlela " {...field} 
                    value={formData.lastName}
                    onChange={(e)=> setFormData({...formData, lastName: e.target.value})} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field}
                    value={formData.email}
                    onChange={(e)=> setFormData({...formData, email: e.target.value})} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />  

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Input placeholder="Male/Female/Other" {...field} 
                    value={formData.gender}
                    onChange={(e)=> setFormData({...formData, gender: e.target.value})} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

              <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="123-456-7890" {...field} 
                    value={formData.phone}
                    onChange={(e)=> setFormData({...formData, phone: e.target.value})} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}