"use client";
import React, { useState, useEffect } from "react";
import Payment from "@/components/loanoutstanding/Payment";
import Detail from "@/components/loanoutstanding/Detail";
import { numberWithComma, sortArray } from "@/lib/utils";
import { getDataFromFirebase } from "@/lib/firebaseFunction";


const Borrower = () => {
    const [borrowers, setBorrowers] = useState([]);
    const [msg, setMsg] = useState("Data ready");
    const [waitMsg, setWaitMsg] = useState("");
    const [totalOutstanding, setTotalOutstanding] = useState('0');

    //-------- Data display year --------
    const [yr, setYr] = useState('');


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const [borrowerResponse, loanResponse, loanpaymentResponse] = await Promise.all([
                    getDataFromFirebase("borrower"),
                    getDataFromFirebase("loan"),
                    getDataFromFirebase("loanpayment")
                ]);
                // console.log(borrowerResponse, loanResponse);


                //------- Loan id make Unique ----------------
                const getAllBorderId = loanResponse.map(loan => loan.borrowerId);
                const newSetIds = new Set(getAllBorderId);
                const uniqueBorrowerIds = Array.from(newSetIds);



                const borrowerJoin = uniqueBorrowerIds.map(borrowerId => {
                    const matchCustomer = borrowerResponse.find(borrower => borrower.id === borrowerId);
                    const matchLoan = loanResponse.filter(loan => loan.borrowerId === borrowerId);
                    const matchPayment = loanpaymentResponse.filter(payment => payment.borrowerId === borrowerId);

                    const totalLoan = matchLoan.reduce((t, c) => t + parseFloat(c.taka), 0);
                    const totalPayment = matchPayment.reduce((t, c) => t + parseFloat(c.taka), 0);
                    return {
                        id: borrowerId,
                        matchLoan,
                        matchPayment,
                        balance: (totalLoan - totalPayment),
                        totalLoan: totalLoan,
                        totalPayment: totalPayment,
                        borrower: matchCustomer,
                        name:matchCustomer.name 
                    }
                })

                
                
                const sorted = borrowerJoin.sort((a, b) => sortArray(a.name.toUpperCase(), b.name.toUpperCase()));
                console.log("Sorted", sorted);
                const totalTaka = sorted.reduce((t, c) => t + parseFloat(c.balance), 0);
                setBorrowers(sorted);

                setTotalOutstanding(totalTaka);

               //---------- Session Storage Year ----------------
               const period = sessionStorage.getItem('yr');
               setYr(period);


                setWaitMsg('');
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getData();
    }, [msg]);


    const messageHandler = (data) => {
        setMsg(data);
    }


    return (
        <>
            <div className="w-full mb-3 mt-8">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Total Outstanding-{yr} <br />{numberWithComma(parseFloat(totalOutstanding))}/-</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>
            <div className="px-4 lg:px-6">
                <p className="w-full text-sm text-red-700">{msg}</p>
                <div className="p-2 overflow-auto">
                    <table className="w-full border border-gray-200">
                        <thead>
                            <tr className="w-full bg-gray-200">
                                <th className="text-center border-b border-gray-200 px-4 py-2">SL</th>
                                <th className="text-start border-b border-gray-200 px-4 py-2">Name</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Balance</th>
                                <th className="w-[100px]">
                                    <div className="w-full flex justify-end py-0.5 pr-4">Actions</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowers.length ? (
                                borrowers.map((borrower,i) => (
                                    <tr className="border-b border-gray-200 hover:bg-gray-100" key={borrower.id}>
                                        <td className="text-center py-2 px-4">{i+1}.</td>
                                        <td className="text-start py-2 px-4">{borrower.name}</td>
                                        <td className="text-center py-2 px-4">{numberWithComma(parseFloat(borrower.balance))}</td>
                                        <td className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                            <Payment message={messageHandler} id={borrower.id} />
                                            <Detail id={borrower.id} data={borrower} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 px-4">
                                        Data not available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

};

export default Borrower;


