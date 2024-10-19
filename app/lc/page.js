"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/lc/Add";
import Edit from "@/components/lc/Edit";    
import Delete from "@/components/lc/Delete";
const date_format = dt => new Date(dt).toISOString().split('T')[0];



const Lc = () => {
    const [lcs, setLcs] = useState([]);
    const [msg, setMsg] = useState("Data ready");
    const [waitMsg, setWaitMsg] = useState("");


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lc`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                // console.log(data);
                setLcs(data);
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
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">LC</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>    
            <div className="px-4 lg:px-6">
                <p className="w-full text-sm text-red-700">{msg}</p>  
                <div className="p-2 overflow-auto">  
                    <table className="w-full border border-gray-200">
                        <thead>
                            <tr className="w-full bg-gray-200">                           
                                  <th className="text-center border-b border-gray-200 px-4 py-2">Date</th>
                                  <th className="text-center border-b border-gray-200 px-4 py-2">LC No</th>
                                  <th className="text-center border-b border-gray-200 px-4 py-2">Quantity</th>
                                  <th className="text-center border-b border-gray-200 px-4 py-2">Unit</th>
                                  <th className="text-center border-b border-gray-200 px-4 py-2">Taka</th>
                                <th className="w-[100px] font-normal">
                                    <div className="w-full flex justify-end py-0.5 pr-4">
                                        <Add message={messageHandler} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {lcs.length ?(
                                lcs.map(lc => (
                                    <tr className="border-b border-gray-200 hover:bg-gray-100" key={lc._id}>                                           
                                          <td className="text-center py-2 px-4">{date_format(lc.dt)}</td>
                                          <td className="text-center py-2 px-4">{lc.lcNo}</td>
                                          <td className="text-center py-2 px-4">{lc.qty}</td>
                                          <td className="text-center py-2 px-4">{lc.unittypeId.name}</td>
                                          <td className="text-center py-2 px-4">{lc.taka}</td>
                                        <td className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                            <Edit message={messageHandler} id={lc._id} data={lcs} />
                                            <Delete message={messageHandler} id={lc._id} data={lcs} />
                                        </td>
                                    </tr>
                                ))
                            ): (
                                <tr>
                                    <td colSpan={7} className="text-center py-10 px-4">
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

export default Lc;


