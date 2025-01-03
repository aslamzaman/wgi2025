"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/moneyreceipt/Add";
import Delete from "@/components/moneyreceipt/Delete";
import { jsPDF } from "jspdf";
require("@/lib/fonts/Poppins-Bold-normal");
require("@/lib/fonts/Poppins-Regular-normal");


import { formatedDate, formatedDateDot, inwordEnglish, sortArray } from "@/lib/utils";
import { getDataFromFirebase } from "@/lib/firebaseFunction";


const Moneyreceipt = () => {
    const [moneyreceipts, setMoneyreceipts] = useState([]);
    const [msg, setMsg] = useState("Data ready");
    const [waitMsg, setWaitMsg] = useState("");

    //-------- Data display year --------
    const [yr, setYr] = useState('');


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const data = await getDataFromFirebase('moneyreceipt');
                console.log(data);

                const sortedDate = data.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));
                setMoneyreceipts(sortedDate);

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



    //-------------------------------------------------------------------------
    const printHandler = (id) => {
        setWaitMsg('Please Wait...');
        setTimeout(() => {
            const receipt = moneyreceipts.find(receipt => receipt.id === id);
            console.log("receipt ", receipt);

            const doc = new jsPDF({
                orientation: "p",
                unit: "mm",
                format: "a4",
                putOnlyUsedFonts: true,
                floatPrecision: 16
            });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            doc.setFont("Poppins-Regular", "normal");
            doc.setFontSize(12);

            if (receipt.cashtypeId === "1yECAMtHPz31hACNVq3j") {
                doc.addImage("/images/moneyreceipt_cash.png", "PNG", 0, 0, pageWidth, pageHeight);
            } else {
                doc.addImage("/images/moneyreceipt_bank.png", "PNG", 0, 0, pageWidth, pageHeight);
                doc.text(`${receipt.chequeNo}`, 110, 99, null, null, "center");
                doc.text(`${formatedDateDot(receipt.chequeDt, true)}`, 170, 99, null, null, "center");
                doc.text(`${receipt.bankName}`, 105, 109, null, null, "center");
            }
            doc.text(`${formatedDateDot(receipt.dt, true)}`, 165, 70, null, null, "left");
            doc.text(`${receipt.receiveNo}`, 45, 70, null, null, "left");
            doc.text(`${receipt.receivedFrom}`, 130, 79, null, null, "center");
            const takaString = parseInt(receipt.taka).toString();
            doc.text(`${inwordEnglish(takaString).toUpperCase()}TAKA ONLY`, 105, 89, null, null, "center");
            doc.text(`${receipt.purpose}`, 95, 119, null, null, "center");
            doc.text(`${receipt.contact}`, 172, 119, null, null, "center");
            doc.text(`${parseInt(receipt.taka).toLocaleString('en-IN')}/-`, 70, 131, null, null, "right");

            doc.save(`Money_Receipt_${receipt.receiveNo}_Created_${formatedDate(new Date())}.pdf`);
            setWaitMsg('');
        }, 0);
    }



    return (
        <>
            <div className="w-full mb-3 mt-8">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Money Receipt-{yr} </h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>
            <div className="px-4 lg:px-6">
                <p className="w-full text-sm text-red-700">{msg}</p>
                <div className="p-2 overflow-auto">
                    <table className="w-full border border-gray-200">
                        <thead>
                            <tr className="w-full bg-gray-200">
                                <th className="text-center border-b border-gray-200 px-4 py-2">Date</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Receipt No</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Received From</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Taka</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Cash Type</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Bank Name</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Purpose</th>
                                <th className="w-[100px] font-normal">
                                    <div className="w-full flex justify-end py-0.5 pr-4">
                                        <Add message={messageHandler} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {moneyreceipts.length ? (
                                moneyreceipts.map(moneyreceipt => (
                                    <tr className="border-b border-gray-200 hover:bg-gray-100" key={moneyreceipt.id}>
                                        <td className="text-center py-2 px-4">{moneyreceipt.dt}</td>
                                        <td className="text-center py-2 px-4">{moneyreceipt.receiveNo}</td>
                                        <td className="text-center py-2 px-4">{moneyreceipt.receivedFrom}</td>
                                        <td className="text-center py-2 px-4">{moneyreceipt.taka}</td>
                                        <td className="text-center py-2 px-4">{moneyreceipt.cashtypeId === "1yECAMtHPz31hACNVq3j" ? "Cash" : "Cheque"}</td>
                                        <td className="text-center py-2 px-4">{moneyreceipt.bankName}</td>
                                        <td className="text-center py-2 px-4">{moneyreceipt.purpose}</td>

                                        <td className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                            <Delete message={messageHandler} id={moneyreceipt.id} data={moneyreceipt} />
                                            <button onClick={() => printHandler(moneyreceipt.id)} className="w-7 h-7 flex justify-center items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={12} className="text-center py-10 px-4">
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

export default Moneyreceipt;


