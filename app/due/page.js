"use client";
import React, { useState, useEffect } from "react";
import Details from "@/components/due/Details";
import { jsPDF } from "jspdf";

require("@/lib/fonts/Poppins-Bold-normal");
require("@/lib/fonts/Poppins-Regular-normal");
import Add from "@/components/due/Add";
import { filterDataInPeriod, formatedDate, formatedDateDot, inwordEnglish, numberWithComma, sortArray } from "@/lib/utils";
import { getDataFromFirebase } from "@/lib/firebaseFunction";



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

    useEffect(() => {
        const loadData = async () => {
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
                    const matchingSale = sales.filter(sale => sale.customerId === customer.id);
                    const matchingPayment = payments.filter(payment => payment.customerId === customer.id);

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
                console.log(sortResult);
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
        loadData();
        setDt1('2024-05-01');
        setDt2(formatedDate(new Date()));
    }, [msg]);




    const messageHandler = (data) => {
        setMsg(data);
    }


    const printHandler = (id) => {
        // console.log(customers, id)

        setWaitMsg('Please Wait...');
        setTimeout(() => {
            const customer = customers.find(customer => customer.id === id);

            console.log(customer);

            const doc = new jsPDF({
                orientation: "p",
                unit: "mm",
                format: "a4",
                putOnlyUsedFonts: true,
                floatPrecision: 16
            });
            doc.setFont("Poppins-Regular", "normal");
            doc.setFontSize(10);
            doc.text(`${customer.name}`, 12, 20, null, null, "left");
            doc.text(`${customer.address}`, 12, 25, null, null, "left");
            doc.text(`${customer.contact}`, 12, 30, null, null, "left");
            doc.text(`Date: ${formatedDateDot(new Date())}`, 198, 35, null, null, "right");
            doc.setFont("Poppins-Bold", "bold");
            doc.text("Sales Information", 12, 37, null, null, "left");
            doc.text("SL", 18, 43, null, null, "center");
            doc.text("Date", 35, 43, null, null, "center");
            doc.text("Shipment", 60, 43, null, null, "center");
            doc.text("Bale & Meter", 97, 43, null, null, "center");
            doc.text("Description", 146, 43, null, null, "center");
            doc.text("Amount(Taka)", 196, 43, null, null, "right");
            doc.line(12, 39, 198, 39);
            doc.line(12, 45, 198, 45);
            doc.setFont("Poppins-Regular", "normal");
            doc.setFontSize(10);
            let y = 49;
            let gt = 0;
            let totalKgs = 0;
            let totalMeter = 0;
            let totalBale = 0;
            let itemTimes = 0;
            const saleMatch = customer.matchingSale;
            const sale = saleMatch.sort((a, b) => sortArray(new Date(a.dt), new Date(b.dt)));
            for (let i = 0; i < sale.length; i++) {
                let subTotal = parseFloat(sale[i].weight) * parseFloat(sale[i].rate);

                doc.text(`${i+1}.`, 18, y, null, null, "center");
                doc.text(`${formatedDateDot(sale[i].dt, false)}`, 35, y, null, null, "center");
                doc.text(`${sale[i].shipment}`, 60, y, null, null, "center");
                doc.text(`${sale[i].bale} Bale; ${sale[i].meter} Mtr.`, 97, y, null, null, "center");
                doc.text(`${numberWithComma(sale[i].weight,true)} @ ${numberWithComma(sale[i].rate,true)}`, 146, y, null, null, "center");
                doc.text(`${numberWithComma(subTotal,true)}`, 196, y, null, null, "right");
                gt = gt + subTotal;
                totalKgs = totalKgs + parseFloat(sale[i].weight);
                totalMeter = totalMeter + parseFloat(sale[i].meter);
                totalBale = totalBale + parseFloat(sale[i].bale);
                itemTimes = i + 1;
                y = y + 5;
            }
            doc.setFont("Poppins-Bold", "bold");
            doc.line(12, y - 3, 198, y - 3);
            doc.text("Total:", 14, y + 1, null, null, "left");
            doc.setFont("Poppins-Regular", "normal");     
            doc.text(`(Total: Kgs= ${totalKgs.toFixed(2)}; Bale= ${totalBale.toFixed(2)}; Meter=${totalMeter.toFixed(2)})`, 28, y + 1, null, null, "left");
            doc.setFont("Poppins-Bold", "bold");
            doc.text(`${numberWithComma(gt)}`, 196, y + 1, null, null, "right");
            doc.line(12, y + 2.5, 198, y + 2.5);


            doc.line(12, 39, 12, y + 2.5);
            doc.line(198, 39, 198, y + 2.5);

            // -------------------------------------------------------------

            let z = y + 10;
            doc.setFont("Poppins-Bold", "bold");
            doc.text("Payments Information", 12, z, null, null, "left");
            doc.line(12, z + 1, 198, z + 1);
            doc.text("SL", 24, z + 5, null, null, "center");
            doc.text("Date", 64, z + 5, null, null, "center");
            doc.text("Cash Type", 122, z + 5, null, null, "center");
            doc.text("Amount", 196, z + 5, null, null, "right");
            doc.line(12, z + 6.5, 198, z + 6.5);

            doc.setFont("Poppins-Regular", "normal");
            let n = z + 11;
            let paymentTotal = 0;
            let paymentTimes = 0;
            const paymentMatch = customer.matchingPayment;
            const payment = paymentMatch.sort((a, b) => sortArray(new Date(a.dt), new Date(b.dt)));
            for (let i = 0; i < payment.length; i++) {
                const matchCashType = cashtypes.find(cashType => cashType.id === payment[i].cashtypeId);
                doc.text(`${i+1}.`, 24, n, null, null, "center");
                doc.text(`${formatedDateDot(payment[i].dt, false)}`, 64, n, null, null, "center");
                doc.text(`${matchCashType.name}`, 122, n, null, null, "center");
                doc.text(`${numberWithComma(payment[i].taka)}`, 196, n, null, null, "right");
                paymentTotal = paymentTotal + parseFloat(payment[i].taka);
                paymentTimes = i + 1;
                n = n + 5;
            }
            doc.setFont("Poppins-Bold", "bold");
            doc.line(12, n - 3, 198, n - 3);
            doc.text(`Total:`, 14, n + 1, null, null, "left");
            doc.text(`${numberWithComma(paymentTotal)}`, 196, n + 1, null, null, "right");
            doc.line(12, n + 2.5, 198, n + 2.5);

            doc.line(12, z + 1, 12, n + 2.5);
            doc.line(198, z + 1, 198, n + 2.5);


            doc.line(12, n + 10, 198, n + 10);
            doc.setFont("Poppins-Bold", "bold");
            doc.text(`Total Payable/Balance: (${gt} - ${paymentTotal}) = `, 14, n + 14, null, null, "left");

            doc.text(`${numberWithComma(customer.balance)}`, 196, n + 14, null, null, "right");
            doc.line(12, n + 16, 198, n + 16);

            doc.line(12, n + 10, 12, n + 16);
            doc.line(198, n + 10, 198, n + 16);


            doc.setFont("Poppins-Regular", "normal");
            doc.text(`INWORD: ${inwordEnglish(customer.balance).toUpperCase()} ONLY`, 12, n + 21, null, null, "left");

            doc.save(`Customer_Details_Created_${formatedDate(new Date())}.pdf`);
            setWaitMsg('');
        }, 0);
    }



    const searchClickHandler = () => {
        const d1 = new Date(dt1);
        const d2 = new Date(dt2);

        // search customer in date ranges
        const searchSale = customers.filter(customer => {
            const dataDate = new Date(customer.createdAt);
            return dataDate >= d1 && dataDate <= d2;
        })


        setCustomers(searchSale);
        const total = searchSale.reduce((t, c) => t + parseFloat(c.balance), 0);
        setTotalDue(total);

    }

    const refreshClickHandler = () => {
        setMsg(`Refresh at: ${Date.now()}`);
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
                                            <button onClick={() => printHandler(customer.id)} className="w-7 h-7 flex justify-center items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                                                </svg>
                                            </button>

                                            <Add message={messageHandler} id={customer.id} />
                                            <Details message={messageHandler} id={customer.id} data={customer} />
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


