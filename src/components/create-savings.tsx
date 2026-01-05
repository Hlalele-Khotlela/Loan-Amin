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

export default function SavingsRequests() {
  const formSchema = z.object({
    memberId: z.string().min(1, { message: "Please select a member." }),
    type: z.enum(["COMPULSORY", "SPECIAL", "VOLUNTARY"], {
      message: "Please select a savings type.",
    }),
    amount: z.number().min(0, { message: "Amount must be a positive number." }),
  });

  const form = useForm({
    defaultValues: {
      member_Id: "",
      type: "",
      amount: 0,
    },
  });

  const [member_Id, setMember_Id] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState(0);
  const [members, setMembers] = useState<
    Array<{ member_Id: string; firstName: string; lastName: string }>
  >([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/Savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_Id, type, amount }),
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Member Dropdown */}
            <FormField
              control={form.control}
              name="member_Id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Select Member</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      value={member_Id}
                      onChange={(e) => setMember_Id(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option key="placeholder" value="">Select a member</option>
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
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >VOLUNTARY
  
  
                      <option value="">Select Savings Type</option>
                      <option value="COMPULSARY">Compulsory</option>
                      <option value="SPEACIAL">Special</option>
                      <option value="VOLUNTARY">Voluntary</option>
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
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Savings
            </button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
