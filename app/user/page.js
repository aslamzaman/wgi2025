"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/user/Add";
import Edit from "@/components/user/Edit";    
import Delete from "@/components/user/Delete";


const User = () => {
    const [users, setUsers] = useState([]);
    const [msg, setMsg] = useState("Data ready");
    const [waitMsg, setWaitMsg] = useState("");
    

    useEffect(() => {
        const fetchData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                console.log(data);
                setUsers(data);
                setWaitMsg('');
            } catch (error) {
                console.error("Error fetching data:", error);
                setMsg("Failed to fetch data");
            }
        };
        fetchData();
    }, [msg]);


    const messageHandler = (data) => {
        setMsg(data);
    }


    return (
        <>
            <div className="w-full my-6 lg:my-8">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">User</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>    
            <div className="px-4 lg:px-6">
                <p className="w-full text-sm text-red-700">{msg}</p>    
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">                           
                                  <th className="text-center border-b border-gray-200 px-4 py-2">User_name</th>
                                  <th className="text-center border-b border-gray-200 px-4 py-2">Pw</th>                                
                            <th className="w-[100px] font-normal">
                                <div className="w-full flex justify-end py-0.5 pr-4">
                                    <Add message={messageHandler} />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length ?(
                            users.map(user => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={user._id}>                                           
                                          <td className="text-center py-2 px-4">{user.user_name}</td>
                                          <td className="text-center py-2 px-4">{user.pw}</td>                                            
                                    <td className="flex justify-end items-center space-x-1 mt-1">
                                        <Edit message={messageHandler} id={user._id} data={users} />
                                        <Delete message={messageHandler} id={user._id} data={users} />
                                    </td>
                                </tr>
                            ))
                        ): (
                            <tr>
                                <td colSpan={3} className="text-center py-10 px-4">
                                    Data not available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );

};

export default User;


