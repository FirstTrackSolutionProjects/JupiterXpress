import { useEffect, useState } from "react"


const Card = ({transaction}) => {
    const date = new Date(transaction.date)
    return (
        <>
            {transaction.type ==="recharge" && <div className='p-4 border'>
                <p>Recharge</p>
                <p>Order Id : {transaction.order_id}</p>
                <p>Amount : {transaction.amount > 0? "+"+transaction.amount :transaction.amount}</p>
                <p>{(date.toDateString())}</p>
            </div>}
            {transaction.type ==="manual" && <div className='p-4 border'>
                <p>Manual Recharge</p>
                <p>Beneficiary Id : {transaction.beneficiary_id}</p>
                <p>Order Id : {transaction.recharge_id}</p>
                <p>Amount : {transaction.amount > 0? "+"+transaction.amount :transaction.amount}</p>
                <p>Reason : {transaction.reason}</p>
                <p>{(date.toDateString())}</p>
            </div>}
        </>
    )
}



const TransactionHistory =  () => {
    const [transactions, setTransactions] = useState([])
    useEffect(() => {
        const getVerifiedtransaction = async () => {
            const recharge = await fetch('/.netlify/functions/getTransactions', {
                method: 'GET',
                headers: { 'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                }
            })
            const recharges = await recharge.json();
            const data = recharges.data
            const manual = await fetch('/.netlify/functions/getManualTransactions', {
                method: 'GET',
                headers: { 'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                }
            })
            const manuals = await manual.json();
            console.log(manuals.data)
            data.push(...manuals.data)
            
            // console.log("recharge", transactions.data)
            data.forEach(obj => {
                if (!(obj.date instanceof Date)) {
                    obj.date = new Date(obj.date);
                }
            });
            data.sort((a, b) => a.date - b.date);
            if (data.length)
                setTransactions(data)
        }
        getVerifiedtransaction();
    },[]);
  return (
    <>
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      <div className='w-full p-8 flex flex-col items-center space-y-8'>
      <div className='text-center text-3xl font-medium text-black'>Transaction History</div>
      <div className='w-full bg-white p-8'>
        {transactions.length > 0 ? (
        transactions.map(((transaction,index)=>(
            <Card key={index}  transaction={transaction}/>
        )))
      ) : (
        null
      )}
      </div>
      </div>
    </div>
    </>
  )
}

export default TransactionHistory
