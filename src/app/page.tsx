"use client";
import {Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
export default function Home() {

  const {data:session}=authClient.useSession();
const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const onSubmit=()=>{
  authClient.signUp.email({
    email,
    name,
    password
  },{
    onError:()=>{
      window.alert("Error creating user");
    },
    onSuccess:()=>{
      window.alert("User created successfully");
      
    }
  })
}


const onSignin=()=>{
  authClient.signIn.email({
    email,
    password
  },{
    onError:()=>{
      window.alert("Error in signing user");
    },
    onSuccess:()=>{
      window.alert("User signes in successfully");
      
    }
  })
}

if(session){
  return(
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
      <p className="text-gray-600">You are logged in with email: {session.user.email}</p>
      <Button onClick={()=>authClient.signOut()} className="mt-4">
        Sign Out
        </Button>
    </div>
  )
}

  return(
    <div>
    <div className="p-4 flex flex-col gap-4">
      <Input placeholder="name " value={name} onChange={(e)=>setName(e.target.value)}/>
      <Input placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
      <Input placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
  
  <Button onClick={onSubmit} className="w-full">
    Create user
  </Button>

    </div>

    <div className="p-4 flex flex-col gap-4">
      
      <Input placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
      <Input placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
  
  <Button onClick={onSignin} className="w-full">
    sign in
  </Button>

    </div>

    </div>
      
  )
}