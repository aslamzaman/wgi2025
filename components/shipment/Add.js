import React, { useState } from "react";
import { TextEn, BtnSubmit, DropdownEn, TextDt } from "@/components/Form";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
const date_format = dt => new Date(dt).toISOString().split('T')[0];



const Add = ({ message }) => {
    const [dt, setDt] = useState('');
    const [shipmentNo, setShipmentNo] = useState('');
    const [lcId, setLcId] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [itemId, setItemId] = useState('');
    const [unittypeId, setUnittypeId] = useState('');
    const [qty, setQty] = useState('');
    const [taka, setTaka] = useState('');

    const [show, setShow] = useState(false);
    const [lcs, setLcs] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([]);
    const [unittypes, setUnittypes] = useState([]);



    const resetVariables = () => {
        setDt(date_format(new Date()));
        setShipmentNo('');
        setLcId('');
        setSupplierId('');
        setItemId('');
        setUnittypeId('');
        setQty('');
        setTaka('');
    }


    const showAddForm = async () => {
        setShow(true);
        resetVariables();
        try {
            const responseLc = await getDataFromFirebase('lc');
            setLcs(responseLc);
            const responseSupplier = await getDataFromFirebase('supplier');
            setSuppliers(responseSupplier);
            const responseItem = await getDataFromFirebase('item');
            setItems(responseItem);
            const responseUnittype = await getDataFromFirebase('unittype');
            setUnittypes(responseUnittype);
        } catch (error) {
            console.error('Failed to fetch delivery data:', error);
        }

    }


    const closeAddForm = () => {
        setShow(false);
    }


    const createObject = () => {
        return {
            dt: dt,
            shipmentNo: shipmentNo,
            lcId: lcId,
            supplierId: supplierId,
            itemId: itemId,
            unittypeId: unittypeId,
            qty: qty,
            taka: taka
        }
    }


    const saveHandler = async (e) => {
        e.preventDefault();
        try {
            const newObject = createObject();
            const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/shipment`;
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newObject)
            };
            const response = await fetch(apiUrl, requestOptions);
            if (response.ok) {
                message(`Shipment is created at ${new Date().toISOString()}`);
            } else {
                throw new Error("Failed to create shipment");
            }
        } catch (error) {
            console.error("Error saving shipment data:", error);
            message("Error saving shipment data.");
        } finally {
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
                                    <TextDt Title="Date" Id="dt" Change={e => setDt(e.target.value)} Value={dt} />
                                    <TextEn Title="Shipment No" Id="shipmentNo" Change={e => setShipmentNo(e.target.value)} Value={shipmentNo} Chr={50} />
                                    <DropdownEn Title="LC" Id="lcId" Change={e => setLcId(e.target.value)} Value={lcId}>
                                        {lcs.length ? lcs.map(lc => <option value={lc._id} key={lc._id}>{lc.lcNo}</option>) : null}
                                    </DropdownEn>
                                    <DropdownEn Title="Supplier" Id="supplierId" Change={e => setSupplierId(e.target.value)} Value={supplierId}>
                                        {suppliers.length ? suppliers.map(supplier => <option value={supplier._id} key={supplier._id}>{supplier.name}</option>) : null}
                                    </DropdownEn>
                                    <DropdownEn Title="Item" Id="itemId" Change={e => setItemId(e.target.value)} Value={itemId}>
                                        {items.length ? items.map(item => <option value={item._id} key={item._id}>{item.name}</option>) : null}
                                    </DropdownEn>
                                    <DropdownEn Title="Unit" Id="unittypeId" Change={e => setUnittypeId(e.target.value)} Value={unittypeId}>
                                        {unittypes.length ? unittypes.map(unittype => <option value={unittype._id} key={unittype._id}>{unittype.name}</option>) : null}
                                    </DropdownEn>
                                    <TextEn Title="Quantity" Id="qty" Change={e => setQty(e.target.value)} Value={qty} Chr={50} />
                                    <TextEn Title="Taka" Id="taka" Change={e => setTaka(e.target.value)} Value={taka} Chr={50} />
                                </div>
                                <div className="w-full flex justify-start">
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

