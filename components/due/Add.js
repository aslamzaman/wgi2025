import React, { useState } from "react";
import { TextEn, BtnSubmit, DropdownEn, TextNum, TextDt } from "@/components/Form";
import { addDataToFirebase, getDataFromFirebase } from "@/lib/firebaseFunction";
import { formatedDate } from "@/lib/utils";



const Add = ({ message, id }) => {
    const [dt, setDt] = useState('');
    const [cashtypeId, setCashtypeId] = useState('');
    const [bank, setBank] = useState('');
    const [chequeNo, setChequeNo] = useState('');
    const [chequeDt, setChequeDt] = useState('');
    const [taka, setTaka] = useState('');

    const [show, setShow] = useState(false);
    const [pointerEvent, setPointerEvent] = useState(true);
    //---------------------------------------------------
    const [cashtypes, setCashtypes] = useState([]);
    const [bankShow, setBankShow] = useState(false);



    const resetVariables = () => {
        setDt(formatedDate(new Date()));
        setCashtypeId('1yECAMtHPz31hACNVq3j');
        setBank('');
        setChequeNo('');
        setChequeDt(formatedDate(new Date()));
        setTaka('');
        setBankShow(false);
    }


    const showAddForm = async () => {
        setShow(true);
        resetVariables();
        try {
            const responseCashtype = await getDataFromFirebase("cashtype");
            setCashtypes(responseCashtype);
        } catch (error) {
            console.error('Failed to fetch delivery data:', error);
        }
    }


    const closeAddForm = () => {
        setShow(false);
    }


    const createObject = () => {
        return {
            customerId: id,
            dt: dt,
            cashtypeId: cashtypeId,
            bank: bank,
            chequeNo: chequeNo,
            chequeDt: chequeDt,
            taka: taka,
            createdAt: new Date().toISOString()
        }
    }


    const saveHandler = async (e) => {
        e.preventDefault();
        try {
            setPointerEvent(false);
            const newObject = createObject();
            const msg = await addDataToFirebase("payment", newObject);
            message(msg);
        } catch (error) {
            console.error("Error saving payment data:", error);
            message("Error saving payment data.");
        } finally {
            setShow(false);
        }
    }


    const cashTypeHandler = (e) => {
        const event = e.target.value;
        setCashtypeId(event);
        if (event === "1yECAMtHPz31hACNVq3j" || event === "") {
            setBankShow(false);
            setBank(" ");
            setChequeNo("0");
            setChequeDt("1970-01-01");
        } else {
            setBankShow(true);
            setBank("");
            setChequeNo("");
            setChequeDt(formatedDate(new Date()));
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
                                    <DropdownEn Title="Cashtype" Id="cashtypeId" Change={cashTypeHandler} Value={cashtypeId}>
                                        {cashtypes.length ? cashtypes.map(cashtype => <option value={cashtype.id} key={cashtype.id}>{cashtype.name}</option>) : null}
                                    </DropdownEn>
                                    {bankShow ? (
                                        <>
                                            <TextEn Title="Bank" Id="bank" Change={e => setBank(e.target.value)} Value={bank} Chr={50} />
                                            <TextEn Title="Cheque No." Id="chequeNo" Change={e => setChequeNo(e.target.value)} Value={chequeNo} Chr={50} />
                                            <TextDt Title="Cheque Date" Id="chequeDt" Change={e => setChequeDt(e.target.value)} Value={chequeDt} />
                                        </>) : null}

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
            )}
            <button onClick={showAddForm} title="Payments" className="w-7 h-7 flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                    <path d="M12 6V18" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M15 9.5C15 8.11929 13.6569 7 12 7C10.3431 7 9 8.11929 9 9.5C9 10.8807 10.3431 12 12 12C13.6569 12 15 13.1193 15 14.5C15 15.8807 13.6569 17 12 17C10.3431 17 9 15.8807 9 14.5" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>
        </>
    )
}
export default Add;

