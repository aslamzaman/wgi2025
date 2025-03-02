"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/due/Add";
import { filterDataInPeriod, formatedDate, formatedDateDot, numberWithComma, sortArray } from "@/lib/utils";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { useRouter } from "next/navigation";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { dataDues } from "@/helpers/dueHelpers";


const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [msg, setMsg] = useState("Data ready");
    const [waitMsg, setWaitMsg] = useState("");

    const [totalDue, setTotalDue] = useState('0');
    const [yr, setYr] = useState("");

    const router = useRouter();


    useEffect(() => {
        const dueData = async () => {
            const data = await dataDues(false);
            setCustomers(data.sortResult);
            setTotalDue(data.totalTaka);
            setYr(data.yrs);
            console.log(data);
        }
        dueData();
    }, [msg]);



    const messageHandler = (data) => {
        setMsg(data);
    }


    const gotToPrintPage = (data) => {
        localStorage.setItem('customerData', JSON.stringify(data));
        router.push('/dueprint');
    }


    const printAllData = () => {
        const customerFilterData = customers.filter(customer => customer.balance > 0);

        const threeColumn = customerFilterData.map((customer, i) => {
            return {
                sl: i + 1,
                name: customer.name,
                balance: customer.balance
            }
        })
        const totalTK = threeColumn.reduce((t, c) => t + parseFloat(c.balance), 0);
        const data = [...threeColumn, { sl: "", name: "Total", balance: totalTK }]
        console.log({ data });

        const doc = new jsPDF();

        doc.autoTable({
            theme: 'grid',
            columnStyles: {
                0: { halign: 'center', cellWidth: 10 },
                2: { halign: 'right', cellWidth: 30 }
            },
            startY: 40, // Start position of the table
            tableWidth: 'auto',
            margin: { top: 20, botton: 20 },
            head: [[
                { content: 'SL', styles: { halign: 'center' } },
                { content: 'Customer', styles: { halign: 'left' } },
                { content: 'Dues', styles: { halign: 'right' } }
            ]], // Table headers
            body: data.map(row => [row.sl, row.name, numberWithComma(row.balance, true)]), // Table data
        });
        // Save the PDF
        const numOfPages = doc.internal.getNumberOfPages();
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(10);
        for (let i = 1; i <= numOfPages; i++) {
            doc.setPage(i);
            doc.text(`Page ${i}  of ${numOfPages}`, 15, pageHeight - 10);
        }


        doc.setPage(1);
        doc.setFontSize(18);
        doc.text("Customer Dues", 105, 20, "center");
        doc.setFontSize(10);
        doc.text(`Period: ${formatedDateDot(dt1, true)} to ${formatedDateDot(dt2, true)}`, 105, 27, "center");
        doc.text(`Print Date: ${formatedDateDot(new Date(), true)}`, 195, 37, "right");

        doc.save('database_information.pdf');
    }


    const sortByName = async () => {
        const data = await dataDues(true);

        setCustomers(data.sortResult);
        setTotalDue(data.totalTaka);
        setYr(data.yrs);
    }

    const sortByDues = async () => {
        const data = await dataDues(false);

        setCustomers(data.sortResult);
        setTotalDue(data.totalTaka);
        setYr(data.yrs);
    }



    return (
        <>
            <div className="w-full mb-3 mt-8">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Customer Dues-{yr}</h1>
                <h1 className="w-full text-xl lg:text-2xl font-bold text-center text-gray-400">Total = {numberWithComma(parseFloat(totalDue))}/-</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>
  
            <div className="px-4 lg:px-6 overflow-auto">
                <p className="w-full text-sm text-red-700">{msg}</p>
                <div className="flex justify-end items-center space-x-2 mb-2">
                    <button onClick={sortByName} className="text-center mx-0.5 px-4 py-2 bg-green-600 hover:bg-green-800 text-white font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300  cursor-pointer">Sort By Name</button>
                    <button onClick={sortByDues} className="text-center mx-0.5 px-4 py-2 bg-violet-600 hover:bg-violet-800 text-white font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300  cursor-pointer">Sort By Dues</button>
                    <button onClick={printAllData} className="text-center mx-0.5 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300  cursor-pointer">Print All</button>
                </div>
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-start border-b border-gray-200 px-4 py-2">Name</th>
                            <th className="text-center border-b border-gray-200 px-4 py-2">Dues</th>
                            <th>

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length ? (
                            customers.map((customer, i) => (
                                <tr className={`border-b border-gray-200 hover:bg-gray-100 ${customer.isDues ? 'text-red-800' : 'text-black'}`} key={customer.id}>
                                    <td className="text-start py-2 px-4">
                                        <span className="font-bold">{i + 1}. {customer.name}</span><br />
                                        {customer.address}<br />
                                        {customer.contact}
                                    </td>
                                    <td className="text-center py-2 px-4">{numberWithComma(parseFloat(customer.balance))}/-</td>
                                    <td className="text-end py-2 px-4">
                                        <div className="flex justify-end space-x-3">
                                            <button title="Details" onClick={() => gotToPrintPage(customer)} className={`w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md ring-1 ring-gray-300`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full p-[1px] stroke-black">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                </svg>
                                            </button>
                                            <Add message={messageHandler} id={customer.id} />
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
        </>
    );

};

export default Customer;


