import React, { useState } from "react";
import { TextEn, BtnSubmit, TextDt, DropdownEn, TextEnDisabled, TextNum } from "@/components/Form";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
const date_format = dt => new Date(dt).toISOString().split('T')[0];



const Add = ({ message }) => {
    const [dt, setDt] = useState('');
    const [receiveNo, setReceiveNo] = useState('');
    const [receivedFrom, setReceivedFrom] = useState('');
    const [taka, setTaka] = useState('');
    const [cashtypeId, setCashtypeId] = useState('');
    const [bankName, setBankName] = useState('');
    const [chequeNo, setChequeNo] = useState('');
    const [chequeDt, setChequeDt] = useState('');
    const [purpose, setPurpose] = useState('');
    const [contact, setContact] = useState('');

    const [show, setShow] = useState(false);
    const [cashtypes, setCashtypes] = useState([]);
    const [bankShow, setBankShow] = useState(false);



    const resetVariables = () => {
        setDt(date_format(new Date()));
        setReceiveNo(Math.round(Date.now() / 60000));
        setReceivedFrom('');
        setTaka('');
        setCashtypeId('');
        setBankName('');
        setChequeNo('');
        setChequeDt(date_format(new Date()));
        setPurpose('');
        setContact('');
        // -------------------------
        setBankShow(false);
    }


    const showAddForm = async () => {
        setShow(true);
        resetVariables();
        try {
            const responseCashtype = await getDataFromFirebase('cashtype');
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
            dt: dt,
            receiveNo: receiveNo,
            receivedFrom: receivedFrom,
            taka: taka,
            cashtypeId: cashtypeId,
            bankName: bankName,
            chequeNo: chequeNo,
            chequeDt: chequeDt,
            purpose: purpose,
            contact: contact
        }
    }


    const saveHandler = async (e) => {
        e.preventDefault();
        try {
            const newObject = createObject();
            const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/moneyreceipt`;
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newObject)
            };
            const response = await fetch(apiUrl, requestOptions);
            if (response.ok) {
                message(`Moneyreceipt is created at ${new Date().toISOString()}`);
            } else {
                throw new Error("Failed to create moneyreceipt");
            }
        } catch (error) {
            console.error("Error saving moneyreceipt data:", error);
            message("Error saving moneyreceipt data.");
        } finally {
            setShow(false);
        }
    }

    const cashtypeChangeHandler = (e) => {
        let event = e.target.value;

        setCashtypeId(event);
        if (event === "65ede63629c4f0b23474c123") {
            setBankName('');
            setChequeNo('');
            setChequeDt(date_format(new Date()));
            setBankShow(true);
        } else {
            setBankName(' ');
            setChequeNo(' ');
            setChequeDt(date_format(new Date()));
            setBankShow(false);
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
                                <div className="grid grid-cols-2 gap-4 my-4">
                                    <TextDt Title="Date" Id="dt" Change={e => setDt(e.target.value)} Value={dt} />
                                    <TextEnDisabled Title="Receipt No" Id="receiveNo" Change={e => setReceiveNo(e.target.value)} Value={receiveNo} Chr={50} />
                                    <TextEn Title="Received From" Id="receivedFrom" Change={e => setReceivedFrom(e.target.value)} Value={receivedFrom} Chr={50} />
                                    <TextEn Title="Contact" Id="contact" Change={e => setContact(e.target.value)} Value={contact} Chr={50} />
                                    <TextNum Title="Taka" Id="taka" Change={e => setTaka(e.target.value)} Value={taka} Chr={50} />

                                    <DropdownEn Title="Cashtype" Id="cashtypeId" Change={cashtypeChangeHandler} Value={cashtypeId}>
                                        {cashtypes.length ? cashtypes.map(cashtype => <option value={cashtype._id} key={cashtype._id}>{cashtype.name}</option>) : null}
                                    </DropdownEn>
                                    {bankShow ? (<>
                                        <TextEn Title="Bank Name" Id="bankName" Change={e => setBankName(e.target.value)} Value={bankName} Chr={50} />
                                        <TextEn Title="Cheque No" Id="chequeNo" Change={e => setChequeNo(e.target.value)} Value={chequeNo} Chr={50} />
                                        <TextDt Title="Cheque Date" Id="chequeDt" Change={e => setChequeDt(e.target.value)} Value={chequeDt} />
                                    </>) : null}
                                    <TextEn Title="Purpose" Id="purpose" Change={e => setPurpose(e.target.value)} Value={purpose} Chr={50} />
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

