
const Edit = (tbl, datas) => {

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
        if (i < data.length - 1) {
            if (i > 0) {
                i === (data.length - 2)
                    ? dd = dd + `                                        <TextEn Title="${titleCase(d)}" Id="${d}" Change={e => set${FirstCap(d)}(e.target.value)} Value={${d}} Chr={50} />`
                    : dd = dd + `                                        <TextEn Title="${titleCase(d)}" Id="${d}" Change={e => set${FirstCap(d)}(e.target.value)} Value={${d}} Chr={50} />\n`;
            }
        }
    }
    );


    let stateVar = "";
    data.map((d, i) => {
        if (i < data.length - 1) {
            if (i > 0) {
                i === (data.length - 2)
                    ? stateVar = stateVar + `        const [${d}, set${FirstCap(d)}] = useState('');`
                    : stateVar = stateVar + `        const [${d}, set${FirstCap(d)}] = useState('');\n`
            }
        }
    }
    );



    let stateClear = "";
    data.map((d, i) => {
        if (i > 0) {
            i === (data.length - 1)
                ? stateClear = stateClear + `                    set${FirstCap(d)}('');`
                : stateClear = stateClear + `                    set${FirstCap(d)}('');\n`
        }
    }
    );

    let getData = "";
    data.map((d, i) => {
        if (i > 0) {
            i === (data.length - 1)
                ? getData = getData + `                    set${titleCase(d)}(response.data.${d});`
                : getData = getData + `                    set${titleCase(d)}(response.data.${d});\n`
        }
    }
    );


    let getValue = "";
    data.map((d, i) => {
        if (i < data.length - 1) {
            if (i > 0) {
                i === (data.length - 2)
                    ? getValue = getValue + `              ${d}: ${d}`
                    : getValue = getValue + `              ${d}: ${d},\n`
            }
        }
    }
    );

    //------------------------------------------------------------------------------
    let sowFormMongoData = '';
    let sowFormMongo = "";
    data.map((d, i) => {
        if (i < data.length - 1) {
            if (i > 0) {
                i === (data.length - 2)
                    ? sowFormMongo += `${d}`
                    : sowFormMongo += `${d}, `
            }
        }
    }
    );

    let sowFormMongop = "";
    data.map((d, i) => {
        if (i < data.length - 1) {
            if (i > 0) {
                i === (data.length - 2)
                    ? sowFormMongop += `${d}: ''`
                    : sowFormMongop += `${d}: '', `
            }
        }
    }
    );

    sowFormMongoData = '             const { ' + sowFormMongo + ' } = data.find(' + tbl + ' => ' + tbl + '._id === id) || { ' + sowFormMongop + ' };' + '\n'

    let sowFormMongo2 = "";
    data.map((d, i) => {
        if (i < data.length - 1) {
            if (i > 0) {
                i === (data.length - 2)
                    ? sowFormMongo2 += `             set${FirstCap(d)}(${d});`
                    : sowFormMongo2 += `             set${FirstCap(d)}(${d});` + `\n`
            }
        }
    }
    );
    sowFormMongoData += sowFormMongo2;

    //------------------------------------------------------------------------------


    //----------------------------------------------------------------
    let saveStr = '';
    saveStr += 'const newObject = createObject();' + '\n';
    saveStr += '                const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/' + tbl + '/${id}`;' + '\n';
    saveStr += '                const requestOptions = {' + '\n';
    saveStr += '                    method: "PUT",' + '\n';
    saveStr += '                    headers: { "Content-Type": "application/json" },' + '\n';
    saveStr += '                    body: JSON.stringify(newObject)' + '\n';
    saveStr += '                };' + '\n';

    saveStr += '                const response = await fetch(apiUrl, requestOptions);' + '\n';
    saveStr += '                if (response.ok) {' + '\n';
    saveStr += '                    message(`Updated successfully completed at ${new Date().toISOString()}`);' + '\n';
    saveStr += '                } else {' + '\n';
    saveStr += '                    throw new Error("Failed to create ' + tbl + '");' + '\n';
    saveStr += '                }';


    let localSave = '';
    localSave += '              const newObject = createObject();' + '\n';
    localSave += '              const response = addItem("' + tbl + '", newObject);' + '\n';
    localSave += '              message(response.message);' + '\n';

    //----------------------------------------------------------------


    const str = `    import React, { useState } from "react";
    import { TextEn, BtnSubmit } from "@/components/Form";
           
    
    const Edit = ({ message, id, data }) => {        
${stateVar}        
        const [show, setShow] = useState(false);
    
    
        const showEditForm =  () => {
            setShow(true);
${sowFormMongoData}             
        };
    
    
        const closeEditForm = () => {
            setShow(false);
        };
    
    
        const createObject = () => {
            return {
${getValue}                
            }
        }
    

        const saveHandler = async (e) => {
            e.preventDefault();
            try {
                ${saveStr} 
            } catch (error) {
                console.error("Error saving ${tbl} data:", error);
                message("Error saving ${tbl} data.");
            }finally {
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
${dd}                                        
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
    
  
    `;

    return str;
}

export default Edit;