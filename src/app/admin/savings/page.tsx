import { prisma } from "../../../lib/prisma/prisma";
import CreateSavingsForm from "@/components/create-savings";

export default async function NewSavingsPage() {
  // Fetch members from DB
 

  return (
    <div className="p-6">
      
      <CreateSavingsForm />
    </div>
  );
}
