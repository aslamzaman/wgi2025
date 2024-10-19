import React, { useState } from "react";
const date_format = dt => new Date(dt).toISOString().split('T')[0];
import { numberWithComma } from "@/lib/utils";



const Details = ({ message, id, data }) => {
    const [show, setShow] = useState(false);


    const [customers, setCustomers] = useState({});
    const [sales, setSales] = useState([]);
    const [payments, setPayments] = useState([]);

    // Sale
    const [totalBale, setTotalBale] = useState('0');
    const [totalMeter, setTotalMeter] = useState('0');
    const [totalThaan, setTotalThaan] = useState('0');
    const [totalWight, setTotalWight] = useState('0');
    const [totalAmount, setTotalAmount] = useState('0');

    // Payment
    const [totalTaka, setTotalTaka] = useState('0');



    const showDetailsForm = () => {
        setShow(true);
        try {
            console.log(data)
            const customer = data.find(customer => customer._id === id) || { name: "" };
            console.log(customer)
            setCustomers(customer);
            setSales(customer.matchingSale);

            const sale = customer.matchingSale;
            const tb = sale.reduce((t, c) => t + parseFloat(c.bale), 0);
            const tt = sale.reduce((t, c) => t + parseFloat(c.than), 0);
            const tm = sale.reduce((t, c) => t + parseFloat(c.meter), 0);
            const tw = sale.reduce((t, c) => t + parseFloat(c.weight), 0);
            const gt = sale.reduce((t, c) => t + (parseFloat(c.weight) * parseFloat(c.rate)), 0);
            setTotalBale(tb);
            setTotalThaan(tt);
            setTotalMeter(tm);
            setTotalWight(tw);
            setTotalAmount(gt);


            setPayments(customer.matchingPayment);
            const payment = customer.matchingPayment;
            const tPayment = payment.reduce((t, c) => t + parseFloat(c.taka), 0);
            setTotalTaka(tPayment);
            message("Ready to delete");
        }
        catch (err) {
            console.log(err);
        }
    }


    const closeDetailsForm = () => {
        setShow(false);
        message("Data ready");
    }



    return (
        <>
            {show && (
                <div className="fixed inset-0 py-16 bg-black bg-opacity-30 backdrop-blur-sm z-10 overflow-auto">
                    <div className="w-11/12 mx-auto mb-10 bg-white border-2 border-gray-300 rounded-md shadow-md duration-300">
                        <div className="px-6 md:px-6 py-2 flex justify-between items-center border-b border-gray-300">
                            <h1 className="text-xl font-bold text-blue-600">Customer Details Balance</h1>
                            <button onClick={closeDetailsForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                        </div>
                        <div className="px-4 lg:px-6 overflow-auto">
                            <p className="w-full mt-4 text-start"><span className="font-bold">{customers.name}</span><br />
                                {customers.address}<br />
                                    {customers.contact}
                                    </p>
                                </div>




                                <div className="px-4 mt-4 lg:px-6 overflow-auto">
                                    <p className="w-full text-start font-bold">Sales Informatio</p>
                                    <table className="w-full border border-gray-200">
                                        <thead>
                                            <tr className="w-full bg-gray-200">
                                                <th className="text-start border-b border-gray-200 px-4 py-2">SL</th>
                                                <th className="text-start border-b border-gray-200 px-4 py-2">Date</th>
                                                <th className="text-center border-b border-gray-200 px-4 py-2">Shipment</th>
                                                <th className="text-end border-b border-gray-200 px-4 py-2">Bale</th>
                                                <th className="text-end border-b border-gray-200 px-4 py-2">Meter</th>
                                                <th className="text-end border-b border-gray-200 px-4 py-2">Than</th>
                                                <th className="text-end border-b border-gray-200 px-4 py-2">Weight</th>
                                                <th className="text-end border-b border-gray-200 px-4 py-2">Rate</th>
                                                <th className="text-end border-b border-gray-200 px-4 py-2">Amount(Taka)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sales.length ? (
                                                sales.map((sale, i) => (
                                                    <tr className={`border-b border-gray-200 hover:bg-gray-100`} key={sale._id}>
                                                        <td className="text-start py-2 px-4">{i + 1}</td>
                                                        <td className="text-start py-2 px-4">{date_format(sale.dt)}</td>
                                                        <td className="text-center py-2 px-4">{sale.shipment}</td>
                                                        <td className="text-end py-2 px-4">{numberWithComma(sale.bale)}</td>
                                                        <td className="text-end py-2 px-4">{numberWithComma(sale.meter)}</td>
                                                        <td className="text-end py-2 px-4">{numberWithComma(sale.than)}</td>
                                                        <td className="text-end py-2 px-4">{numberWithComma(sale.weight)}</td>
                                                        <td className="text-end py-2 px-4">{numberWithComma(sale.rate)}</td>
                                                        <td className="text-end py-2 px-4">{numberWithComma(parseFloat(sale.weight) * parseFloat(sale.rate))}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="text-center py-10 px-4">
                                                        Data not available.
                                                    </td>
                                                </tr>
                                            )}
                                            <tr className={`border-b border-gray-200 hover:bg-gray-100 font-bold`}>
                                                <td className="text-start py-2 px-4"></td>
                                                <td className="text-start py-2 px-4">Total</td>
                                                <td className="text-center py-2 px-4"></td>
                                                <td className="text-end py-2 px-4">{numberWithComma(totalBale)}</td>
                                                <td className="text-end py-2 px-4">{numberWithComma(totalMeter)}</td>
                                                <td className="text-end py-2 px-4">{numberWithComma(totalThaan)}</td>
                                                <td className="text-end py-2 px-4">{numberWithComma(totalWight)}</td>
                                                <td className="text-end py-2 px-4"></td>
                                                <td className="text-end py-2 px-4">{numberWithComma(totalAmount)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>




                                <div className="px-4 mt-12 lg:px-6 overflow-auto">
                                    <p className="w-full text-start font-bold">Payments Information</p>
                                    <table className="w-full border border-gray-200">
                                        <thead>
                                            <tr className="w-full bg-gray-200">
                                                <th className="text-start border-b border-gray-200 px-4 py-2">SL</th>
                                                <th className="text-start border-b border-gray-200 px-4 py-2">Date</th>
                                                <th className="text-center border-b border-gray-200 px-4 py-2">Cash Type</th>
                                                <th className="text-end border-b border-gray-200 px-4 py-2">Amount(Taka)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.length ? (
                                                payments.map((payment, i) => (
                                                    <tr className={`border-b border-gray-200 hover:bg-gray-100`} key={payment._id}>
                                                        <td className="text-start py-2 px-4">{i + 1}</td>
                                                        <td className="text-start py-2 px-4">{date_format(payment.dt)}</td>
                                                        <td className="text-center py-2 px-4">{payment.cashtypeId.name}</td>
                                                        <td className="text-end py-2 px-4">{parseFloat(payment.taka).toFixed(2)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="text-center py-10 px-4">
                                                        Data not available.
                                                    </td>
                                                </tr>
                                            )}
                                            <tr className={`border-b border-gray-200 hover:bg-gray-100 font-bold`}>
                                                <td className="text-start py-2 px-4"></td>
                                                <td className="text-start py-2 px-4">Total</td>
                                                <td className="text-center py-2 px-4"></td>
                                                <td className="text-end py-2 px-4">{numberWithComma(totalTaka)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>



                                <div className="px-4 mt-12 lg:px-6 overflow-auto">
                                    <p className="w-full text-start font-bold">Balance</p>
                                    <table className="w-full border border-gray-200">
                                        <thead>
                                            <tr className="w-full bg-gray-200">
                                                <th className="text-start border-b border-gray-200 px-4 py-2">Description</th>
                                                <th className="text-end border-b border-gray-200 px-4 py-2">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            <tr className={`border-b border-gray-200 hover:bg-gray-100 font-bold`}>
                                                <td className="text-start py-2 px-4">Total Payable: ({numberWithComma(totalAmount)} - {numberWithComma(totalTaka)}) = </td>
                                                <td className="text-end py-2 px-4">{numberWithComma(customers.balance)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>




                            </div>
                        </div>
            )}
                        <button onClick={showDetailsForm} title="Details" className="px-1 py-1 rounded-md transition duration-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </>
                    )
}
                    export default Details;


