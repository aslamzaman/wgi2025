"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/invoice/Add";
import Delete from "@/components/invoice/Delete";
import jsPDF from "jspdf";
import { filterDataInPeriod, formatedDate, formatedDateDot, inwordEnglish, sortArray } from "@/lib/utils";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
require("@/lib/fonts/Poppins-Bold-normal");
require("@/lib/fonts/Poppins-Regular-normal");



const Invoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [msg, setMsg] = useState("Data ready");
    const [waitMsg, setWaitMsg] = useState("");

    //-------- Data display year --------
    const [yr, setYr] = useState('');


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const [responseInvoice, responseCustomer] = await Promise.all([
                    getDataFromFirebase('invoice'),
                    getDataFromFirebase('customer')
                ]);

              // console.log("Invoice ", responseInvoice) 
                const joinWithCustomer = responseInvoice.map(invoice => {
                    const matchCustomer = responseCustomer.find(customer => customer.id === invoice.customerId);
                    return {
                        ...invoice,
                        matchCustomer
                    }
                })

               // periodic data ------------------
               const getDataInPeriod = filterDataInPeriod(joinWithCustomer);

                const sorted = getDataInPeriod.sort((a, b)=> sortArray(new Date(b.createdAt),new Date(a.createdAt)));

                console.log("join table", sorted);
                setInvoices(sorted);

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
    //---------------------------------------------------------

    const printHandler = (id) => {
        setWaitMsg('Please Wait...');


        setTimeout(() => {
            const invoice = invoices.find(invoice => invoice.id === id);
            //    console.log(invoice);

            const doc = new jsPDF({
                orientation: "p",
                unit: "mm",
                format: "a4",
                putOnlyUsedFonts: true,
                floatPrecision: 16
            });

            doc.setFont("Poppins-Bold", "bold");
            doc.setFontSize(16);

            doc.text(`BILL/INVOICE`, 105, 55, null, null, "center");
            doc.setFont("Poppins-Regular", "normal");
            doc.setFontSize(10);

            doc.text(`Invoice No: ${invoice.invoiceNumber}`, 190, 65, null, null, "right");
            doc.text(`Shipment No: ${invoice.shipment}`, 190, 70, null, null, "right");
            doc.text(`Invoice Date: ${formatedDateDot(invoice.dt, true)}`, 190, 75, null, null, "right");

            doc.setFont("Poppins-Bold", "bold");
            doc.text(`${invoice.matchCustomer.name}`, 20, 80, null, null, "left");
            doc.setFont("Poppins-Regular", "normal");
            doc.text(`${invoice.matchCustomer.address}`, 20, 85, null, null, "left");
            doc.text(`${invoice.matchCustomer.contact}`, 20, 90, null, null, "left");
            doc.setFontSize(7);
            doc.text(`Print Data: ${formatedDateDot(new Date(),true)}`, 190, 92, null, null, "right");
            doc.setFontSize(10);

            doc.line(20, 95, 190, 95);
            doc.line(20, 103, 190, 103);
            doc.setFont("Poppins-Bold", "bold");
            doc.text("Items", 23, 100, null, null, "left");
            doc.text("CRT", 87, 100, null, null, "center");
            doc.text("THN", 105, 100, null, null, "center");
            doc.text("MTR", 123, 100, null, null, "center");
            doc.text("WGT", 141, 100, null, null, "center");
            doc.text("Rate", 159, 100, null, null, "center");
            doc.text("Total", 187, 100, null, null, "right");
            doc.setFont("Poppins-Regular", "normal");
            let y = 108;
            let subTotal = 0;
            let items = invoice.items;
            for (let i = 0; i < items.length; i++) {
                const total = parseFloat(items[i].weight) * parseFloat(items[i].taka);
                subTotal = subTotal + total;


                doc.text(`${items[i].itemName}`, 23, y, null, null, "left");
                doc.text(`${items[i].bale}`, 87, y, null, null, "center");
                doc.text(`${items[i].than}`, 105, y, null, null, "center");
                doc.text(`${items[i].meter}`, 123, y, null, null, "center");
                doc.text(`${items[i].weight}`, 141, y, null, null, "center");
                doc.text(`${items[i].taka}`, 159, y, null, null, "center");
                doc.text(`${total.toLocaleString("en-IN")}`, 187, y, null, null, "right");
                y = y + 5;
            }

            doc.line(20, y - 3.5, 190, y - 3.5); // Horizontal line
            // Subtotal 
            doc.text("Subtotal", 23, y, null, null, "left");
            doc.text(`${subTotal.toLocaleString("en-IN")}`, 187, y, null, null, "right");

            // Deduct
            doc.text("Deduct", 23, y + 5, null, null, "left");
            doc.text(`${parseInt(invoice.deduct).toLocaleString("en-IN")}`, 187, y + 5, null, null, "right");

            // Advance
            doc.text("Advance Payment", 23, y + 10, null, null, "left");
            doc.text(`${parseInt(invoice.payment).toLocaleString("en-IN")}`, 187, y + 10, null, null, "right");

            doc.line(20, y + 11.5, 190, y + 11.5); // Horizontal line

            // Amount to be pay
            doc.setFont("Poppins-Bold", "bold");
            doc.text("Amount to pay", 23, y + 15, null, null, "left");
            const gt = subTotal - (parseFloat(invoice.deduct) + parseFloat(invoice.payment));
            doc.text(`${gt.toLocaleString("en-IN")}`, 187, y + 15, null, null, "right");
            doc.line(20, y + 16.5, 190, y + 16.5); // Horizontal line


            doc.setFont("Poppins-Regular", "normal");
            if (gt > 0) {
                const tkString = parseInt(gt).toString();
                doc.text(`INWORD: ${inwordEnglish(tkString).toUpperCase()} ONLY.`, 20, y + 22, null, null, "left");
            }

            doc.setFontSize(8);
            doc.text("Thank you for your kind cooperation.", 20, y + 35, null, null, "left");

            doc.line(20, 95, 20, y + 16.5); // Vertical Line
            doc.line(190, 95, 190, y + 16.5); // Vertical Line


            doc.line(78, 95, 78, y - 3.5); // Vertical Line
            doc.line(96, 95, 96, y - 3.5); // Vertical Line
            doc.line(114, 95, 114, y - 3.5); // Vertical Line
            doc.line(132, 95, 132, y - 3.5); // Vertical Line
            doc.line(150, 95, 150, y - 3.5); // Vertical Line
            doc.line(168, 95, 168, y - 3.5); // Vertical Line

            doc.save(`WGI_Invoice_${invoice.invoiceNo}_Created_${formatedDate(invoice.dt)}.pdf`);
            setWaitMsg('');
        }, 0);

    }



    return (
        <>
            <div className="w-full mb-3 mt-8">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Bill/ INVOICE-{yr}</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>
            <div className="px-4 lg:px-6">
                <p className="w-full text-sm text-red-700">{msg}</p>
                <div className="p-2 overflow-auto">
                    <table className="w-full border border-gray-200">
                        <thead>
                            <tr className="w-full bg-gray-200">
                                <th className="text-center border-b border-gray-200 px-4 py-2">Invoice</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Customer</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Date</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Shipment</th>

                                <th className="w-[100px] font-normal">
                                    <div className="w-full flex justify-end py-0.5 pr-4">
                                        <Add message={messageHandler} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.length ? (
                                invoices.map(invoice => (
                                    <tr className="border-b border-gray-200 hover:bg-gray-100" key={invoice.id}>
                                        <td className="text-center py-2 px-4">{invoice.invoiceNumber}</td>
                                        <td className="text-center py-2 px-4">{invoice.matchCustomer.name}</td>
                                        <td className="text-center py-2 px-4">{formatedDateDot(invoice.dt, true)}</td>
                                        <td className="text-center py-2 px-4">{invoice.shipment}</td>
                                        <td className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                            <button onClick={() => printHandler(invoice.id)} className="w-7 h-7 flex justify-center items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                                                </svg>
                                            </button>
                                            <Delete message={messageHandler} id={invoice.id} data={invoice} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="text-center py-10 px-4">
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

export default Invoice;


