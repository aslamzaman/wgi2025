"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/lc/Add";
import Edit from "@/components/lc/Edit";
import Delete from "@/components/lc/Delete";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { formatedDateDot, sortArray } from "@/lib/utils";



const Lc = () => {
    const [lcs, setLcs] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const [ lcs, unittypes ] = await Promise.all([
                    getDataFromFirebase("lc"),
                    getDataFromFirebase("unittype")
                ]);
    
    
                const joinCollection = lcs.map(lc=>{
                    return {
                       ...lc,
                       unittype : unittypes.find(unittype => unittype.id ===lc.unittypeId) || {}
                    }
                });
    
                const sortedData = joinCollection.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));
                console.log(sortedData)
                setLcs(sortedData);
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
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>
            <div className="px-4 lg:px-6">
                <div className="p-4 overflow-auto">
                    <table className="w-full border border-gray-200">
                        <thead>
                            <tr className="w-full bg-gray-200">
                                <th className="text-center border-b border-gray-200 px-4 py-1">Date</th>
                                <th className="text-center border-b border-gray-200 px-4 py-1">Lc No</th>
                                <th className="text-center border-b border-gray-200 px-4 py-1">Quantity</th>
                                <th className="text-center border-b border-gray-200 px-4 py-1">Unit Type</th>
                                <th className="text-center border-b border-gray-200 px-4 py-1">Taka</th>  
                                <th className="w-[95px] border-b border-gray-200 px-4 py-2">
                                    <div className="w-[90px] h-[45px] flex justify-end space-x-2 p-1 font-normal">
                                        {/* <Print data={lcs} /> */}
                                        <Add message={messageHandler} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {lcs.length ? (
                                lcs.map(lc => (
                                    <tr className="border-b border-gray-200 hover:bg-gray-100" key={lc.id}>  
                                        <td className="text-center py-1 px-4">{formatedDateDot(lc.dt,true)}</td>
                                        <td className="text-center py-1 px-4">{lc.lcNo}</td>
                                        <td className="text-center py-1 px-4">{lc.qty}</td>
                                        <td className="text-center py-1 px-4">{lc.unittype.name}</td>
                                        <td className="text-center py-1 px-4">{lc.taka}</td>                                      
                                        <td className="text-center py-2">
                                            <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                                <Edit message={messageHandler} id={lc.id} data={lc} />
                                                <Delete message={messageHandler} id={lc.id} data={lc} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 px-4">
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

