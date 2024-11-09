"use client";
import React, { useState, useEffect } from "react";
import { formatedDate, formatedDateDot, numberWithComma, sortArray } from "@/lib/utils";

require("@/lib/fonts/Poppins-Bold-normal");
require("@/lib/fonts/Poppins-Regular-normal");
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import jsPDF from "jspdf";



const Salereport = () => {
    const [msg, setMsg] = useState("Data ready");
    const [waitMsg, setWaitMsg] = useState("");

    const [sales, setSales] = useState([]);
    const [totalTaka, setTotalTaka] = useState([]);

    //-------- Data display year --------
    const [yr, setYr] = useState('');

    const [dt1, setDt1] = useState("");
    const [dt2, setDt2] = useState("");




    useEffect(() => {
        const loadData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const [sales, customers, items] = await Promise.all([
                    getDataFromFirebase('sale'),
                    getDataFromFirebase('customer'),
                    getDataFromFirebase('item')
                ]);
                console.log({ sales, customers, items });

                const result = sales.map(sale => {
                    const matchCustomer = customers.find(customer => customer.id === sale.customerId);
                    const matchItem = items.find(item => item.id === sale.itemId);
                    const total = parseFloat(sale.weight) * parseFloat(sale.rate);
                    return {
                        ...sale,
                        customer: matchCustomer.name,
                        item: matchItem.name,
                        matchCustomer, matchItem,
                        total
                    };
                });

                const sortData = result.sort((a, b) => sortArray(new Date(a.createdAt), new Date(b.createdAt)));

                console.log(sortData);
                setSales(sortData);

                //---------- Session Storage Year ----------------
                const period = sessionStorage.getItem('yr');
                setYr(period);
                //--------------------------------------------
                const gt = sortData.reduce((t, c) => t + parseFloat(c.total), 0);
                console.log({ gt, sortData })
                setTotalTaka(gt);



                setWaitMsg('');
            } catch (error) {
                console.error("Error fetching data:", error);
                setMsg("Failed to fetch data");
            }
        }
        loadData();

        setDt1('2024-05-01');
        setDt2(formatedDate(new Date()));
    }, [msg]);




    const searchClickHandler = () => {
        const d1 = new Date(dt1);
        const d2 = new Date(dt2);

        // search customer in date ranges
        const searchSale = sales.filter(sale => {
            const dataDate = new Date(sale.createdAt);
            return dataDate >= d1 && dataDate <= d2;
        })


        setSales(searchSale);
        const total = searchSale.reduce((t, c) => t + parseFloat(c.total), 0);
        setTotalTaka(total);

    }

    const refreshClickHandler = () => {
        setMsg(`Refresh at: ${Date.now()}`);
    }


    const msgHandler = (data) => {
        console.log("Print" + data);
    }


    const printMultiplePageHandler = async () => {
        const doc = new jsPDF({
            orientation: "p",
            unit: "mm",
            format: "a4",
            putOnlyUsedFonts: true,
            floatPrecision: 16
        });

        const colA = 20;
        const colB = 36;
        const colC = 50;
        const colD = 110;
        const colE = 151;
        const colF = 175;
        const colG = 194;

        let sl = 1;
        const margin = 30;
        const linePerPage = 50;
        let y = margin;
        doc.setFontSize(10);
        doc.setFont("times", "bold");

        const firsPage = sales.slice(0, 48);
        const restPage = sales.slice(48, sales.length);
        const gt = sales.reduce((t, c) => t + parseFloat(c.total), 0);
        console.log(gt);

        doc.text("SALES REPORT", 105, y - 20, 'center');

        doc.text("SL", colA, y, 'center');
        doc.text("Date", colB, y, 'center');
        doc.text("Customer", colC, y, 'left');
        doc.text("Item", colD, y, 'left');
        doc.text("Ship.", colE, y, 'center');
        doc.text("Rate", colF, y, 'right');
        doc.text("Total", colG, y, 'right');


        doc.setFont("times", "normal");
        doc.text(`Date: ${formatedDateDot(new Date())}`, colG, y - 5, 'right');

        y = y + 5;
        for (let i = 0; i < firsPage.length; i++) {
            const customerName = firsPage[i].customer;
            const customerItem = firsPage[i].item;
            let name = customerName.length > 23 ? `${customerName.substring(0, 25)}...` : customerName;
            let item = customerItem.length > 16 ? `${customerItem.substring(0, 16)}...` : customerItem;
            doc.text(`${sl}`, colA, y, 'center');
            doc.text(`${formatedDateDot(firsPage[i].dt, true)}`, colB, y, 'center');
            doc.text(`${name}`, colC, y, 'left');
            doc.text(`${item}`, colD, y, 'left');
            doc.text(`${firsPage[i].shipment}`, colE, y, 'center');
            doc.text(`${numberWithComma(firsPage[i].weight)}x${numberWithComma(firsPage[i].rate)}`, colF, y, 'right');
            doc.text(`${numberWithComma(firsPage[i].total)}`, colG, y, 'right');
            y += 5;
            sl++;

        }

        doc.addPage();

        y = margin;


        for (let i = 0; i < restPage.length; i++) {
            const customerName = restPage[i].customer;
            const customerItem = restPage[i].item;
            let name = customerName.length > 23 ? `${customerName.substring(0, 25)}...` : customerName;
            let item = customerItem.length > 16 ? `${customerItem.substring(0, 16)}...` : customerItem;
            doc.text(`${sl}`, colA, y, 'center');
            doc.text(`${formatedDateDot(restPage[i].dt, true)}`, colB, y, 'center');
            doc.text(`${name}`, colC, y, 'left');
            doc.text(`${item}`, colD, y, 'left');
            doc.text(`${restPage[i].shipment}`, colE, y, 'center');
            doc.text(`${numberWithComma(restPage[i].weight)}x${numberWithComma(restPage[i].rate)}`, colF, y, 'right');
            doc.text(`${numberWithComma(restPage[i].total)}`, colG, y, 'right');
            y += 5;
            sl++;
            if ((i + 1) % linePerPage === 0) {
                if (i !== restPage.length - 1) {
                    doc.addPage();
                    y = margin;
                }
            }
        }
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 0; i < pageCount; i++) {
            doc.setPage(i + 1);
            doc.text(`Page: ${i + 1}/${pageCount}`, 199, 288, null, null, 'right');
        }
        if(sales.length < 49){
            doc.deletePage(2);
        }
       // doc.setFont("times", "bold");
      //  doc.text("Total", colB, y, 'right');
      //  doc.text(`${numberWithComma(gt)}`, colG, y, 'right');
        doc.save("Sales_reports.pdf");
    }


    return (
        <>
            <div className="w-full mb-3 mt-8">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Sales Report-{yr}</h1>
                <h1 className="w-full text-xl lg:text-2xl font-bold text-center text-gray-400">Total = {numberWithComma(parseFloat(totalTaka))}/-</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>

            <div className="px-4 lg:px-6 overflow-auto">
                <div className="flex justify-end items-center space-x-2 mb-2">
                    <input onChange={e => setDt1(e.target.value)} value={dt1} type="date" id='dt1' name="dt1" required className="w-[155px] px-4 py-1.5 text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300" />
                    <span>To</span>
                    <input onChange={e => setDt2(e.target.value)} value={dt2} type="date" id='dt2' name="dt2" required className="w-[155px] px-4 py-1.5 text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300" />
                    <button onClick={searchClickHandler} className="text-center mx-0.5 px-4 py-2 bg-green-600 hover:bg-green-800 text-white font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300  cursor-pointer">Search</button>
                    <button onClick={refreshClickHandler} className="text-center mx-0.5 px-4 py-2 bg-violet-600 hover:bg-violet-800 text-white font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300  cursor-pointer">Refresh</button>
                    <button onClick={printMultiplePageHandler} className="text-center mx-0.5 px-4 py-2 bg-gray-600 hover:bg-gray-800 text-white font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300  cursor-pointer">Print</button>


                </div>

                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-center border-b border-gray-200 px-4 py-2">SL</th>
                            <th className="text-center border-b border-gray-200 px-4 py-2">Date</th>
                            <th className="text-center border-b border-gray-200 px-4 py-2">Customer</th>
                            <th className="text-center border-b border-gray-200 px-4 py-2">Shipment</th>
                            <th className="text-center border-b border-gray-200 px-4 py-2">Item</th>
                            <th className="text-center border-b border-gray-200 px-4 py-2">weight</th>
                            <th className="text-center border-b border-gray-200 px-4 py-2">Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.length ? (
                            sales.map((sale, i) => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={i}>
                                    <td className="text-center py-2 px-4">{i + 1}</td>
                                    <td className="text-center py-2 px-4">{formatedDateDot(sale.dt, true)}</td>
                                    <td className="text-center py-2 px-4">{sale.customer}</td>
                                    <td className="text-center py-2 px-4">{sale.shipment}</td>
                                    <td className="text-center py-2 px-4">{sale.item}</td>
                                    <td className="text-center py-2 px-4">{numberWithComma(sale.weight)}</td>
                                    <td className="text-center py-2 px-4">{numberWithComma(sale.rate)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center py-10 px-4">
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

export default Salereport;


