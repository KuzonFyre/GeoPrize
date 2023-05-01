import React from 'react'
import { useState } from "react";
import {db,auth} from '../firebase'
import { useNavigate, useParams} from "react-router-dom";
import {collection, doc, setDoc,getDoc} from "firebase/firestore";


export const Contracts = () => {
  // const smartContractRef = doc(collection(db, "smartcontracts"), "contract");

  // async function addDoc(){
  //   console.log("adding doc");
  //   return await setDoc(smartContractRef, {
  //     address: "0xF7F13262a14C12b36E774211F1C0610479552Afc"
  //   }, { merge: true });
  // }
async function get(){
  console.log(auth.currentUser);
  if(auth.currentUser != null){
  const docRef = doc(db, "users", auth.currentUser.uid);
  (await getDoc(docRef)).exists() ? console.log("exists") : console.log("does not exist");
  setDoc(docRef, { name: "Los Angeles" ,isAdmin: true});

  }
}

  return (
    <div>
      <h1>Contracts</h1>
      <button onClick={() => get()}>button</button>
    </div>
  );
};


