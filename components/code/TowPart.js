
const TwoPart = (tbl, datas) => {

    const titleCase = (str) => {
        return str
            .split(' ')
            .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    const replaceQutation = datas.replaceAll('`','');  
    const splitData = replaceQutation.split(",");
    const data = splitData.map(s => s.trim());


    let dd = "";
    data.map((d, i) => {
        if (i > 0) {
            i === (data.length - 1)
                ? dd = dd + `                                      <TextEn Title="${titleCase(d)}" Id="${d}" Change={(e) => set${titleCase(d)}(e.target.value)} Value={${d}} Chr="50" />`
                : dd = dd + `                                      <TextEn Title="${titleCase(d)}" Id="${d}" Change={(e) => set${titleCase(d)}(e.target.value)} Value={${d}} Chr="50" />\n`;
        }
    }
    );


    let stateVar = "";
    data.map((d, i) => {
        if (i > 0) {
            i === (data.length - 1)
                ? stateVar = stateVar + `      const [${d}, set${titleCase(d)}] = useState('');`
                : stateVar = stateVar + `      const [${d}, set${titleCase(d)}] = useState('');\n`
        }
    }
    );



    let stateClear = "";
    data.map((d, i) => {
        if (i > 0) {
            i === (data.length - 1)
                ? stateClear = stateClear + `          set${titleCase(d)}('');`
                : stateClear = stateClear + `          set${titleCase(d)}('');\n`
        }
    }
    );

    let getData = "";
    data.map((d, i) => {
        i === (data.length - 1)
            ? getData = getData + `set${titleCase(d)}(${d});`
            : getData = getData + `set${titleCase(d)}(${d});\n`
    }
    );


    let getValue = "";
    data.map((d, i) => {
        if (i > 0) {
            i === (data.length - 1)
                ? getValue = getValue + `              ${d}: ${d}`
                : getValue = getValue + `              ${d}: ${d},\n`
        }
    }
    );

    let thead_string = "";
    data.map((d, i) => {
        if (i > 0) {
            i === (data.length - 1)
                ? thead_string = thead_string + `                                <th className="text-center border-b border-gray-200 px-4 py-2">${titleCase(d)}</th>`
                : thead_string = thead_string + `                                <th className="text-center border-b border-gray-200 px-4 py-2">${titleCase(d)}</th>\n`;
        }
    }
    );



    let td_string = "";
    data.map((d, i) => {
        if (i > 0) {
            i === (data.length - 1)
                ? td_string = td_string + `                                            <td className="text-center py-2 px-4">{${tbl}.${d}}</td>`
                : td_string = td_string + `                                            <td className="text-center py-2 px-4">{${tbl}.${d}}</td>\n`;
        }
    }
    );



    const str = `"use client";
    import React, { useState, useEffect } from "react";
    import { BtnSubmit, TextDt } from "@/components/Form";
    import Add from "@/components/${tbl}/Add";
    import Edit from "@/components/${tbl}/Edit";   
    import Delete from "@/components/${tbl}/Delete";
    import { jsPDF } from "jspdf";
    import { getItems } from "@/lib/utils/LocalDatabase";
    const date_format = dt => new Date(dt).toISOString().split('T')[0];
    
    
    const ${titleCase(tbl)} = () => {
        const [${tbl}s, set${titleCase(tbl)}s] = useState([]);
        const [msg, setMsg] = useState("Data ready");
        const [waitMsg, setWaitMsg] = useState("");
       
        const [dt, setDt] = useState('');
        const [total, setTotal] = useState(0);
        
        useEffect(() => {
            const load = () => {
                setWaitMsg('Please Wait...');
                try {
                    const response = getItems("${tbl}");
                    const data = response.data;                    
                    const result = data.sort((a, b) => parseInt(b.id) > parseInt(a.id) ? 1 : -1);
                    set${titleCase(tbl)}s(result);

                    //-----------------------------------------------------------------------
                  //  const grandTotal = data.reduce((t, c) => t + (c.qty + c.tk), 0);
                  //  setTotal(grandTotal);
                  setWaitMsg('');
                } catch (error) {
                    console.log(error);
                }
            };
            load();
            setDt(date_format(new Date()));
        }, [msg]);
    
    
        const messageHandler = (data) => {
            setMsg(data);
        }
    

        const createObject = () => {
            return {
                id: Date.now(),        
                dt: dt
            }
        }

    
        const handleCreate = async (e) => {
            e.preventDefault();
            const response = getItems("${tbl}");
            const data = response.data;
    
            if (data.length < 0) {
                setWaitMsg("No data to creating ${tbl}.");
                return false;
            }
            setWaitMsg('Please Wait...');
            try {
                const doc = new jsPDF({
                    orientation: 'p',
                    unit: 'mm',
                    format: 'a4',
                    putOnlyUsedFonts: true,
                    floatPrecision: 16 // or "smart", default is 16
                });
                const newObject = createObject();
                console.log(newObject);
               // doc.save(new Date().toISOString() + "-${titleCase(tbl)}.pdf");  
               setWaitMsg('');             
            } catch (error) {
                console.log(error);
            }
        }
    
    
        return (
            <>
                <div className="w-full mb-3 mt-8">
                    <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">${titleCase(tbl)}</h1>
                    <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                </div>
    
                <div className="px-4 lg:px-6"> 
                    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-y-4 lg:gap-x-4">
                        <div className="w-full border-2 p-4 shadow-md rounded-md">
                            <form onSubmit={handleCreate}>
                                <div className="grid grid-cols-1 gap-2 my-2">
                                    <TextDt Title="Date" Id="dt" Change={(e) => setDt(e.target.value)} Value={dt} />
                                </div>
                                <div className="w-full flex justify-start">
                                    <BtnSubmit Title="Create PDF" Class="bg-blue-600 hover:bg-blue-800 text-white" />
                                </div>
                            </form>
                        </div>                    
                        <div className="w-full col-span-2 border-2 p-4 shadow-md rounded-md">
                            <div className="px-4 lg:px-6 overflow-auto">
                                <p className="w-full text-sm text-red-700">{msg}</p>
                                <table className="w-full border border-gray-200">
                                    <thead>
                                        <tr className="w-full bg-gray-200">
${thead_string}    
                                            <th className="w-[100px] font-normal">
                                                <div className="w-full flex justify-end mt-1 pr-[3px] lg:pr-2">
                                                    <Add message={messageHandler} />
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            ${tbl}s.length ? ${tbl}s.map(${tbl} => {
                                                return (
                                                    <tr className="border-b border-gray-200 hover:bg-gray-100" key={${tbl}.id}>   
${td_string} 
                                                        <td className="flex justify-end items-center mt-1">
                                                            <Edit message={messageHandler} id={${tbl}.id} />
                                                            <Delete message={messageHandler} id={${tbl}.id} />
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                                : null
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };
    
    export default ${titleCase(tbl)};
    
    
    
    `;

    return str;
}

export default TwoPart;