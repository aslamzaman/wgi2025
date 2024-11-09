import React, { useState, useRef } from "react";
import ReactToPrint from "react-to-print";
import { useReactToPrint } from 'react-to-print';


const Print = ({ data }) => {
    const [show, setShow] = useState(false)
    const contentRef = useRef();


    const showPrintForm = () => {
        setShow(true);
    };



    const closePrintForm = () => {
        setShow(false);
    };



    const pageStyle = `@media print {
        @page {
            size: A4 portrait;
            margin: 1in;
        }

        #page{
            font-size: 16px;
            font-family: Arial, Helvetica, sans-serif;
        }
    }`;



    const printButton = () => {
        return <button>Print </button>

    }

    const handlePrint = useReactToPrint({
        content: () => contentRef.current
      });



    return (
        <>
            {show && (
                <div className="fixed inset-0 py-16 bg-black bg-opacity-30 backdrop-blur-sm z-10 overflow-auto">

                    <div className="w-11/12 md:w-3/4 mx-auto mb-10 bg-white border-2 border-gray-300 rounded-md shadow-md duration-300">

                    <button onClick={handlePrint} style={{ marginBottom: '20px' }}>
        Print this Component
      </button>

                        <div className="p-6 text-black">
                            <div id="page" ref={contentRef} className={`w-full h-auto`}>
                                <h1>Aslam Zaman</h1>
                                <h1>Aslam Zaman</h1>
                                <h1>Aslam Zaman</h1>
                                <h1>Aslam Zaman</h1>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={showPrintForm} title="Print">Print</button>
        </>
    )
}
export default Print;



