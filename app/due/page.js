"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/due/Add";
import { filterDataInPeriod, formatedDate,  numberWithComma, sortArray } from "@/lib/utils";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { useRouter } from "next/navigation";



const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [msg, setMsg] = useState("Data ready");
    const [waitMsg, setWaitMsg] = useState("");

    const [dt1, setDt1] = useState("");
    const [dt2, setDt2] = useState("");


    //------- Total Taka in dues----------------------
    const [totalDue, setTotalDue] = useState('0');

    //------- For dropdown ----------------------
    const [cashtypes, setCashtypes] = useState([]);
    const [yr, setYr] = useState("");

    const router = useRouter();



    const loadData = async (initD1, initD2) => {
        setWaitMsg('Please Wait...');
        try {

            const [customers, sales, payments, cashtypes] = await Promise.all([
                getDataFromFirebase('customer'),
                getDataFromFirebase('sale'),
                getDataFromFirebase('payment'),
                getDataFromFirebase('cashtype')
            ]);

            //   console.log("Customer: ", customers);
            //  console.log("Sale: ", sales);


            setCashtypes(cashtypes);

            const result = customers.map(customer => {
                // dataDate >= d1 && dataDate <= d2
                const matchingSale = sales.filter(sale => new Date(sale.dt) >= initD1 && new Date(sale.dt) <= initD2 && sale.customerId === customer.id);
                const matchingPayment = payments.filter(payment => new Date(payment.dt) >= initD1 && new Date(payment.dt) <= initD2 && payment.customerId === customer.id);

                const totalSale = matchingSale.reduce((t, c) => t + (parseFloat(c.weight) * parseFloat(c.rate)), 0);
                const totalPayment = matchingPayment.reduce((t, c) => t + parseFloat(c.taka), 0);
                const balance = totalSale - totalPayment;
                const isDues = balance > 0 ? true : false;
                return {
                    ...customer,
                    balance,
                    isDues,
                    matchingSale,
                    matchingPayment
                };
            });

            // --------- Period range ----------
            const filterInPeriod = filterDataInPeriod(result);

            const sortResult = filterInPeriod.sort((a, b) => sortArray(parseInt(b.balance), parseInt(a.balance)));
           // console.log(sortResult);
            setCustomers(sortResult);

            //--------- Tota taka ------------------------------------------
            const total = sortResult.reduce((t, c) => t + parseFloat(c.balance), 0);
            setTotalDue(total);
            setYr(sessionStorage.getItem('yr'));

            setWaitMsg('');
        } catch (error) {
            console.error("Error fetching data:", error);
            setMsg("Failed to fetch data");
        }
    };




    useEffect(() => {
        const initD1 = new Date("1900-01-01");
        const initD2 = new Date("2050-01-01");
        loadData(initD1, initD2);
        setDt1('2024-05-01');
        setDt2(formatedDate(new Date()));
    }, [msg]);




    const messageHandler = (data) => {
        setMsg(data);
    }


    const searchClickHandler = () => {
        const d1 = new Date(dt1);
        const d2 = new Date(dt2);
        loadData(d1, d2);
    }

    const refreshClickHandler = () => {
        setMsg(`Refresh at: ${Date.now()}`);
    }



    const gotToPrintPage = (data) => {
        localStorage.setItem('customerData', JSON.stringify(data));
        router.push('/dueprint');
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
                    <input onChange={e => setDt1(e.target.value)} value={dt1} type="date" id='dt1' name="dt1" required className="w-[155px] px-4 py-1.5 text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300" />
                    <span>To</span>
                    <input onChange={e => setDt2(e.target.value)} value={dt2} type="date" id='dt2' name="dt2" required className="w-[155px] px-4 py-1.5 text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300" />
                    <button onClick={searchClickHandler} className="text-center mx-0.5 px-4 py-2 bg-green-600 hover:bg-green-800 text-white font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300  cursor-pointer">Search</button>
                    <button onClick={refreshClickHandler} className="text-center mx-0.5 px-4 py-2 bg-violet-600 hover:bg-violet-800 text-white font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300  cursor-pointer">Refresh</button>
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
                                <tr className={`border-b border-gray-200 hover:bg-gray-100 ${customer.isDues ? 'text-black' : 'text-blue-500'}`} key={customer.id}>
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


