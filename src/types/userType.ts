export interface UserInfo{
    firstName: string
    lastName: string
    status: string
    email: string
    Phone: string
    member_Id:number,
}

export interface UserSavings{
    savingsType: string,
    amount: number,
    intrest:number,
    total: number,
}

export interface UserLoans{
    LoansType: string,
    amount: number,
    intrest:number,
    total: number,
}

export interface UserGroupSavings{
    GroupName:string,
    deposit: number,
    withdrawals:number,
    balance: number,
}