import React, { useState } from "react";
import { formatedDateDot, numberWithComma } from "@/lib/utils";
const date_format = dt => new Date(dt).toISOString().split('T')[0];




const Detail = ({ message, id, data }) => {
    const [borrower, setBorrower] = useState([]);
    const [loans, setLoans] = useState([]);
    const [payments, setPayments] = useState([]);
    const [balance, setBalance] = useState('0');


    const [show, setShow] = useState(false);

    const showDetailorm = async () => {
        setShow(true);
        console.log(id, data)

        setLoans(data.matchLoan);
        setPayments(data.matchPayment);
        setBalance([data.totalLoan,data.totalPayment,data.balance]);
       // console.log(data.totalLoan,data.totalPayment,data.balance);
    };


    const closeDetailForm = () => {
        setShow(false);
    };




    return (
        <>
            {show && (
                <div className="fixed inset-0 py-16 bg-black bg-opacity-30 backdrop-blur-sm z-10 overflow-auto">
                    <div className="w-11/12 mx-auto mb-10 bg-white border-2 border-gray-300 rounded-md shadow-md duration-300">
                        <div className="px-6 md:px-6 py-2 flex justify-between items-center border-b border-gray-300">
                            <h1 className="text-xl font-bold text-blue-600">Outstanding Reposts</h1>
                            <button onClick={closeDetailForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                        </div>

                        <div className="px-6 pb-6 text-black">

                            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-y-4 lg:gap-x-4">
                                <div className="w-full border-2 p-4 shadow-md rounded-md">
                                    <div className="px-4 lg:px-6 overflow-auto">
                                        <h1 className="text-xl font-bold text-blue-600">Loans</h1>
                                        <table className="w-full border border-gray-200">
                                            <thead>
                                                <tr className="w-full bg-gray-200">
                                                    <th className="text-center border-b border-gray-200 px-4 py-2">SL</th>
                                                    <th className="text-center border-b border-gray-200 px-4 py-2">Date</th>
                                                    <th className="text-end border-b border-gray-200 px-4 py-2">Taka</th>
                                                    <th className="text-center border-b border-gray-200 px-4 py-2">Remarks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    loans.length ? loans.map((loan, i) => {
                                                        return (
                                                            <tr className="border-b border-gray-200 hover:bg-gray-100" key={loan.id}>
                                                                <td className="text-center py-2 px-4">{i + 1}</td>
                                                                <td className="text-center py-2 px-4">{formatedDateDot(loan.dt, true)}</td>
                                                                <td className="text-end py-2 px-4">{numberWithComma(parseFloat(loan.taka))}/-</td>
                                                                <td className="text-center py-2 px-4">{loan.remarks}</td>
                                                            </tr>
                                                        )
                                                    })
                                                        : null
                                                }
                                                <tr className="font-bold border-b border-gray-200 hover:bg-gray-100">
                                                    <td colSpan="2" className="text-start py-2 px-4">Total</td>
                                                    <td className="text-end py-2 px-4">{numberWithComma(parseFloat(balance[0]))}/-</td>
                                                    <td className="text-center py-2 px-4"></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="w-full border-2 p-4 shadow-md rounded-md">
                                    <div className="px-4 lg:px-6 overflow-auto">
                                        <h1 className="text-xl font-bold text-blue-600">Payments</h1>
                                        <table className="w-full border border-gray-200">
                                            <thead>
                                                <tr className="w-full bg-gray-200">
                                                    <th className="text-center border-b border-gray-200 px-4 py-2">SL</th>
                                                    <th className="text-center border-b border-gray-200 px-4 py-2">Date</th>
                                                    <th className="text-end border-b border-gray-200 px-4 py-2">Taka</th>
                                                    <th className="text-center border-b border-gray-200 px-4 py-2">Remarks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    payments.length ? payments.map((payment, i) => {
                                                        return (
                                                            <tr className="border-b border-gray-200 hover:bg-gray-100" key={payment.id}>
                                                                <td className="text-center py-2 px-4">{i + 1}</td>
                                                                <td className="text-center py-2 px-4">{formatedDateDot(payment.dt,true)}</td>
                                                                <td className="text-end py-2 px-4">{numberWithComma(parseFloat(payment.taka))}/-</td>
                                                                <td className="text-center py-2 px-4">{payment.remarks}</td>
                                                            </tr>
                                                        )
                                                    })
                                                        : null
                                                }
                                                <tr className="font-bold border-b border-gray-200 hover:bg-gray-100">
                                                    <td colSpan="2" className="text-start py-2 px-4">Total</td>
                                                    <td className="text-end py-2 px-4">{numberWithComma(parseFloat(balance[1]))}/-</td>
                                                    <td className="text-center py-2 px-4"></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full border-2 mt-4 p-4 shadow-md rounded-md">
                                <h1 className="font-bold text-blue-600">Balance/Outstanding: ({numberWithComma(parseFloat(balance[0]))}-{numberWithComma(parseFloat(balance[1]))}) = {numberWithComma(parseFloat(balance[2]))}/-</h1>
                            </div>

                        </div>


                    </div >
                </div >
            )}

            <button onClick={showDetailorm} className='w-10 h-10 px-1 py-1 hover:bg-teal-300 rounded-md transition duration-500'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full p-[1px] stroke-black">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
            </button>
        </>
    )
}
export default Detail;


