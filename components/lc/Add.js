import React, { useState } from "react";
import { TextEn, BtnSubmit, TextDt, TextNum, DropdownEn} from "@/components/Form";
import { addDataToFirebase, getDataFromFirebase } from "@/lib/firebaseFunction";
import { formatedDate } from "@/lib/utils";


const Add = ({ message }) => {
    const [dt, setDt] = useState('');
    const [lcNo, setLcNo] = useState('');
    const [qty, setQty] = useState('');
    const [unittypeId, setUnittypeId] = useState('');
    const [taka, setTaka] = useState('');

    const [show, setShow] = useState(false);
    const [pointerEvent, setPointerEvent] = useState(true);
    //---------------------------------------------
    const [unittypes, setUnittypes] = useState([]);



    const showAddForm = async () => {
        setShow(true);
        resetVariables();
        //-----------------------------
        try {
            const responseUnittype = await getDataFromFirebase("unittype");
            setUnittypes(responseUnittype);
        } catch (error) {
            console.error('Failed to fetch delivery data:', error);
        }
    }


    const closeAddForm = () => {
        setShow(false);
    }


    const resetVariables = () => {
        setDt(formatedDate(new Date()));
        setLcNo('');
        setQty('');
        setUnittypeId('');
        setTaka('');
    }


    const createObject = () => {
        return {
            dt: dt,
            lcNo: lcNo,
            qty: qty,
            unittypeId: unittypeId,
            taka: taka,
            createdAt: new Date().toISOString()
        }
    }


    const saveHandler = async (e) => {
        e.preventDefault();
        try {
            setPointerEvent(false);
            const newObject = createObject();
            const msg = await addDataToFirebase("lc", newObject);
            message(msg);
        } catch (error) {
            console.error("Error saving lc data:", error);
            message("Error saving lc data.");
        } finally {
            setPointerEvent(true);
            setShow(false);
        }
    }


    return (
        <>
            {show && (
                <div className="fixed inset-0 px-4 py-16 bg-black bg-opacity-30 backdrop-blur-sm z-10 overflow-y-scroll">
                    <div className="w-full sm:w-11/12 md:w-9/12 lg:w-7/12 xl:w-1/2 mb-10 mx-auto mb-20 bg-white border-2 border-gray-300 rounded-md shadow-md duration-500">
                        <div className="px-4 md:px-6 py-4 flex justify-between items-center border-b border-gray-300 rounded-t-md">
                            <h1 className="text-xl font-bold text-blue-600">Add New Data</h1>
                            <button onClick={closeAddForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 pb-6 border-0 text-black">
                            <div className="w-full overflow-auto">
                                <div className="p-4">
                                    <form onSubmit={saveHandler}>
                                        <div className="grid grid-cols-1 gap-4">
                                            <TextDt Title="Date" Id="dt" Change={e => setDt(e.target.value)} Value={dt} />
                                            <TextEn Title="LcNo" Id="lcNo" Change={e => setLcNo(e.target.value)} Value={lcNo} Chr={50} />
                                            <TextNum Title="Qty" Id="qty" Change={e => setQty(e.target.value)} Value={qty} />
                                            <DropdownEn Title="Unittype" Id="unittypeId" Change={e => setUnittypeId(e.target.value)} Value={unittypeId}>
                                                {unittypes.length ? unittypes.map(unittype => <option value={unittype.id} key={unittype.id}>{unittype.name}</option>) : null}
                                            </DropdownEn>
                                            <TextNum Title="Taka" Id="taka" Change={e => setTaka(e.target.value)} Value={taka} />
                                        </div>
                                        <div className={`w-full mt-4 flex justify-start ${pointerEvent ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                                            <input type="button" onClick={closeAddForm} value="Close" className="bg-pink-600 hover:bg-pink-800 text-white text-center mt-3 mx-0.5 px-4 py-2 font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 cursor-pointer" />
                                            <BtnSubmit Title="Save" Class="bg-blue-600 hover:bg-blue-800 text-white" />
                                        </div>
                                    </form>
                                </div>
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

