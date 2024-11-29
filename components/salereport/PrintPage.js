import React, { useState, useRef, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
import { formatedDateDot, numberWithComma } from "@/lib/utils";



const PrintPage = ({ data }) => {
    const [sales, setSales] = useState([]);
    const [gtTaka, setGtTaka] = useState("");
    const [d1, setD1] = useState("");
    const [d2, setD2] = useState("");
    const [show, setShow] = useState(false);




    const componentRef = useRef(null);

    const showPrintForm = async () => {
        setShow(true);
        console.log(data);

        // sales, dt1, dt2
        const salesData = data.sales;
        const salesD1 = new Date(data.dt1);
        const salesD2 = new Date(data.dt2);

        const searchSale = salesData.filter(sale => {
            const dataDate = new Date(sale.dt);
            return dataDate >= salesD1 && dataDate <= salesD2;
        })

        const total = searchSale.reduce((t, c) => t + parseFloat(c.total), 0);

        setSales(searchSale);
        setGtTaka(total);
        setD1(salesD1);
        setD2(salesD2);
    }

    const closePrintForm = () => {
        setShow(false);
    }

    const pageStyle = `@media print {
            @page {
                size: A4 portrait;
                margin: 0.5in;
                @bottom-right {
                    content: counter(page) " of " counter(pages);
                }
            }
            footer{
                page-break-after: always;
            }    
            #noPrint{
                display:none;
            }  
            #page{
                font-size: 12px;
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
                                <h1 className="mt-[30px] text-center font-bold uppercase text-[20px]">SALES REPORTS</h1>
                                <p className="text-center">Period: {formatedDateDot(new Date(d1), true)}-{formatedDateDot(new Date(d2), true)}</p>
                                <p className="text-center">Date: {formatedDateDot(new Date(), true)}</p>

                                <br />
                                <div className="w-full h-auto p-1 overflow-auto">
                                    <table className="w-full text-[12px] border border-gray-400">
                                        <thead>
                                            <tr className="w-full bg-gray-200 border border-gray-400">
                                                <th className="text-center px-2 py-2">Date</th>
                                                <th className="text-start px-2 py-2">Customer</th>
                                                <th className="text-start px-2 py-2">Item</th>
                                                <th className="text-center px-2 py-2">Shipment</th>
                                                <th className="text-end px-2 py-2">Weight</th>
                                                <th className="text-end px-2 py-2">Rate</th>
                                                <th className="text-end px-2 py-2">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sales.length ? (
                                                sales.map((sale, i) => (
                                                    <tr className="border border-gray-400 hover:bg-gray-100" key={i}>
                                                        <td className="text-center px-2 py-0.5">{formatedDateDot(sale.dt, true)}</td>
                                                        <td className="text-start px-2 py-0.5">{sale.customer}</td>
                                                        <td className="text-start px-2 py-0.5">{sale.item}</td>
                                                        <td className="text-center px-2 py-0.5">{sale.shipment}</td>
                                                        <td className="text-end px-2 py-0.5">{numberWithComma(sale.weight, true)}</td>
                                                        <td className="text-end px-2 py-0.5">{numberWithComma(sale.rate, true)}</td>
                                                        <td className="text-end px-2 py-0.5">{numberWithComma(sale.total, true)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="text-center py-10 px-4">
                                                        Data not available.
                                                    </td>
                                                </tr>
                                            )}

                                            <tr className="font-bold border border-gray-400 hover:bg-gray-100">
                                                <td className="text-center px-2 py-0.5"></td>
                                                <td className="text-start px-2 py-0.5">Total</td>
                                                <td className="text-center px-2 py-0.5"></td>
                                                <td className="text-center px-2 py-0.5"></td>
                                                <td className="text-center px-2 py-0.5"></td>
                                                <td className="text-center px-2 py-0.5"></td>
                                                <td className="text-end px-2 py-0.5">{numberWithComma(gtTaka, true)}</td>
                                            </tr>

                                        </tbody>
                                    </table>

                                    <br />
                                    <br />
                                    <p><span className="font-bold">Note: </span>Thank you for choosing us</p>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            )}
            <button onClick={showPrintForm} className="text-center mx-0.5 px-4 py-2 bg-gray-600 hover:bg-gray-800 text-white font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300  cursor-pointer">Print Form</button>
        </>
    )
}
export default PrintPage;
