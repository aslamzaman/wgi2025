"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/employee/Add";
import Edit from "@/components/employee/Edit";
import Delete from "@/components/employee/Delete";
// import Print from "@/components/employee/Print";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { formatedDateDot, sortArray } from "@/lib/utils";



const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const [employees, posts] = await Promise.all([
                    getDataFromFirebase("employee"),
                    getDataFromFirebase("post")
                ]);


                const joinCollection = employees.map(employee => {
                    return {
                        ...employee,
                        post: posts.find(post => post.id === employee.postId) || {}
                    }
                });

                const sortedData = joinCollection.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));
                console.log(sortedData);
                setEmployees(sortedData);
                setWaitMsg('');
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getData();
    }, [msg]);


    const messageHandler = (data) => {
        setMsg(data);
    }


    return (
        <>
            <div className="w-full mb-3 mt-8">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Employee</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>
            <div className="px-4 lg:px-6">
                <div className="p-4 overflow-auto">
                    <table className="w-full border border-gray-200">
                        <thead>
                            <tr className="w-full bg-gray-200">
                                <th className="text-center border-b border-gray-200 px-4 py-1">Name</th>
                                <th className="text-center border-b border-gray-200 px-4 py-1">Address</th>
                                <th className="text-center border-b border-gray-200 px-4 py-1">Contact</th>
                                <th className="text-center border-b border-gray-200 px-4 py-1">Join Date</th>
                                <th className="text-center border-b border-gray-200 px-4 py-1">Post</th>
                                <th className="text-center border-b border-gray-200 px-4 py-1">Salary</th>
                                <th className="w-[95px] border-b border-gray-200 px-4 py-2">
                                    <div className="w-[90px] h-[45px] flex justify-end space-x-2 p-1 font-normal">
                                        {/* <Print data={employees} /> */}
                                        <Add message={messageHandler} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length ? (
                                employees.map(employee => (
                                    <tr className="border-b border-gray-200 hover:bg-gray-100" key={employee.id}>
                                        <td className="text-center py-1 px-4">{employee.name}</td>
                                        <td className="text-center py-1 px-4">{employee.address}</td>
                                        <td className="text-center py-1 px-4">{employee.contact}</td>
                                        <td className="text-center py-1 px-4">{formatedDateDot(employee.joinDt, true)}</td>
                                        <td className="text-center py-1 px-4">{employee.post.name}</td>
                                        <td className="text-center py-1 px-4">{employee.salary}</td>
                                        <td className="text-center py-2">
                                            <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                                <Edit message={messageHandler} id={employee.id} data={employee} />
                                                <Delete message={messageHandler} id={employee.id} data={employee} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-10 px-4">
                                        Data not available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

};

export default Employee;

