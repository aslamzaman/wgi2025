"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/sale/Add";
import Edit from "@/components/sale/Edit";
import Delete from "@/components/sale/Delete";
import { filterDataInPeriod, formatedDateDot, numberWithComma } from "@/lib/utils";
import { DropdownEn } from "@/components/Form";
import { sortArray } from "@/lib/utils";
import { getDataFromFirebase } from "@/lib/firebaseFunction";



const Sale = () => {
    const [sales, setSales] = useState([]);
    const [sales1, setSales1] = useState([]);
    const [msg, setMsg] = useState("Data ready");
    const [waitMsg, setWaitMsg] = useState("");

    const [totalSale, setTotalSale] = useState('0');

    //------------ Dropdown for search----------------
    const [customers, setCustomers] = useState([]);
    const [searchDropdown, setSearchDropdown] = useState('');

    //-------- Data display year --------
    const [yr, setYr] = useState('');


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const [responseSale, responseCustomer, responseItem] = await Promise.all([
                    getDataFromFirebase('sale'),
                    getDataFromFirebase('customer'),
                    getDataFromFirebase('item')
                ]);
                //  console.log(responseSale, responseCustomer, responseItem);
                const joinTable = responseSale.map(sale => {
                    return {
                        ...sale,
                        customer: responseCustomer.find(customer => customer.id === sale.customerId) || {},
                        item: responseItem.find(item => item.id === sale.itemId) || {}
                    }
                })

                // periodic data ------------------
                const getDataInPeriod = filterDataInPeriod(joinTable);

                // console.log("Data in period: ", getDataInPeriod);

                // console.log("joinTable: ", getDataInPeriod);

                setSales(getDataInPeriod);

                // -------- Storage for search ----------------------
                setSales1(getDataInPeriod);

                // -------- This is for search dropdown ----------------------
                const sortCustomer = responseCustomer.sort((a, b) => sortArray(a.name, b.name));
                setCustomers(sortCustomer);

                //-----------------Total sale taka----------------------------------
                const total = getDataInPeriod.reduce((t, c) => t + (parseFloat(c.weight) * parseFloat(c.rate)), 0);
                setTotalSale(total);

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

    const searchClickHandler = () => {
        if (searchDropdown === "") return;
        const searchSale = sales1.filter(sale => sale.customer.id === searchDropdown);

        setSales(searchSale);
        const total = searchSale.reduce((t, c) => t + (parseFloat(c.weight) * parseFloat(c.rate)), 0);
        setTotalSale(total);
    }

    const refreshClickHandler = () => {
        setMsg(`Refreshed data: ${Date.now()}`);
    }

    return (
        <>
            <div className="w-full mb-3 mt-8">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Sale-{yr}</h1>
                <h1 className="w-full text-xl lg:text-2xl font-bold text-center text-gray-400">Total = {numberWithComma(parseFloat(totalSale))}/-</h1>


                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>
            <div className="px-4 lg:px-6">
                <p className="w-full text-sm text-red-700">{msg}</p>
                <div className="p-2 overflow-auto">
                    <div className="flex justify-end items-center space-x-2 mb-2">
                        <div className="w-[350px]">
                            <DropdownEn Title="" Id="searchDropdown" Change={e => setSearchDropdown(e.target.value)} Value={searchDropdown}>
                                {customers.length ? customers.map(customer => <option value={customer.id} key={customer.id}>{customer.name}</option>) : null}
                            </DropdownEn>
                        </div>
                        <button onClick={searchClickHandler} className="text-center mx-0.5 px-4 py-2 bg-green-600 hover:bg-green-800 text-white font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300  cursor-pointer">Search</button>

                        <button onClick={refreshClickHandler} className="text-center mx-0.5 px-4 py-2 bg-violet-600 hover:bg-violet-800 text-white font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300  cursor-pointer">Refresh</button>
                    </div>
                    <table className="w-full border border-gray-200">
                        <thead>
                            <tr className="w-full bg-gray-200">
                                <th className="text-center border-b border-gray-200 px-4 py-2">Date</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Shipment</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Customer</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Weight</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Rate</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Total</th>

                                <th className="w-[100px] font-normal">
                                    <div className="w-full flex justify-end py-0.5 pr-4">
                                        <Add message={messageHandler} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.length ? (
                                sales.map(sale => (
                                    <tr className="border-b border-gray-200 hover:bg-gray-100" key={sale.id}>
                                        <td className="text-center py-2 px-4">{formatedDateDot(sale.dt, true)}</td>
                                        <td className="text-center py-2 px-4">{sale.shipment}</td>
                                        <td className="text-center py-2 px-4">{sale.customer.name}</td>
                                        <td className="text-center py-2 px-4">{sale.weight}</td>
                                        <td className="text-center py-2 px-4">{sale.rate}</td>
                                        <td className="text-center py-2 px-4">{numberWithComma((parseFloat(sale.weight) * parseFloat(sale.rate)))}</td>
                                        <td className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                            <Edit message={messageHandler} id={sale.id} data={sale} />
                                            <Delete message={messageHandler} id={sale.id} data={sale} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={11} className="text-center py-10 px-4">
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

export default Sale;


