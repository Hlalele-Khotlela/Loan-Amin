"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const formSchema = z.object({
  loanType: z.enum(["short-term", "long-term", "emergency"], {
    required_error: "Please select a loan type.",
  }),
  amount: z.coerce.number().positive({ message: "Please enter a positive amount." }).min(100, { message: "Minimum loan amount is L100." }),
});

export function LoanApplicationForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 100,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Loan Application Submitted:", values);
    toast({
      title: "Application Submitted!",
      description: `Your application for a ${values.loanType} loan of L${values.amount} has been received.`,
    });
    router.push("/dashboard");
  }

  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">New Loan Application</CardTitle>
        </div>
        <CardDescription>
          Fill out the form below to apply for a new loan. Please select the type of loan and enter the desired amount.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="loanType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a loan type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="short-term">Short-term Loan</SelectItem>
                      <SelectItem value="long-term">Long-term Loan</SelectItem>
                      <SelectItem value="emergency">Emergency Loan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the type of loan that best suits your needs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Amount</FormLabel>
                  <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">L</span>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 5000" {...field} className="pl-10" />
                    </FormControl>
                  </div>
                   <FormDescription>
                    Specify the amount you wish to borrow. Minimum is L100.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg">Submit Application</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
