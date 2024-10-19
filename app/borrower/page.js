"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/borrower/Add";
import Edit from "@/components/borrower/Edit";
import Delete from "@/components/borrower/Delete";
// import Print from "@/components/borrower/Print";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { sortArray } from "@/lib/utils";



const Borrower = () => {
    const [borrowers, setBorrowers] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const data = await getDataFromFirebase("borrower");
                const sortedData = data.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));
                console.log(sortedData);
                setBorrowers(sortedData);
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
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Borrower</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>
            <div className="px-4 lg:px-6">
                <div className="p-4 overflow-auto">
                    <table className="w-full border border-gray-200">
                        <thead>
                            <tr className="w-full bg-gray-200">
                                <th className="text-center border-b border-gray-200 px-4 py-1">Name</th>
                                <th className="text-center border-b border-gray-200 px-4 py-1">Contact</th>
                                <th className="text-center border-b border-gray-200 px-4 py-1">Remarks</th>  
                                <th className="w-[95px] border-b border-gray-200 px-4 py-2">
                                    <div className="w-[90px] h-[45px] flex justify-end space-x-2 p-1 font-normal">
                                        {/* <Print data={borrowers} /> */}
                                        <Add message={messageHandler} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowers.length ? (
                                borrowers.map(borrower => (
                                    <tr className="border-b border-gray-200 hover:bg-gray-100" key={borrower.id}>  
                                        <td className="text-center py-1 px-4">{borrower.name}</td>
                                        <td className="text-center py-1 px-4">{borrower.contact}</td>
                                        <td className="text-center py-1 px-4">{borrower.remarks}</td>                                      
                                        <td className="text-center py-2">
                                            <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                                <Edit message={messageHandler} id={borrower.id} data={borrower} />
                                                <Delete message={messageHandler} id={borrower.id} data={borrower} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 px-4">
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

