import React from 'react'
import { FaChevronRight } from 'react-icons/fa'
import { GoogleAuthProvider, GithubAuthProvider, signInWithRedirect , signInWithPopup } from 'firebase/auth';

import { auth } from '../config/firebase.config';

const AuthButtonProvider = ({Icon , label , provider}) => {
    // const googleAuthProvider = new GoogleAuthProvider();
    // const githubAuthProvider = new GithubAuthProvider();
    
    const handleClick = async(e)=>{
        const pro = await new GoogleAuthProvider();
        return await signInWithPopup(auth , pro)
        // switch(provider){
        //     case 'GoogleAuthProvider':
        //         await signInWithRedirect(auth, googleAuthProvider).then((result)=>{
        //             console.log("Result : ",result);
        //         }).catch(err =>{
        //             console.log(`Error : ${err.Message}`);
        //         })
        //         break;
        //     case "GithubAuthProvider":
        //         await signInWithRedirect(auth, githubAuthProvider).then((result)=>{
        //             console.log("Result : ",result);
        //         }).catch(err =>{
        //             console.log(`Error : ${err.Message}`);
        //         })
        //         break;
        //     default:
        //         await signInWithRedirect(auth, googleAuthProvider).then((result)=>{
        //             console.log("Result : ",result);
        //         }).catch(err =>{
        //             console.log(`Error : ${err.Message}`);
        //         })
        //         break;
        // }
    }
  return (
    <div onClick={handleClick} className='w-full px-4 py-3 rounded-md border-2 cursor-pointer border-slate-600 flex items-center justify-between group hover:bg-blue-500 active:scale-95 duration-150 hover:shadow-md'>
        <Icon className='text-txtPrimary text-xl group-hover:text-white' />
        <p className='text-blue-400 text-lg group-hover:text-white' >
            {label}
        </p>
        <FaChevronRight className='text-blue-400 text-base group-hover:text-white ' />
      
    </div>
  )
}

export default AuthButtonProvider
