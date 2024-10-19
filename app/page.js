"use client";
import React, { useEffect, useState } from "react";
import { BtnSubmit, TextEn, TextPw } from "@/components/Form";
import { useRouter } from "next/navigation";
import { getDataFromFirebaseForLog, uploadDataToFirebase } from "@/lib/firebaseFunction";
import { wgi2024_unittypes } from "@/lib/wgi2024";


export default function Home() {
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
      router.push('/dashboard');
    }
  };





  const ddget = async () => {
    const data = await getDataFromFirebaseForLog('unittype');
    const obj = data[0];
    const keys = Object.keys(obj);
    let str = "";
    for (let i = 0; i < keys.length - 1; i++) {
      str += `${keys[i]}: ${keys[i]},\n`;
    }
    str += `${keys[keys.length - 1]}: ${keys[keys.length - 1]}`;
    console.log(str);
  }




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
