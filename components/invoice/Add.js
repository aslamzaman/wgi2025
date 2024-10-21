import React, { useState } from "react";
import { TextEn, BtnSubmit, TextDt, TextBnDisabled, DropdownEn } from "@/components/Form";


import { formatedDate, localStorageDeleteItem, localStorageGetItem } from "@/lib/utils";
import AddLocalItem from "./AddLocalItem";
import { addDataToFirebase, getDataFromFirebase } from "@/lib/firebaseFunction";


const Add = ({ message }) => {
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [dt, setDt] = useState('');
    const [shipment, setShipment] = useState('');
    const [deduct, setDeduct] = useState('');
    const [payment, setPayment] = useState('');



    const [show, setShow] = useState(false);
    const [pointerEvent, setPointerEvent] = useState(true);

    //------------------------------------------------
    const [customers, setCustomers] = useState([]);  // dropdown 
    //------------------------------------------------------

    const [localItems, setLocalItems] = useState([]);  // Local storage items
    const [msg, setMsg] = useState("");



    const resetVariables = () => {
        const inv = Date.now() / 60000;
        setInvoiceNumber(Math.round(inv));
        setCustomerId('');
        setDt(formatedDate(new Date()));
        setShipment('');
        setDeduct('');
        setPayment('');
    }


    const showAddForm = async () => {
        setShow(true);
        resetVariables();
        //------------------------------------------------
        setLocalItems(localStorageGetItem('localItem'));
        setMsg('');
        try {
            const responseCustomer = await getDataFromFirebase('customer');
            setCustomers(responseCustomer);
        } catch (error) {
            console.error('Failed to fetch delivery data:', error);
        }
    }


    const closeAddForm = () => {
        setShow(false);
    }


    const createObject = () => {
        const getLocalData = localStorageGetItem('localItem');
        return {
            invoiceNumber: invoiceNumber,
            customerId: customerId,
            dt: dt,
            shipment: shipment,
            deduct: deduct,
            payment: payment,
            items: getLocalData,
            createdAt: new Date().toISOString()
        }
    }


    const saveHandler = async (e) => {
        e.preventDefault();
        const getLocalData = localStorageGetItem('localItem');
        if (getLocalData.length < 1) {
            setMsg("No Items!");
            return false;
        }


        try {
            setPointerEvent(false);
            const newObject = createObject();
            const msg = await addDataToFirebase("invoice", newObject);
            message(msg);
            
            localStorage.removeItem('localItem');
        } catch (error) {
            console.error("Error saving invoice data:", error);
            message("Error saving invoice data.");
        } finally {
            setPointerEvent(true);
            setShow(false);
        }
    }



    //--------------------------------------------------

    const messageHandler = (data) => {
        setMsg(data);
        setLocalItems(localStorageGetItem('localItem'));
    }


    const removeLocalItemHandeler = (id) => {
        console.log(id);
        const deleteData = localStorageDeleteItem('localItem', id);
        setLocalItems(localStorageGetItem('localItem'));
        setMsg(deleteData);
    }



    return (
        <>
            {show && (
                <div className="fixed inset-0 py-16 bg-black bg-opacity-30 backdrop-blur-sm z-10 overflow-auto">
                    <div className="w-11/12 md:w-1/2 mx-auto mb-10 bg-white border-2 border-gray-300 rounded-md shadow-md duration-300">
                        <div className="px-6 md:px-6 py-2 flex justify-between items-center border-b border-gray-300">
                            <h1 className="text-xl font-bold text-blue-600">Add New</h1>
                            <button onClick={closeAddForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="px-6 pb-6 text-black">
                            <form onSubmit={saveHandler}>
                                <div className="grid grid-cols-2 gap-2 my-1">
                                    <TextBnDisabled Title="Invoice Number (Auto)" Id="invoiceNumber" Change={e => setInvoiceNumber(e.target.value)} Value={invoiceNumber} Chr={50} />
                                    <DropdownEn Title="Customer" Id="customerId" Change={e => setCustomerId(e.target.value)} Value={customerId}>
                                        {customers.length ? customers.map(customer => <option value={customer.id} key={customer.id}>{customer.name}</option>) : null}
                                    </DropdownEn>
                                    <TextDt Title="Date" Id="dt" Change={e => setDt(e.target.value)} Value={dt} />
                                    <TextEn Title="Shipment" Id="shipment" Change={e => setShipment(e.target.value)} Value={shipment} Chr={50} />
                                    <TextEn Title="Deduct" Id="deduct" Change={e => setDeduct(e.target.value)} Value={deduct} Chr={50} />
                                    <TextEn Title="Payment" Id="payment" Change={e => setPayment(e.target.value)} Value={payment} Chr={50} />

                                </div>
                                <div className={`w-full mt-4 flex justify-start ${pointerEvent ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                                    <input type="button" onClick={closeAddForm} value="Close" className="bg-pink-600 hover:bg-pink-800 text-white text-center mt-3 mx-0.5 px-4 py-2 font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 cursor-pointer" />
                                    <BtnSubmit Title="Save" Class="bg-blue-600 hover:bg-blue-800 text-white" />
                                    <p className="mt-5 ml-4 text-red-600">{msg}</p>
                                </div>
                            </form>
                            <div className="w-full overflow-auto">
                                <table className="w-full border border-gray-200">
                                    <thead>
                                        <tr className="w-full bg-gray-200">
                                            <th className="text-center border-b border-gray-200 px-4 py-2">Item</th>
                                            <th className="text-center border-b border-gray-200 px-4 py-2">Bal</th>
                                            <th className="text-center border-b border-gray-200 px-4 py-2">Thn</th>
                                            <th className="text-center border-b border-gray-200 px-4 py-2">Mtr</th>
                                            <th className="text-center border-b border-gray-200 px-4 py-2">Wgt</th>
                                            <th className="text-center border-b border-gray-200 px-4 py-2">Rate</th>
                                            <th className="w-[100px] font-normal">
                                                <div className="w-full flex justify-end py-0.5 pr-1">
                                                    <AddLocalItem message={messageHandler} />
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {localItems.length ? (
                                            localItems.map(item => (
                                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={item.id}>
                                                    <td className="text-center py-2 px-4">{item.itemName}</td>
                                                    <td className="text-center py-2 px-4">{item.bale}</td>
                                                    <td className="text-center py-2 px-4">{item.than}</td>
                                                    <td className="text-center py-2 px-4">{item.meter}</td>
                                                    <td className="text-center py-2 px-4">{item.weight}</td>
                                                    <td className="text-center py-2 px-4">{item.taka}</td>
                                                    <td className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                                        <button onClick={() => removeLocalItemHandeler(item.id)} className="w-6 h-6 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : null}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={showAddForm} className="px-1 py-1 bg-blue-500 hover:bg-blue-700 rounded-md transition duration-500" title="Add New">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-7 h-7 stroke-white hover:stroke-gray-100">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        </>
    )
}
export default Add;

