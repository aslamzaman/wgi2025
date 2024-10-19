
const Delete = (tbl, datas) => {

    const titleCase = (str) => {
        return str
            .split(' ')
            .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    const FirstCap = (str) => {
        const firstLetter = str.substr(0, 1);
        const restLetter = str.substr(1, str.length - 1);
        const firstLetterCap = firstLetter.toUpperCase();
        const joinToOne = firstLetterCap + restLetter;
        return joinToOne
    }





    const replaceQutation = datas.replaceAll('`', '');
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
        let x = d === 'isDeleted' ? 'true' : 'false';

        if (i > 0) {
            i === (data.length - 1)
                ? getValue = getValue + `              ${d}: ${d}`
                : getValue = getValue + `              ${d}: ${d},\n`
        }
    }
    );
    let gethardDelete = '';
    for (let n = 0; n < data.length; n++) {
        if (n > 0) {
            let x = data[n] === 'isDeleted' ? true : false;
            gethardDelete = gethardDelete + `                ${data[n]} : ${!x ? data[n] : x}` + `${n===data.length-1?'':',\n'}`
        }
    }
  

    //------------------------------------------------------------------------

    let sowFormMongoData = '';
    sowFormMongoData = '            const { ' + data[1] + ' } = data.find(' + tbl + ' => ' + tbl + '._id === id) || { ' + data[1] + ': "" };' + '\n'

    sowFormMongoData += `            set${FirstCap(data[1])}(${data[1]});`;
    //--------------------------
    let sowFormLocalData = '';
    sowFormLocalData += '               const response = getOne("' + tbl + '", id);' + '\n';
    sowFormLocalData += '               set' + titleCase(data[1]) + '(response.data.' + data[1] + ');' + '\n';

    //------------------------------------------------------------------------------
    let saveStr = '';
    saveStr += '                const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/' + tbl + '/${id}`;' + '\n';
    saveStr += '                const requestOptions = { method: "DELETE" };' + '\n';
    saveStr += '                const response = await fetch(apiUrl, requestOptions);' + '\n';
    saveStr += '                if (response.ok) {' + '\n';
    saveStr += '                    message(`Deleted successfully completed. id: ${id}`);' + '\n';
    saveStr += '                } else {' + '\n';
    saveStr += '                    throw new Error("Failed to delete ' + tbl + '");' + '\n';
    saveStr += '                }';


    let localSave = '';
    localSave += '              const response = deleteItem("' + tbl + '", id);' + '\n';
    localSave += '              message(response.message);';



    //------------------------------------------------------------------------------

    let softStr = '';
    softStr += 'const newObject = createObject();' + '\n';
    softStr += '                const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/' + tbl + '/${id}`;' + '\n';
    softStr += '                const requestOptions = {' + '\n';
    softStr += '                    method: "PUT",' + '\n';
    softStr += '                    headers: { "Content-Type": "application/json" },' + '\n';
    softStr += '                    body: JSON.stringify(newObject)' + '\n';
    softStr += '                };' + '\n';

    softStr += '                const response = await fetch(apiUrl, requestOptions);' + '\n';
    softStr += '                if (response.ok) {' + '\n';
    softStr += '                    message(`Deleted successfully completed. id: ${id}`);' + '\n';
    softStr += '                } else {' + '\n';
    softStr += '                    throw new Error("Failed to create ' + tbl + '");' + '\n';
    softStr += '                }';
    //------------------------------------------

    let urlll = '`${process.env.NEXT_PUBLIC_BASE_URL}/api/'+ tbl + '/${id}`';
    let mss = '`Deleted successfully completed. id: ${id}`';



    const str = `    import React, { useState } from "react";
    import { BtnEn } from "@/components/Form";


    const Delete = ({ message, id, data }) => {
        const [${data[1]}, set${FirstCap(data[1])}] = useState("");   
        const [show, setShow] = useState(false);
    
        const showDeleteForm = () => {
            setShow(true);
${sowFormMongoData} 
        }
    

        const closeDeleteForm = () => {
            setShow(false);           
        }
    
   
        const softDeleteHandler = async () => {
            try {
                const response = await fetch(${urlll}, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
               // console.log(data)
                message(${mss});
            } catch (error) {
                console.error("Error fetching data:", error);
            }finally{
                setShow(false);          
            }
        }
    
/*
        const hardDeleteHandler = async () => {
            try {
${saveStr}         
            } catch (error) {
                console.log(error);
                message("Data deleting error");
            }
            setShow(false);
        }
 */   
    
        return (
            <>
                {show && (
                    <div className="fixed inset-0 py-16 bg-black bg-opacity-30 backdrop-blur-sm z-10 overflow-auto">
                        <div className="w-11/12 md:w-1/2 mx-auto mb-10 bg-white border-2 border-gray-300 rounded-md shadow-md duration-300">
                            <div className="px-6 md:px-6 py-2 flex justify-between items-center border-b border-gray-300">
                                <h1 className="text-xl font-bold text-blue-600">Delete Existing Data</h1>
                                <button onClick={closeDeleteForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                            </div>
                            <div className="p-4 lg:p-6 flex flex-col space-y-4">
                                <div className="w-full">    
                                    <svg height="60" width="60" xmlns="http://www.w3.org/2000/svg" className="bg-white-100 mx-auto">
                                        <path d="M30 3 L3 57 L57 57 Z" className="fill-none stroke-red-700 stroke-[5px]" />
                                        <path d="M30 23 L30 40" className="fill-none stroke-red-700 stroke-[5px]" />
                                        <path d="M30 45 L30 50" className="fill-none stroke-red-700 stroke-[5px]" />
                                    </svg>

                                    <h1 className="text-sm text-center text-gray-600 mt-4">
                                        Are you sure to proceed with the deletion?</h1>
                                    <h1 className="text-center text-gray-600 font-bold">{${data[1]}}</h1>
                                </div>
                                <div className="w-full flex justify-start">
                                    <BtnEn Title="Close" Click={closeDeleteForm} Class="bg-pink-700 hover:bg-pink-900 text-white mr-1" />
                                    <BtnEn Title="Yes Delete" Click={softDeleteHandler} Class="bg-blue-600 hover:bg-blue-800 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <button onClick={showDeleteForm} title="Delete" className="px-1 py-1 hover:bg-red-300 rounded-md transition duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 stroke-black hover:stroke-blue-800 transition duration-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </>
        )
    }
    export default Delete;
    
  
    `;

    return str;
}

export default Delete;