import React, { useState } from "react";
import { BtnSubmit, DropdownEn, TextNum, TextDt } from "@/components/Form";
import { addDataToFirebase, getDataFromFirebase } from "@/lib/firebaseFunction";
import { formatedDate } from "@/lib/utils";



const Add = ({ message }) => {
    const [customerId, setCustomerId] = useState('');
    const [shipment, setShipment] = useState('');
    const [itemId, setItemId] = useState('');
    const [dt, setDt] = useState('');
    const [bale, setBale] = useState('');
    const [than, setThan] = useState('');
    const [meter, setMeter] = useState('');
    const [weight, setWeight] = useState('');
    const [rate, setRate] = useState('');

    const [show, setShow] = useState(false);
    const [pointerEvent, setPointerEvent] = useState(true);

    //--------------------------------------------

    const [customers, setCustomers] = useState([]);
    const [items, setItems] = useState([]);


    const resetVariables = () => {
        setCustomerId('');
        setShipment('');
        setItemId('');
        setDt(formatedDate(new Date()));
        setBale('');
        setThan('');
        setMeter('');
        setWeight('');
        setRate('');
    }


    const showAddForm = async () => {
        setShow(true);
        resetVariables();
        try {
            const [responseCustomer, responseItem] = await Promise.all([
                getDataFromFirebase('customer'),
                getDataFromFirebase('item')
            ]);
            setCustomers(responseCustomer);
            setItems(responseItem);
        } catch (error) {
            console.error('Failed to fetch delivery data:', error);
        }
    }


    const closeAddForm = () => {
        setShow(false);
    }


    const createObject = () => {
        return {
            customerId: customerId,
            shipment: shipment,
            itemId: itemId,
            dt: dt,
            bale: bale,
            than: than,
            meter: meter,
            weight: weight,
            rate: rate,
            createdAt: new Date().toISOString()
        }
    }


    const saveHandler = async (e) => {
        e.preventDefault();
        try {
            setPointerEvent(false);
            const newObject = createObject();
            const msg = await addDataToFirebase("sale", newObject);
            message(msg);
        } catch (error) {
            console.error("Error saving sale data:", error);
            message("Error saving sale data.");
        } finally {
            setPointerEvent(true);
            setShow(false);
        }
    }




    return (
        <>
            {show && (
                <div className="fixed inset-0 py-16 bg-black bg-opacity-30 backdrop-blur-sm z-10 overflow-auto">
                    <div className="w-11/12 md:w-1/2 mx-auto mb-10 bg-white border-2 border-gray-300 rounded-md shadow-md duration-300">
                        <div className="px-6 md:px-6 py-2 flex justify-between items-center border-b border-gray-300">
                            <h1 className="text-xl font-bold text-blue-600">Add New Data</h1>
                            <button onClick={closeAddForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="px-6 pb-6 text-black">
                            <form onSubmit={saveHandler}>
                                <div className="grid grid-cols-1 gap-4 my-4">
                                    <DropdownEn Title="Customer" Id="customerId" Change={e => setCustomerId(e.target.value)} Value={customerId}>
                                        {customers.length ? customers.map(customer => <option value={customer.id} key={customer.id}>{customer.name}</option>) : null}
                                    </DropdownEn>
                                    <TextNum Title="Shipment" Id="shipment" Change={e => setShipment(e.target.value)} Value={shipment} />
                                    <DropdownEn Title="Item" Id="itemId" Change={e => setItemId(e.target.value)} Value={itemId}>
                                        {items.length ? items.map(item => <option value={item.id} key={item.id}>{item.name}</option>) : null}
                                    </DropdownEn>
                                    <TextDt Title="Date" Id="dt" Change={e => setDt(e.target.value)} Value={dt} />
                                    <TextNum Title="Bale" Id="bale" Change={e => setBale(e.target.value)} Value={bale} />
                                    <TextNum Title="Than" Id="than" Change={e => setThan(e.target.value)} Value={than} />
                                    <TextNum Title="Meter" Id="meter" Change={e => setMeter(e.target.value)} Value={meter} />
                                    <TextNum Title="Weight" Id="weight" Change={e => setWeight(e.target.value)} Value={weight} />
                                    <TextNum Title="Rate" Id="rate" Change={e => setRate(e.target.value)} Value={rate} />
                                </div>
                                <div className={`w-full mt-4 flex justify-start ${pointerEvent ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                                    <input type="button" onClick={closeAddForm} value="Close" className="bg-pink-600 hover:bg-pink-800 text-white text-center mt-3 mx-0.5 px-4 py-2 font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 cursor-pointer" />
                                    <BtnSubmit Title="Save" Class="bg-blue-600 hover:bg-blue-800 text-white" />
                                </div>
                            </form>
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

