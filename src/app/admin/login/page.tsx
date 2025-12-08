import { LoginForm } from "@/components/auth/login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4">
      <LoginForm
        title="Admin Sign In"
        description="Access the administrative dashboard to manage loans."
        redirectPath="/admin/dashboard"
      />
    </main>
  );
}
