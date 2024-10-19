"use client";
import React, { useState } from "react";
import dashboard from "@/public/images/landing/dashboard.jpg";
import Image from "next/image";


const Item = () => {
    const [items, setItems] = useState([]);
    const [msg, setMsg] = useState("Data ready");


    
    return (
        <>
            <div className="w-full my-6 lg:my-8">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Dashboard</h1>
                <Image src={dashboard} alt="dashboard" width={399.1} height={261.8} priority={true} className="w-11/12 h-auto mx-auto" />
            </div>    
          
        </>
    );

};

export default Item;


