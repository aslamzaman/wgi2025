
// npm install react-to-print@3.0.2
import React, { useState, useRef, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
import { formatedDateDot, numberWithComma, sortArray } from "@/lib/utils";
import { Tiro_Bangla } from 'next/font/google';
import { BtnEn } from "../Form";
import { Info } from "../Icons";
const tiro = Tiro_Bangla({ subsets: ['bengali'], weight: "400" });


const PrintPage = ({ data, id }) => {
    const [sales, setSales] = useState([]);
    const [payments, setPayments] = useState([]);
    const [kgTotal, setKgTotal] = useState("0");
    const [baleTotal, setBaleTotal] = useState("0");
    const [meterTotal, setMeterTotal] = useState("0");
    const [saleTotal, setSaleTotal] = useState("0");
    const [paymentTotal, setPaymentTotal] = useState("0");
    const [singleCustomer, setSingleCustomer] = useState({});




    const [show, setShow] = useState(false);
    const componentRef = useRef(null);


    const showPrintForm = () => {

        setShow(true);
        console.log(data);

        const singleCustomerData = data.find(customer => customer.id === id);
        setSingleCustomer(singleCustomerData);

        const saleData = singleCustomerData.matchingSale;
        const paymentData = singleCustomerData.matchingPayment;
        //--------------------------------------------
        const saleSort = saleData.sort((a, b) => sortArray(new Date(a.dt), new Date(b.dt)));
        setSales(saleSort);
        //--------------------------------------------
        const paymentSort = paymentData.sort((a, b) => sortArray(new Date(a.dt), new Date(b.dt)));
        setPayments(paymentSort);
        //--------------------------------------------

        setPayments(paymentData);

        const totalKg = saleData.reduce((t, c) => t + parseFloat(c.weight), 0);
        const totalBale = saleData.reduce((t, c) => t + parseFloat(c.bale), 0);
        const totalMeter = saleData.reduce((t, c) => t + parseFloat(c.meter), 0);
        const totalSale = saleData.reduce((t, c) => t + (parseFloat(c.rate) * parseFloat(c.weight)), 0);
        const totalPayment = paymentData.reduce((t, c) => t + parseFloat(c.taka), 0);

        setKgTotal(totalKg);
        setBaleTotal(totalBale);
        setMeterTotal(totalMeter);
        setSaleTotal(totalSale);
        setPaymentTotal(totalPayment);
    }

    const closePrintForm = () => {
        setShow(false);
    }

    const pageStyle = `@media print {
            @page {
                size: A4 portrait;
                margin: .75in;
            }
            footer{
                page-break-after: always;
            }    
            #noPrint{
                display:none;
            }  
            #page{
                font-size: 10px;
                font-family: Arial, Helvetica, sans-serif;
            }
        }`;


    const printFn = useReactToPrint({
        contentRef: componentRef,
        pageStyle: pageStyle,
        documentTitle: `${new Date().toISOString()}_sales_reports`,
    });

    const printHandler = useCallback(() => {
        printFn();
    }, [printFn]);



    return (
        <>
            {show && (
                <div className="fixed inset-0 py-16 bg-black bg-opacity-30 backdrop-blur-sm z-10 overflow-auto">
                    <div className="w-[794px] mx-auto mb-10 bg-white border-2 border-gray-300 rounded-md shadow-md duration-300">
                        <div className="px-6 md:px-6 py-2 flex justify-between items-center border-b border-gray-300">

                            <h1 className="text-xl font-bold text-blue-600">Print Process Form</h1>
                            <div className="w-auto flex items-center space-x-4">
                                <button onClick={printHandler} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md ring-1 ring-gray-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full p-[2px] stroke-black">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                                    </svg>
                                </button>

                                <button onClick={closePrintForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md ring-1 ring-gray-30">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                        </div>
                        <div className="w-full h-auto p-16 overflow-auto">
                            <div ref={componentRef} className="w-full h-full text-black">
                                <h1 className="text-center font-bold uppercase text-[20px]">DUES REPORTS</h1>
                                <p className="text-center">Date: {formatedDateDot(new Date(), true)}</p>
                                <br />
                                <h1 className="text-start font-bold uppercase">{singleCustomer.name}</h1>
                                <p className="text-start">Date: {singleCustomer.address}<br />{singleCustomer.contact}</p>
                                <br />
                                <div className="w-full h-auto p-1 overflow-auto">
                                    <h1 className="text-start font-bold uppercase">Sales Information</h1>
                                    <table className="w-full text-[12px] border border-gray-400">
                                        <thead>
                                            <tr className="w-full bg-gray-200 border border-gray-400">
                                                <th className="text-center px-2 py-2">SL</th>
                                                <th className="text-center px-2 py-2">Date</th>
                                                <th className="text-center px-2 py-2">Shipment</th>
                                                <th className="text-start px-2 py-2">Bale & Meter</th>
                                                <th className="text-start px-2 py-2">Description</th>
                                                <th className="text-end px-2 py-2">Amount(Taka)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sales.length ? (
                                                sales.map((sale, i) => (
                                                    <tr className="border border-gray-400 hover:bg-gray-100" key={i}>
                                                        <td className="text-center px-2 py-0.5">{i + 1}</td>
                                                        <td className="text-center px-2 py-0.5">{formatedDateDot(sale.dt, false)}</td>
                                                        <td className="text-center px-2 py-0.5">{sale.shipment}</td>
                                                        <td className="text-start px-2 py-0.5">{numberWithComma(sale.bale, true)} bale;{numberWithComma(sale.meter, true)}Mtr.</td>
                                                        <td className="text-start px-2 py-0.5">{numberWithComma(sale.meter, true)} bale;{numberWithComma(sale.rate, true)}Mtr.</td>
                                                        <td className="text-end px-2 py-0.5">{numberWithComma((parseFloat(sale.weight) * parseFloat(sale.rate)), true)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="text-center py-5 px-4">
                                                        Data not available.
                                                    </td>
                                                </tr>
                                            )}

                                            <tr className="border border-gray-400 hover:bg-gray-100">
                                                <td colSpan="5" className="text-start px-2 py-0.5"><span className="font-bold">Total</span>  (Total: Kgs= {numberWithComma(kgTotal, true)}; Bale= {numberWithComma(baleTotal, true)}; Meter={numberWithComma(meterTotal, true)}) </td>
                                                <td className="font-bold text-end px-2 py-0.5">{numberWithComma(saleTotal, true)}</td>
                                            </tr>

                                        </tbody>
                                    </table>

                                    <br />

                                    <h1 className="text-start font-bold uppercase">PAYMENTS Information</h1>
                                    <table className="w-full text-[12px] border border-gray-400">
                                        <thead>
                                            <tr className="w-full bg-gray-200 border border-gray-400">
                                                <th className="text-center px-2 py-2">SL</th>
                                                <th className="text-center px-2 py-2">Date</th>
                                                <th className="text-center px-2 py-2">CashType</th>
                                                <th className="text-end px-2 py-2">Amount(Taka)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.length ? (
                                                payments.map((payment, i) => (
                                                    <tr className="border border-gray-400 hover:bg-gray-100" key={i}>
                                                        <td className="text-center px-2 py-0.5">{i + 1}</td>
                                                        <td className="text-center px-2 py-0.5">{formatedDateDot(payment.dt, true)}</td>
                                                        <td className="text-center px-2 py-0.5">{payment.cashtypeId === '1yECAMtHPz31hACNVq3j' ? 'Cash' : 'Cheque'}</td>
                                                        <td className="text-end px-2 py-0.5">{numberWithComma((parseFloat(payment.taka)), true)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="text-center py-5 px-4">
                                                        Data not available.
                                                    </td>
                                                </tr>
                                            )}

                                            <tr className="border border-gray-400 hover:bg-gray-100">
                                                <td colSpan="3" className="text-start px-2 py-0.5"><span className="font-bold">Total</span></td>
                                                <td className="font-bold text-end px-2 py-0.5">{numberWithComma(paymentTotal, true)}</td>
                                            </tr>

                                        </tbody>
                                    </table>



                                    <br />
                                    <div className="grid grid-cols-4 py-2 border border-gray-400">
                                        <p className="col-span-3 ml-2 text-start font-bold">Payable/Balance: ({numberWithComma(saleTotal, true)} - {numberWithComma(parseFloat(paymentTotal), true)}) = </p>
                                        <p className="w-auto mr-2 text-end font-bold">{numberWithComma((parseFloat(saleTotal) - parseFloat(paymentTotal)), true)}</p>
                                    </div>

                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            )}
            <button title="Details" onClick={showPrintForm} className={`w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md ring-1 ring-gray-300`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full p-[1px] stroke-black">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
            </button>
        </>
    )
}
export default PrintPage;
