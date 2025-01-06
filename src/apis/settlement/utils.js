export function calculate_fee(rate, amount){
return Number(rate) * Number(amount)
}

export function calculate_settlement_amount(amount, fee){
    return  Number(amount) - Number(fee)
}