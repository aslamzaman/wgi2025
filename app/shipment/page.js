"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/shipment/Add";
import Edit from "@/components/shipment/Edit";    
import Delete from "@/components/shipment/Delete";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
const date_format = dt => new Date(dt).toISOString().split('T')[0];


const Shipment = () => {
    const [shipments, setShipments] = useState([]);
    const [msg, setMsg] = useState("Data ready");
    const [waitMsg, setWaitMsg] = useState("");


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const data = await getDataFromFirebase('shipment');
                // console.log(data);
                setShipments(data);
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
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Shipment</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>    
            <div className="px-4 lg:px-6">
                <p className="w-full text-sm text-red-700">{msg}</p>  
                <div className="p-2 overflow-auto">  
                    <table className="w-full border border-gray-200">
                        <thead>
                            <tr className="w-full bg-gray-200">                           
                                  <th className="text-center border-b border-gray-200 px-4 py-2">Date</th>
                                  <th className="text-center border-b border-gray-200 px-4 py-2">Shipment</th>
                                  <th className="text-center border-b border-gray-200 px-4 py-2">LC No</th>
                                  <th className="text-center border-b border-gray-200 px-4 py-2">Supplier</th>
                                  <th className="text-center border-b border-gray-200 px-4 py-2">Item</th>
                                  <th className="text-center border-b border-gray-200 px-4 py-2">Unit</th>
                                  <th className="text-center border-b border-gray-200 px-4 py-2">Quantity</th>
                                  <th className="text-center border-b border-gray-200 px-4 py-2">Taka</th>
                                <th className="w-[100px] font-normal">
                                    <div className="w-full flex justify-end py-0.5 pr-4">
                                        <Add message={messageHandler} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipments.length ?(
                                shipments.map(shipment => (
                                    <tr className="border-b border-gray-200 hover:bg-gray-100" key={shipment._id}>                                           
                                          <td className="text-center py-2 px-4">{date_format(shipment.dt)}</td>
                                          <td className="text-center py-2 px-4">{shipment.shipmentNo}</td>
                                          <td className="text-center py-2 px-4">{shipment.lcId.lcNo}</td>
                                          <td className="text-center py-2 px-4">{shipment.supplierId.name}</td>
                                          <td className="text-center py-2 px-4">{shipment.itemId.name}</td>
                                          <td className="text-center py-2 px-4">{shipment.unittypeId.name}</td>
                                          <td className="text-center py-2 px-4">{shipment.qty}</td>
                                          <td className="text-center py-2 px-4">{shipment.taka}</td>
                                        <td className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                            <Edit message={messageHandler} id={shipment._id} data={shipments} />
                                            <Delete message={messageHandler} id={shipment._id} data={shipments} />
                                        </td>
                                    </tr>
                                ))
                            ): (
                                <tr>
                                    <td colSpan={10} className="text-center py-10 px-4">
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

export default Shipment;


