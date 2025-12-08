import { LoginForm } from "@/components/auth/login-form";

export default function UserLoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4">
      <LoginForm
        title="User Sign In"
        description="Welcome back! Please sign in to access your loan dashboard."
        redirectPath="/dashboard"
      />
    </main>
  );
}
