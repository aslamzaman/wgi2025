"use client";
import React, { useState, useEffect } from "react";
import { filterDataInPeriod, numberWithComma, sortArray } from "@/lib/utils";

require("@/lib/fonts/Poppins-Bold-normal");
require("@/lib/fonts/Poppins-Regular-normal");
import Add from "@/components/shipmentreport/Add";
import { getDataFromFirebase } from "@/lib/firebaseFunction";




const Shipmentreport = () => {
    const [msg, setMsg] = useState("Data ready");
    const [waitMsg, setWaitMsg] = useState("");

    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [saleSummery, setSaleSummery] = useState([]);

    //-------- Data display year --------
    const [yr, setYr] = useState('');



    useEffect(() => {
        const loadData = async () => {
            setWaitMsg('Please Wait...');
            try {

                const [sales, customers] = await Promise.all([
                    getDataFromFirebase('sale'),
                    getDataFromFirebase('customer')
                ]);
                setCustomers(customers);

                //----------- Period ------------
                const periodicSale = filterDataInPeriod(sales);


                const arrShipment = periodicSale.map(sale => sale.shipment);
                const shipments = Array.from(new Set(arrShipment));

                setSales(sales);

                const result = shipments.map(shipment => {
                    const oneSale = sales.find(sale => sale.shipment === shipment);
                    const customerName = customers.find(customer => customer.id === oneSale.customerId);
                    const matchingSale = sales.filter(sale => sale.shipment === shipment);
                    const totalBale = matchingSale.reduce((t, c) => t + parseFloat(c.bale), 0);
                    const totalThan = matchingSale.reduce((t, c) => t + parseFloat(c.than), 0);
                    const totalMeter = matchingSale.reduce((t, c) => t + parseFloat(c.meter), 0);
                    const totalWeitht = matchingSale.reduce((t, c) => t + parseFloat(c.weight), 0);
                    const totalTaka = matchingSale.reduce((t, c) => t + (parseFloat(c.weight) * parseFloat(c.rate)), 0);
                    return {
                        customerName: customerName,
                        saleDate: oneSale.dt,
                        shipment, totalBale, totalThan, totalMeter, totalWeitht, totalTaka
                    };
                });

                const sortData = result.sort((a, b) => sortArray(parseInt(a.shipment), parseInt(b.shipment)));

                console.log(sortData);
                setSaleSummery(sortData);

                //---------- Session Storage Year ----------------
                const period = sessionStorage.getItem('yr');
                setYr(period);


                setWaitMsg('');
            } catch (error) {
                console.error("Error fetching data:", error);
                setMsg("Failed to fetch data");
            }
        }
        loadData();

    }, [msg]);


    return (
        <>
            <div className="w-full mb-3 mt-8">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Report on Shipment-{yr}</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>

            <div className="px-4 lg:px-6 overflow-auto">
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-center border-b border-gray-200 px-4 py-2">SL</th>
                            <th className="text-center border-b border-gray-200 px-4 py-2">Shipment</th>
                            <th className="text-center border-b border-gray-200 px-4 py-2">Bale</th>
                            <th className="text-center border-b border-gray-200 px-4 py-2">Thaan</th>
                            <th className="text-center border-b border-gray-200 px-4 py-2">Meter</th>
                            <th className="text-center border-b border-gray-200 px-4 py-2">weight</th>
                            <th className="text-center border-b border-gray-200 px-4 py-2">Taka(Wgt)</th>
                            <th className="text-end border-b border-gray-200 px-4 py-2">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {saleSummery.length ? (
                            saleSummery.map((customer, i) => (
                                <tr className={`border-b border-gray-200 hover:bg-gray-100 ${customer.isDues ? 'text-black' : 'text-blue-500'}`} key={i}>
                                    <td className="text-center py-2 px-4">{i + 1}</td>
                                    <td className="text-center py-2 px-4">{customer.shipment}</td>
                                    <td className="text-center py-2 px-4">{numberWithComma(customer.totalBale)}</td>
                                    <td className="text-center py-2 px-4">{numberWithComma(customer.totalThan)}</td>
                                    <td className="text-center py-2 px-4">{numberWithComma(customer.totalMeter)}</td>
                                    <td className="text-center py-2 px-4">{numberWithComma(customer.totalWeitht)}</td>
                                    <td className="text-center py-2 px-4">{numberWithComma(customer.totalTaka)}/-</td>
                                    <td className="text-end py-2 px-4">
                                        <div className="flex justify-end space-x-3">
                                            <Add sales={sales} customers={customers} data={customer} />
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

export default Shipmentreport;


