import React, { useState } from "react";
import { TextEn, BtnSubmit, DropdownEn, TextNum } from "@/components/Form";
import { getDataFromFirebase } from "@/lib/firebaseFunction";


const Edit = ({ message, id, data }) => {
    const [employeeId, setEmployeeId] = useState('');
    const [month, setMonth] = useState('');
    const [taka, setTaka] = useState('');
    const [deduct, setDeduct] = useState('');
    const [arear, setArear] = useState('');
    const [note, setNote] = useState('');
    const [show, setShow] = useState(false);
    const [employees, setEmployees] = useState([]);

    const showEditForm = async () => {
        setShow(true);
        try {
            const responseEmployee = await getDataFromFirebase('employee');
            setEmployees(responseEmployee);
            const { employeeId, month, taka, deduct, arear, note } = data.find(salary => salary._id === id) || { employeeId: '', month: '', taka: '', deduct: '', arear: '', note: '' };
            setEmployeeId(employeeId._id);
            setMonth(month);
            setTaka(taka);
            setDeduct(deduct);
            setArear(arear);
            setNote(note);
        } catch (error) {
            console.error('Failed to fetch delivery data:', error);
        }

    };


    const closeEditForm = () => {
        setShow(false);
    };


    const createObject = () => {
        return {
            employeeId: employeeId,
            month: month,
            taka: taka,
            deduct: deduct,
            arear: arear,
            note: note
        }
    }


    const saveHandler = async (e) => {
        e.preventDefault();
        try {
            const newObject = createObject();
            const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/salary/${id}`;
            const requestOptions = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newObject)
            };
            const response = await fetch(apiUrl, requestOptions);
            if (response.ok) {
                message(`Updated successfully completed at ${new Date().toISOString()}`);
            } else {
                throw new Error("Failed to create salary");
            }
        } catch (error) {
            console.error("Error saving salary data:", error);
            message("Error saving salary data.");
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
                                <DropdownEn Title="Employee" Id="employeeId" Change={e=> setEmployeeId(e.target.value)} Value={employeeId}>
                                        {employees.length?employees.map(employee=><option value={employee._id} key={employee._id}>{employee.name}</option>):null}
                                    </DropdownEn>

                                    <DropdownEn Title="Month" Id="month" Change={e => setMonth(e.target.value)} Value={month}>
                                        {monthArray.length?monthArray.map((mn,i)=><option value={mn.opt} key={i}>{mn.nm}</option>):null}
                                    </DropdownEn>
                                    <TextNum Title="Taka" Id="taka" Change={e => setTaka(e.target.value)} Value={taka} />
                                    <TextNum Title="Deduct" Id="deduct" Change={e => setDeduct(e.target.value)} Value={deduct} />
                                    <TextNum Title="Arear" Id="arear" Change={e => setArear(e.target.value)} Value={arear} />
                                    <TextEn Title="Note" Id="note" Change={e => setNote(e.target.value)} Value={note} Chr={50}  />  
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


