import React, { useEffect } from 'react'
import {Logo} from "../assets"
import Footer from '../containers/Footer'
import { AuthButtonProvider, MainSpinner } from '../components'
import { FaGithub, FaGoogle } from 'react-icons/fa'
import useUser from '../hooks/useUser'
import { useNavigate } from 'react-router-dom'
const Authentication = () => {
    const {data , isLoading , isError , refetch} = useUser();
    const navigate = useNavigate();
    useEffect(()=>{
        if(!isLoading && data){
            navigate('/' , {replace:true})
        }
    },[isLoading , data])
    if(isLoading){
      return <MainSpinner />;
    }
  return (
    <div className='auth-section'>
        <img className='size-10 h-auto object-contain' src={Logo} alt = "logo"/>
      <div className='m-auto flex flex-col flex-1 items-center justify-center gap-6'>
        <h1 className='text-3xl lg:text-4xl text-yellow-300'>Welcome to Resume Builder</h1>
        <p className=' text-slate-400'>Build your resume in minutes</p>
        
        <div className='w-full lg:w-96 p-2 rounded-md flex flex-col items-center justify-start gap-6'>
            <AuthButtonProvider Icon={FaGoogle} label={"Sign in using Google"} provider={"GoogleAuthProvider"}/>
            {/* <AuthButtonProvider Icon={FaGithub} label={"Sign in using GitHub"} provider={"GithubAuthProvider"}/> */}
        </div>

      </div>
     

      <Footer/>
    </div>
  )
}

export default Authentication

