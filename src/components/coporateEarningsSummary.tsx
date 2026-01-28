import { CooporateTypes } from "@/types/CooporateTypes";
export default function CooporateSummary({ cooporate }: { cooporate: CooporateTypes| null  }) {
  return (
    <div className="grid grid-cols-5 gap-2 bg-white p-6 rounded-xl shadow mt-6">
      <div>
        <h3 className="text-gray-500">Savings Interest</h3>
        <p className="text-xl font-bold">{cooporate?.ownerSavingsEarnings}</p>
      </div>
      <div>
        <h3 className="text-gray-500">Loan Interest</h3>
        <p className="text-xl font-bold">R {Number(cooporate?.ownerLoanEarnings).toFixed(2)}</p>
      </div>

      <div>
        
        <h3 className="text-gray-500">Total Earnings</h3>
        <p className="text-xl font-bold text-green-600">
          R {Number(cooporate?.totalOwnerEarnings).toFixed(2)}
        </p>
      </div>

      <div>
        <h3 className="text-gray-500">Total Expenses</h3>
        <p className="text-xl font-bold text-yellow-600">
          R {Number(cooporate?.expenses).toFixed(2)}
        </p>
      </div>

      

      <div>
        <h3 className="text-gray-500">Profit</h3>
        <p className="text-xl font-bold text-blue-600">
          R {Number(cooporate?.profit).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
