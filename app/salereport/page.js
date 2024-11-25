"use client";
import React, { useState, useEffect } from "react";
import { formatedDate, formatedDateDot, numberWithComma, sortArray } from "@/lib/utils";

require("@/lib/fonts/Poppins-Bold-normal");
require("@/lib/fonts/Poppins-Regular-normal");
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import PrintPage from "@/components/salereport/PrintPage";


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
                  
                    <PrintPage data={{sales,totalTaka}} />
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


