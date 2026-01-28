import { prisma } from "../prisma/prisma";

export async function GroupContributions(member_Id:number, group_id:number) 
{
    
    // find total member Deposit in group
    const deposits = await prisma.groupDeposit.groupBy({
        by: ["member_Id"],
        where:{
            group_id: group_id
        },
        _sum: {amount: true}
    });

    const Withdrawals = await prisma.groupWithdrawal.groupBy({
        by: ["member_Id"],
        where: {group_id: group_id},
        _sum:{
            amount:true
        },
    });
    return{
        deposit: deposits,
        withdrawals: Withdrawals,
        
    }
}