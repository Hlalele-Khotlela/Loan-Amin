"use client";

import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// enum SavingsType 
enum SAVINGSTYPE {
  COMPULSORY = "COMPULSORY",
  SPECIAL = "SPEACIAL",
  VOLUNTARY = "VOLUNTARY",
  PENSION = "PENSION",
  SECURITY = "SECURITY",
}
// ✅ Schema with custom rule
const formSchema = z
  .object({
    memberId: z.string().min(1, { message: "Please select a member." }),
    type: z.nativeEnum(SAVINGSTYPE),    
    amount: z.number().min(0, { message: "Amount must be a positive number." }),
    min_amount: z
      .number()
      .min(0, { message: "Minimum amount must be a positive number." }),
  })
  .superRefine((data, ctx) => {
    if (
      (data.type === "SECURITY" || data.type === "PENSION") &&
      data.min_amount < 50
    ) {
      ctx.addIssue({
        path: ["min_amount"], // ✅ must match schema field name
        code: z.ZodIssueCode.custom,
        message: `For ${data.type} savings, amount must be at least M50.`,
      });
    }
  });

export default function SavingsRequests() {
  const [members, setMembers] = useState<
    Array<{ member_Id: string; firstName: string; lastName: string }>
  >([]);

  // ✅ Hook form with Zod resolver
  type FormValues = z.infer<typeof formSchema>;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      memberId: "",
      type: SAVINGSTYPE.COMPULSORY,
      amount: 0,
      min_amount: 0,
    },
  });

  // ✅ Submit handler uses form.handleSubmit
  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/Savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Savings Created",
          description: "Your savings request has been submitted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit savings request.",
        });
      }
    } catch (error) {
      console.error("Error submitting savings request:", error);
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/Member");
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();
  }, []);

  return (
    <Card className="max-w-lg mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Create Savings</CardTitle>
        <CardDescription>Fill the form to create savings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Member Dropdown */}
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Select Member</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a member</option>
                      {members.map((member) => (
                        <option key={member.member_Id} value={member.member_Id}>
                          {member.firstName} {member.lastName}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Savings Type Dropdown */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Savings Type</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Savings Type</option>
                      <option value="COMPULSORY">Compulsory</option>
                      <option value="SPECIAL">Special</option>
                      <option value="VOLUNTARY">Voluntary</option>
                      <option value="PENSION">Pension</option>
                      <option value="SECURITY">Security</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />  
            {/* Amount Input */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Amount</FormLabel>
                  <FormControl>
                    <input
                      type="number"
                      
                      {...field}
                      onChange={(e)=> field.onChange(e.target.valueAsNumber)}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />    
            {/* Minimum Amount Input */}
            <FormField
              control={form.control}
              name="min_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Minimum Amount</FormLabel>
                  <FormControl>
                    <input
                      type="number"
                      {...field}
                      onChange={(e)=> field.onChange(e.target.valueAsNumber)}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />          <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Savings
            </button> 
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}