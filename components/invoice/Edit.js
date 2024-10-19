import React, { useState } from "react";
import { TextEn, BtnSubmit } from "@/components/Form";
       

const Edit = ({ message, id, data }) => {        
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [dt, setDt] = useState('');
    const [shipment, setShipment] = useState('');
    const [deduct, setDeduct] = useState('');
    const [payment, setPayment] = useState('');
    const [items, setItems] = useState('');        
    const [show, setShow] = useState(false);


    const showEditForm =  () => {
        setShow(true);
         const { invoiceNumber, customerId, dt, shipment, deduct, payment, items } = data.find(invoice => invoice._id === id) || { invoiceNumber: '', customerId: '', dt: '', shipment: '', deduct: '', payment: '', items: '' };
         setInvoiceNumber(invoiceNumber);
         setCustomerId(customerId);
         setDt(dt);
         setShipment(shipment);
         setDeduct(deduct);
         setPayment(payment);
         setItems(items);             
    };


    const closeEditForm = () => {
        setShow(false);
    };


    const createObject = () => {
        return {
          invoiceNumber: invoiceNumber,
          customerId: customerId,
          dt: dt,
          shipment: shipment,
          deduct: deduct,
          payment: payment,
          items: items                
        }
    }


    const saveHandler = async (e) => {
        e.preventDefault();
        try {
            const newObject = createObject();
            const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/invoice/${id}`;
            const requestOptions = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newObject)
            };
            const response = await fetch(apiUrl, requestOptions);
            if (response.ok) {
                message(`Updated successfully completed at ${new Date().toISOString()}`);
            } else {
                throw new Error("Failed to create invoice");
            } 
        } catch (error) {
            console.error("Error saving invoice data:", error);
            message("Error saving invoice data.");
        }finally {
            setShow(false);
        }
    }


    return (
        <>
            {show && (
                <div className="fixed inset-0 py-16 bg-black bg-opacity-30 backdrop-blur-sm z-10 overflow-auto">
                    <div className="w-11/12 md:w-1/2 mx-auto mb-10 bg-white border-2 border-gray-300 rounded-md shadow-md duration-300">
                        <div className="px-6 md:px-6 py-2 flex justify-between items-center border-b border-gray-300">
                            <h1 className="text-xl font-bold text-blue-600">Edit Existing Data</h1>
                            <button onClick={closeEditForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                           </svg>
                          </button>

                        </div>

                        <div className="px-6 pb-6 text-black">
                            <form onSubmit={saveHandler} >
                                <div className="grid grid-cols-1 gap-4 my-4">
                                    <TextEn Title="Invoicenumber" Id="invoiceNumber" Change={e => setInvoiceNumber(e.target.value)} Value={invoiceNumber} Chr={50} />
                                    <TextEn Title="Customerid" Id="customerId" Change={e => setCustomerId(e.target.value)} Value={customerId} Chr={50} />
                                    <TextEn Title="Dt" Id="dt" Change={e => setDt(e.target.value)} Value={dt} Chr={50} />
                                    <TextEn Title="Shipment" Id="shipment" Change={e => setShipment(e.target.value)} Value={shipment} Chr={50} />
                                    <TextEn Title="Deduct" Id="deduct" Change={e => setDeduct(e.target.value)} Value={deduct} Chr={50} />
                                    <TextEn Title="Payment" Id="payment" Change={e => setPayment(e.target.value)} Value={payment} Chr={50} />
                                    <TextEn Title="Items" Id="items" Change={e => setItems(e.target.value)} Value={items} Chr={50} />                                        
                                </div>
                                <div className="w-full flex justify-start">
                                <input type="button" onClick={closeEditForm} value="Close" className="bg-pink-600 hover:bg-pink-800 text-white text-center mt-3 mx-0.5 px-4 py-2 font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 cursor-pointer" />
                                <BtnSubmit Title="Save" Class="bg-blue-600 hover:bg-blue-800 text-white" />
                                </div>
                            </form>
                        </div>


                    </div >
                </div >
            )}
            <button onClick={showEditForm} title="Edit" className="px-1 py-1 hover:bg-teal-300 rounded-md transition duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 stroke-black hover:stroke-blue-800 transition duration-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
            </button>
        </>
    )
}
export default Edit;


