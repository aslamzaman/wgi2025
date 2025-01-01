import React, { useState } from "react";
import { BtnSubmit, DropdownEn, TextNum, TextDt } from "@/components/Form";
import { getDataFromFirebase, updateDataToFirebase } from "@/lib/firebaseFunction";
import { formatedDate, sortArray } from "@/lib/utils";


const Edit = ({ message, id, data }) => {
    const [customerId, setCustomerId] = useState('');
    const [shipment, setShipment] = useState('');
    const [itemId, setItemId] = useState('');
    const [dt, setDt] = useState('');
    const [bale, setBale] = useState('');
    const [than, setThan] = useState('');
    const [meter, setMeter] = useState('');
    const [weight, setWeight] = useState('');
    const [rate, setRate] = useState('');
    const [createdAt, setCreatedAt] = useState('');

    const [show, setShow] = useState(false);
    const [pointerEvent, setPointerEvent] = useState(true);

    const [customers, setCustomers] = useState([]);
    const [items, setItems] = useState([]);



    const showEditForm = async () => {
        setShow(true);

        try {
            const [responseCustomer, responseItem] = await Promise.all([
                getDataFromFirebase('customer'),
                getDataFromFirebase('item')
            ]);

            const sortedCustomer = responseCustomer.sort((a,b)=>sortArray(a.name.toUpperCase(), b.name.toUpperCase()));
            const sortedIems = responseItem.sort((a,b)=>sortArray(a.name.toUpperCase(), b.name.toUpperCase()));

            setCustomers(sortedCustomer);
            setItems(sortedIems);

            //---------------------------------------------
            const { customerId, shipment, itemId, dt, bale, than, meter, weight, rate, createdAt } = data;
            setCustomerId(customerId);
            setShipment(shipment);
            setItemId(itemId);
            setDt(formatedDate(dt));
            setBale(bale);
            setThan(than);
            setMeter(meter);
            setWeight(weight);
            setRate(rate);
            setCreatedAt(createdAt);
        } catch (error) {
            console.error('Failed to fetch delivery data:', error);
        }

    };


    const closeEditForm = () => {
        setShow(false);
    };


    const createObject = () => {
        const period = sessionStorage.getItem('yr');
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
            yrs: period,
            createdAt: createdAt
        }
    }


    const saveHandler = async (e) => {
        e.preventDefault();
        try {
            setPointerEvent(false);
            const newObject = createObject();
            const msg = await updateDataToFirebase("sale", id, newObject);
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


