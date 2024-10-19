"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/supplier/Add";
import Edit from "@/components/supplier/Edit";
import Delete from "@/components/supplier/Delete";
// import Print from "@/components/supplier/Print";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { sortArray } from "@/lib/utils";



const Supplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const data = await getDataFromFirebase("supplier");
                const sortedData = data.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));
                console.log(sortedData);
                setSuppliers(sortedData);
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
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Supplier</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>
            <div className="px-4 lg:px-6">
                <div className="p-4 overflow-auto">
                    <table className="w-full border border-gray-200">
                        <thead>
                            <tr className="w-full bg-gray-200">
                                <th className="text-center border-b border-gray-200 px-4 py-1">Name</th>
                                <th className="text-center border-b border-gray-200 px-4 py-1">Address</th>
                                <th className="text-center border-b border-gray-200 px-4 py-1">Contact</th>  
                                <th className="w-[95px] border-b border-gray-200 px-4 py-2">
                                    <div className="w-[90px] h-[45px] flex justify-end space-x-2 p-1 font-normal">
                                        {/* <Print data={suppliers} /> */}
                                        <Add message={messageHandler} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.length ? (
                                suppliers.map(supplier => (
                                    <tr className="border-b border-gray-200 hover:bg-gray-100" key={supplier.id}>  
                                        <td className="text-center py-1 px-4">{supplier.name}</td>
                                        <td className="text-center py-1 px-4">{supplier.address}</td>
                                        <td className="text-center py-1 px-4">{supplier.contact}</td>                                      
                                        <td className="text-center py-2">
                                            <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                                <Edit message={messageHandler} id={supplier.id} data={supplier} />
                                                <Delete message={messageHandler} id={supplier.id} data={supplier} />
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

export default Supplier;

