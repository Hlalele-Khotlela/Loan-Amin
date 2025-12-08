import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Icons.logo className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to LoanView</CardTitle>
          <CardDescription className="pt-2">
            Your trusted partner in financial solutions.
            <br />
            Please select your portal to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button asChild className="flex-1" size="lg">
              <Link href="/dashboard">User Portal</Link>
            </Button>
            <Button asChild className="flex-1" variant="outline" size="lg">
              <Link href="/admin/dashboard">Admin Portal</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
