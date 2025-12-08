"use client";
import { AdminNav } from '@/components/admin-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FormField } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Link } from 'lucide-react';
import { Form} from "@/components/ui/form";
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from "react-hook-form";

const formSchema = z.object({
  loanStatus: z.enum(["Reject", "Accept"], {
    required_error: "Please select a response.",
  }),
  
});
// type LoanRequestFormValues = z.infer<typeof formSchema>;

// const defaultValues: Partial<LoanRequestFormValues> = { 
//  loanStatus: "Accept",
// 
// };  

 
export default function AdminNavPage() {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      loanStatus: "Accept",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Loan Request Response Submitted:", values);

    toast({
      title: "Response Submitted!",
      description: `You have ${values.loanStatus}ed the loan request.`,
    });
    router.push("/admin/dashboard");
  }

  return (
<div className='flex gap-2'>
    <AdminNav />

    <Card className="shadow-lg flex-auto">
      <CardHeader>
        <CardTitle>Loan Requests</CardTitle>
        <CardDescription>These are the current loan requests.</CardDescription>
      </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">


            <table className="w-full">
                
                <thead>
                    <tr className="text-left border-b">
                        <th className="py-2">Applicant</th>
                        <th className="py-2">Amount</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Action</th>
                        <th className="py-2">Ongoing Loan</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b">
                        <td className="py-2">John Doe</td>
                        <td className="py-2">L5000</td>
                        <td className="py-2">Pending</td>
                        <td className="py-2">
                            
                            <FormField
                                control={form.control}
                                name="loanStatus"
                                render={({ field }) => (
                                    <select
                                        {...field}>
                                        <option value="Accept" className='text-green-600 hover:underline mr-4'>Approve</option>
                                         <option value="Reject" className='text-red-600 hover:underline mr-4'>Reject</option>
                                        <option value="" disabled className='text-red-600 hover:underline mr-4'>Select</option> 
                                    </select>

                                 
                                )}
                            />
                        </td>
                        <td className="py-2">L 5000</td>

                        
                    </tr>
                    <tr className="border-b">
                        <td className="py-2">Jane Smith</td>
                        <td className="py-2">L3000</td>
                        <td className="py-2">Pending</td>
                        
                         <td className="py-2">
                            
                            <FormField
                                control={form.control}
                                name="loanStatus"
                                render={({ field }) => (
                                    <select
                                        {...field}>
                                        <option value="Accept" className='text-green-600 hover:underline mr-4'>Approve</option>
                                        <option value="Reject" className='text-red-600 hover:underline mr-4'>Reject</option>
                                        <option value="" disabled className='text-red-600 hover:underline mr-4'>Select</option>
                                    </select>
                                )}
                            />
                        </td>
                        <td className="py-2">L 6000</td>
                            
                        
                        
                    </tr>
                    {/* More rows as needed */}
                </tbody>
                
            </table>
            <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Save Changes
            </button>
            </form>
            </Form>
            </CardContent>
     
    </Card> 

  

</div>
  );
}