"use client";
import React, { useEffect, useState } from "react";
import { BtnSubmit, DropdownEn, TextEn, TextPw } from "@/components/Form";
import { useRouter } from "next/navigation";
import { getDataFromFirebase, getDataFromFirebaseForLog, uploadDataToFirebase } from "@/lib/firebaseFunction";
import { wgi2024_unittypes } from "@/lib/wgi2024";


export default function Home() {
  const [yr, setYr] = useState("");
  const [user, setUser] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");

  const [userData, setUserData] = useState([]);

  const router = useRouter();



  useEffect(() => {
    setUser('');
    setPw('');
    const loadUser = async () => {
      setMsg("Please wait..");
      try {
        const data = await getDataFromFirebaseForLog('user');
        setUserData(data);
        setMsg("");
      } catch (error) {
        console.error("Error fetching data:", error);
        setMsg("Failed to fetch data");
      }
    }
    loadUser();

  }, [])

  const submitHandler = (e) => {
    e.preventDefault();
    const result = userData.find(u => u.user_name === user && u.pw === pw);
    if (result === undefined) {
      setMsg("User Name or Passord wrong!");
      setUser('');
      setPw('');
    } else {
      sessionStorage.setItem('log', 1);
      sessionStorage.setItem('yr', yr);
      router.push('/dashboard');
    }
  };



/*
  const ddget = async () => {

    const allCollections = "borrower,cashtype,customer,employee,invoice,item,lc,loan,loanpayment,moneyreceipt,payment,post,salary,sale,shipment,supplier,unittype";
    const sp = allCollections.split(',');
    const result = await Promise.all(sp.map(async (s)=>{
      return{
        [s]: await getDataFromFirebase(s)
      }
    }));
   
    console.log(result);
  }

*/

/*
  const dd = async () => {
    for (let i = 0; i < wgi2024_unittypes.length; i++) {
      const id = wgi2024_unittypes[i].id;
      const obj = {
        createdAt: wgi2024_unittypes[i].createdAt,
        name: wgi2024_unittypes[i].name
      }

      const msg = await uploadDataToFirebase('unittype', id, obj);
      console.log(i, msg, id);

    }
  }
*/


  return (
    <div className="px-4 py-20">
      <div className="w-full sm:w-11/12 md:w-9/12 lg:w-1/2 xl:w-5/12 2xl:w-1/3 mx-auto border-2 border-gray-300 rounded-lg shadow-lg">
        <div className="w-full border-b-2">
          <h1 className="py-3 text-center text-2xl font-bold">Log In</h1>
        </div>
     
        <div className="px-4 py-6">
          <p className="py-2 text-center text-red-500">{msg}</p>
          <form onSubmit={submitHandler}>
            <div className="grid grid-cols-1 gap-4">
            <DropdownEn Title="Year" Id="yr" Change={e => setYr(e.target.value)} Value={yr} >
              <option value="all">All</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
              <option value="2030">2030</option>
              <option value="2031">2031</option>
              <option value="2032">2032</option>
              <option value="2033">2033</option>

            </DropdownEn>
              <TextEn Title="User Name" Id="user" Change={e => setUser(e.target.value)} Value={user} Chr={50} />
              <TextPw Title="Password" Id="pw" Change={e => setPw(e.target.value)} Value={pw} Chr={50} />
            </div>
            <BtnSubmit Title="Login" Class="bg-blue-600 hover:bg-blue-800 text-white" />
          </form>
        </div>
      </div>
    </div>
  );
}
