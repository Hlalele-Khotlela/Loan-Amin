"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePermission } from "@/hooks/usePermission";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const memberSchema = z.object({
  member_Id: z.string().min(1, { message: "Member ID is required." }),
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  gender: z.enum(["male", "female", "other"], {
    message: "Please select a valid gender.",
  }),
  phone: z
    .string()
    .min(7, { message: "Phone number must be at least 7 digits." })
    .regex(/^[0-9+\-()\s]+$/, { message: "Invalid phone number format." }),
});

type MemberFormValues = z.infer<typeof memberSchema>;

export default function CreateMemberForm() {
   const { canApproveLoans, canManageStaff, canViewSavings } = usePermission();
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      member_Id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "male",
    },
  });

  const onSubmit = async (data: MemberFormValues) => {
    try {
      const response = await fetch("/api/memberRegister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Member Created",
          description: `Member ${data.firstName} ${data.lastName} has been added successfully.`,
        });
        form.reset();
      } else {
        // ✅ Normalize error handling
        if (typeof result.error === "string") {
          if (result.error === "Email already exists.") {
            form.setError("email", {
              type: "manual",
              message: "This email is already registered.",
            });
          } else if (
            result.error.includes("Unique constraint failed") &&
            result.error.includes("member_Id")
          ) {
            form.setError("member_Id", {
              type: "manual",
              message: "This Member ID is already in use.",
            });
          } else {
            toast({
              title: "Error",
              description: result.error,
            });
          }
        } else if (Array.isArray(result.error)) {
          result.error.forEach((msg: string) => {
            if (msg.toLowerCase().includes("email")) {
              form.setError("email", { type: "manual", message: msg });
            }
            if (msg.toLowerCase().includes("member_Id")) {
              form.setError("member_Id", { type: "manual", message: msg });
            }
          });
        }
      }
    } catch (error) {
      console.error("Error creating member:", error);
      toast({
        title: "Error",
        description: "Unexpected error occurred.",
      });
    }
  };

  return (
    
    <Card className="max-w-lg mx-auto shadow-lg rounded-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-2xl font-extrabold text-blue-700 tracking-wide">
          Create Member
        </CardTitle>
        <CardDescription className="text-gray-500">
          Fill in the details to add a new member.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {canApproveLoans && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Member ID */}
            <FormField
              control={form.control}
              name="member_Id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Member ID
                  </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      {...field}
                      placeholder="Enter unique member ID"
                      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      {...field}
                      placeholder="Enter first name"
                      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      {...field}
                      placeholder="Enter last name"
                      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Email
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-400">📧</span>
                      <input
                        type="email"
                        {...field}
                        placeholder="Enter email address"
                        className="w-full pl-10 border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-400">📞</span>
                      <input
                        type="tel"
                        {...field}
                        placeholder="Enter phone number"
                        className="w-full pl-10 border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Gender
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] transition-transform duration-200"
            >
              🚀 Create Member
            </button>
          </form>
        </Form>
        )}
      </CardContent>
    </Card>
  );
}
