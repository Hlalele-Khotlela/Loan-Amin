import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

type Status = "Approved" | "Rejected" | "Pending";

export const StatusBadge = ({ status }: { status: Status }) => {
  if (status === "Approved") {
    return (
      <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600/90 border-transparent text-primary-foreground capitalize">
        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
        {status}
      </Badge>
    );
  }
  if (status === "Rejected") {
    return (
      <Badge variant="destructive" className="capitalize">
        <XCircle className="mr-1.5 h-3.5 w-3.5" />
        {status}
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="capitalize text-foreground">
      <Clock className="mr-1.5 h-3.5 w-3.5" />
      {status}
    </Badge>
  );
};
