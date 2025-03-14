"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/loanpayment/Add";
import Edit from "@/components/loanpayment/Edit";
import Delete from "@/components/loanpayment/Delete";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { formatedDateDot, numberWithComma, sortArray } from "@/lib/utils";



const Loanpayment = () => {
    const [loanpayments, setLoanpayments] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");


    const [total, setTotal] = useState("");
    const [yr, setYr] = useState("");


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const [ loanpayments, borrowers ] = await Promise.all([
                    getDataFromFirebase("loanpayment"),
                    getDataFromFirebase("borrower")
                ]);
    
    
                const joinCollection = loanpayments.map(loanpayment=>{
                    return {
                       ...loanpayment,
                       borrower : borrowers.find(borrower => borrower.id ===loanpayment.borrowerId) || {}
                    }
                });
 

                const sortedData = joinCollection.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));
                console.log(sortedData);
                setLoanpayments(sortedData);

                //---------------Total Loan ------------
                const totalTaka = sortedData.reduce((t, c) => t + parseFloat(c.taka), 0);
                setTotal(totalTaka);

               //---------------Period ------------ 
               setYr(sessionStorage.getItem('yr')); 


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
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Loan Payment-{yr}</h1>
                <h1 className="w-full text-xl lg:text-2xl font-bold text-center text-gray-400">Total = {numberWithComma(parseFloat(total))}/-</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>
            <div className="px-4 lg:px-6">
                <div className="p-4 overflow-auto">
                    <table className="w-full border border-gray-200">
                        <thead>
                            <tr className="w-full bg-gray-200">
                                <th className="text-center border-b border-gray-200 px-4 py-1">BorrowerId</th>
                                <th className="text-center border-b border-gray-200 px-4 py-1">Date</th>
                                <th className="text-center border-b border-gray-200 px-4 py-1">Taka</th>
                                <th className="text-center border-b border-gray-200 px-4 py-1">Remarks</th>  
                                <th className="w-[95px] border-b border-gray-200 px-4 py-2">
                                    <div className="w-[90px] h-[45px] flex justify-end space-x-2 p-1 font-normal">
                                        {/* <Print data={loanpayments} /> */}
                                        <Add message={messageHandler} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loanpayments.length ? (
                                loanpayments.map(loanpayment => (
                                    <tr className="border-b border-gray-200 hover:bg-gray-100" key={loanpayment.id}>  
                                        <td className="text-center py-1 px-4">{loanpayment.borrower.name}</td>
                                        <td className="text-center py-1 px-4">{formatedDateDot( loanpayment.dt, true)}</td>
                                        <td className="text-center py-1 px-4">{loanpayment.taka}</td>
                                        <td className="text-center py-1 px-4">{loanpayment.remarks}</td>                                      
                                        <td className="text-center py-2">
                                            <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                                <Edit message={messageHandler} id={loanpayment.id} data={loanpayment} />
                                                <Delete message={messageHandler} id={loanpayment.id} data={loanpayment} />
                                            </div>
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

export default Loanpayment;

