const Page = (tbl, datas) => {

    const titleCase = (str) => {
        return str
            .split(' ')
            .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    const replaceQutation = datas.replaceAll('`', '');
    const splitData = replaceQutation.split(",");
    const data = splitData.map(s => s.trim());



    let thead_string = "";
    data.map((d, i) => {
        if (i < data.length - 1) {
            if (i > 0) {
                i === (data.length - 1)
                    ? thead_string = thead_string + `                                      <th className="text-center border-b border-gray-200 px-4 py-2">${titleCase(d)}</th>`
                    : thead_string = thead_string + `                                      <th className="text-center border-b border-gray-200 px-4 py-2">${titleCase(d)}</th>\n`;
            }
        }
    }
    );


    let td_string = "";
    data.map((d, i) => {
        if (i < data.length - 1) {
            if (i > 0) {
                i === (data.length - 1)
                    ? td_string = td_string + `                                              <td className="text-center py-2 px-4">{${tbl}.${d}}</td>`
                    : td_string = td_string + `                                              <td className="text-center py-2 px-4">{${tbl}.${d}}</td>\n`;
            }
        }
    }
    );


    //-------------------------------
    let loadMongo = "";
    loadMongo += '                    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/' + tbl + '`, {' + '\n';
    loadMongo += '                        method: "GET",' + '\n';
    loadMongo += '                        headers: { "Content-Type": "application/json" }' + '\n';
    loadMongo += '                    });' + '\n';
    loadMongo += '                    if (!response.ok) {' + '\n';
    loadMongo += '                        throw new Error("Failed to fetch data");' + '\n';
    loadMongo += '                    }' + '\n';
    loadMongo += '                    const data = await response.json();' + '\n';
    loadMongo += '                    // console.log(data);\n';
    loadMongo += '                    set' + titleCase(tbl) + 's(data);';
    //-------------

    const str = `    "use client";
    import React, { useState, useEffect } from "react";
    import Add from "@/components/${tbl}/Add";
    import Edit from "@/components/${tbl}/Edit";    
    import Delete from "@/components/${tbl}/Delete";


    const ${titleCase(tbl)} = () => {
        const [${tbl}s, set${titleCase(tbl)}s] = useState([]);
        const [msg, setMsg] = useState("Data ready");
        const [waitMsg, setWaitMsg] = useState("");
    

        useEffect(() => {
            const getData = async () => {
                setWaitMsg('Please Wait...');
                try {
${loadMongo}
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
                    <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">${titleCase(tbl)}</h1>
                    <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                </div>    
                <div className="px-4 lg:px-6">
                    <p className="w-full text-sm text-red-700">{msg}</p>  
                    <div className="p-2 overflow-auto">  
                        <table className="w-full border border-gray-200">
                            <thead>
                                <tr className="w-full bg-gray-200">                           
${thead_string}                                    <th className="w-[100px] font-normal">
                                        <div className="w-full flex justify-end py-0.5 pr-4">
                                            <Add message={messageHandler} />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {${tbl}s.length ?(
                                    ${tbl}s.map(${tbl} => (
                                        <tr className="border-b border-gray-200 hover:bg-gray-100" key={${tbl}._id}>                                           
${td_string}                                            <td className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                                <Edit message={messageHandler} id={${tbl}._id} data={${tbl}s} />
                                                <Delete message={messageHandler} id={${tbl}._id} data={${tbl}s} />
                                            </td>
                                        </tr>
                                    ))
                                ): (
                                    <tr>
                                        <td colSpan={${data.length}} className="text-center py-10 px-4">
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
    
    export default ${titleCase(tbl)};
    
  
    `;

    return str;
}

export default Page;