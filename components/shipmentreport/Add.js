import React, { useState } from "react";
import { formatedDateDot, numberWithComma, sortArray } from "@/lib/utils";


const Add = ({ sales, customers, data }) => {
    const [show, setShow] = useState(false);
    const [saleDatas, setSaleDatas] = useState([]);
    const [totals, setTotals] = useState([]);

    //-----------------------------------------------------

    const showAddForm = async () => {
        setShow(true);
        try {

            
            const filterSale = sales.filter(sale => (parseInt(sale.shipment) === parseInt(data.shipment)));
            const joinWithCustomer = filterSale.map(sale => {
                const matchCustomer = customers.find(customer => customer.id === sale.customerId);
                return {
                    ...sale,
                    customer: matchCustomer
                }
            })
            console.log({ joinWithCustomer });

            const sortedCustomer = joinWithCustomer.sort((a, b) => sortArray(new Date(a.dt), new Date(b.dt)));
            setSaleDatas(sortedCustomer);


            const totalBale = joinWithCustomer.reduce((t, c) => t + parseFloat(c.bale), 0);
            const totalThan = joinWithCustomer.reduce((t, c) => t + parseFloat(c.than), 0);
            const totalMeter = joinWithCustomer.reduce((t, c) => t + parseFloat(c.meter), 0);
            const totalWeitht = joinWithCustomer.reduce((t, c) => t + parseFloat(c.weight), 0);
            const totalGt = joinWithCustomer.reduce((t, c) => t + (parseFloat(c.rate) * parseFloat(c.weight)), 0);
            setTotals([totalBale,totalThan,totalMeter,totalWeitht,totalGt]);
            console.log(totalBale);

        } catch (error) {
            console.error('Failed to fetch delivery data:', error);
        }
    }


    const closeAddForm = () => {
        setShow(false);
    }

    return (
        <>
            {show && (
                <div className="fixed inset-0 py-16 bg-black bg-opacity-30 backdrop-blur-sm z-10 overflow-auto">
                    <div className="w-11/12 mx-auto mb-10 bg-white border-2 border-gray-300 rounded-md shadow-md duration-300">
                        <div className="px-6 md:px-6 py-2 flex justify-between items-center border-b border-gray-300">
                            <h1 className="text-xl font-bold text-blue-600">Shipment: {data.shipment}</h1>
                            <button onClick={closeAddForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="px-6 pb-6 text-black overflow-auto">
                            <table className="w-full border border-gray-200">
                                <thead>
                                    <tr className="w-full bg-gray-200">
                                        <th className="text-start border-b border-gray-200 px-4 py-2">SL</th>
                                        <th className="text-start border-b border-gray-200 px-4 py-2">Date</th>
                                        <th className="text-start border-b border-gray-200 px-4 py-2">Name</th>
                                        <th className="text-center border-b border-gray-200 px-4 py-2">Bale</th>
                                        <th className="text-center border-b border-gray-200 px-4 py-2">Thaan</th>
                                        <th className="text-center border-b border-gray-200 px-4 py-2">Meter</th>
                                        <th className="text-center border-b border-gray-200 px-4 py-2">weight</th>
                                        <th className="text-center border-b border-gray-200 px-4 py-2">Taka(Wgt)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {saleDatas.length ? (
                                        saleDatas.map((sale, i) => (
                                            <tr className={`border-b border-gray-200 hover:bg-gray-100`} key={sale.id}>
                                                <td className="text-start py-2 px-4">{(i + 1)}</td>
                                                <td className="text-start py-2 px-4">{formatedDateDot(sale.dt, true)}</td>
                                                <td className="text-start py-2 px-4">{sale.customer.name}</td>
                                                <td className="text-center py-2 px-4">{numberWithComma(sale.bale)}</td>
                                                <td className="text-center py-2 px-4">{numberWithComma(sale.than)}</td>
                                                <td className="text-center py-2 px-4">{numberWithComma(sale.meter)}</td>
                                                <td className="text-center py-2 px-4">{numberWithComma(sale.weight)}</td>
                                                <td className="text-center py-2 px-4">{numberWithComma(parseFloat(sale.rate) * parseFloat(sale.weight))}/-</td>

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
                                        <td className="text-start py-2 px-4"></td>
                                        <td className="text-center py-2 px-4">{numberWithComma(totals[0])}</td>
                                        <td className="text-center py-2 px-4">{numberWithComma(totals[1])}</td>
                                        <td className="text-center py-2 px-4">{numberWithComma(totals[2])}</td>
                                        <td className="text-center py-2 px-4">{numberWithComma(totals[3])}</td>
                                        <td className="text-center py-2 px-4">{numberWithComma(totals[4])}/-</td>

                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={showAddForm} className="w-7 h-7 flex justify-center items-center" title="Details">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            </button>
        </>
    )
}
export default Add;

