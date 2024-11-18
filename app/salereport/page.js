"use client";
import React, { useState, useEffect } from "react";
import { formatedDate, formatedDateDot, numberWithComma, sortArray } from "@/lib/utils";

require("@/lib/fonts/Poppins-Bold-normal");
require("@/lib/fonts/Poppins-Regular-normal");
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import jsPDF from "jspdf";
import { jsPDFPrintFirstPage, jsPDFPrintOtherPage } from "@/lib/JspdfPrintPage";



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
                //      console.log({ sales, customers, items });

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

                const sortData = result.sort((a, b) => sortArray(new Date(a.dt), new Date(b.dt)));

                //   console.log(sortData);
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
            const dataDate = new Date(sale.dt);
            return dataDate >= d1 && dataDate <= d2;
        })

        setSales(searchSale);
        const total = searchSale.reduce((t, c) => t + parseFloat(c.total), 0);
        setTotalTaka(total);

    }

    const refreshClickHandler = () => {
        setMsg(`Refresh at: ${Date.now()}`);
    }


    // Print handler
    const printMultiplePageHandler = () => {
        const doc = new jsPDF({
            orientation: 'p',    // Portrait orientation
            unit: 'mm',          // Unit of measurement in millimeters
            format: 'a4',        // A4 paper size
            putOnlyUsedFonts: true,
            floatPrecision: 16   // High precision for measurements
        });


        const salesNormalize = sales.map(sale => {
            const dt = formatedDateDot(sale.dt, true);
            const wgt = parseFloat(sale.weight).toFixed(2);
            const rte = parseFloat(sale.rate).toFixed(2);
            const rate = `${wgt}@${rte}`;
            const total = numberWithComma(sale.total, true);
            const nm = sale.customer;
            const itm = sale.item;
            const customer = nm.length >= 25 ? nm.substring(0, 23) + "..." : nm;
            const item = itm.length >= 15 ? itm.substring(0, 15) + "..." : itm;
            return {
                ...sale,
                customer, item, dt, rate, total
            }
        })


        const withTotal = [...salesNormalize, { dt: "", customer: 'Total', item: "", shipment: "", rate: "", total: numberWithComma(totalTaka, true) }];


        const dataFormat = [
            {
                head: 'Date',
                fld: 'dt',
                pos: 26,
                aln: 'center'
            },
            {
                head: 'Customer',
                fld: 'customer',
                pos: 43,
                aln: 'left'
            },
            {
                head: 'Item',
                fld: 'item',
                pos: 100,
                aln: 'left'
            },
            {
                head: 'Ship.',
                fld: 'shipment',
                pos: 135,
                aln: 'center'
            },
            {
                head: 'Rate',
                fld: 'rate',
                pos: 155,
                aln: 'center'
            },
            {
                head: 'Total',
                fld: 'total',
                pos: 194,
                aln: 'right'
            }
        ]

        doc.setFontSize(16);
        doc.setFont("times", "bold");
        doc.text("SALES REPORT", 105, 15, 'center');
        doc.setFontSize(10);
        doc.setFont("times", "normal");
        doc.text(`Period: ${formatedDateDot(dt1)}-${formatedDateDot(dt2)}`, 105, 20, 'center');
        doc.text(`Print Date: ${formatedDateDot(new Date())}`, 194, 30, 'right');



        const firstPageData = withTotal.slice(0, 49);  // First 20 rows
        const otherPageData = withTotal.slice(49);     // Remaining rows

        // Print the first page
        jsPDFPrintFirstPage({ doc }, firstPageData, dataFormat, 35);
        // Add a new page and print subsequent pages
        if (otherPageData.length > 0) {
            doc.addPage();
            jsPDFPrintOtherPage({ doc }, otherPageData, dataFormat, 15, 54);
        }

        // Save the PDF with a timestamped filename
        doc.save(`${new Date().toISOString()}.pdf`);
    };





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
                            <th className="text-center border-b border-gray-200 px-4 py-2">Total</th>
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
                                    <td className="text-center py-2 px-4">{parseFloat(sale.weight).toFixed(2)}</td>
                                    <td className="text-center py-2 px-4">{parseFloat(sale.rate).toFixed(2)}</td>
                                    <td className="text-center py-2 px-4">{parseFloat(sale.total).toFixed(2)}</td>
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


