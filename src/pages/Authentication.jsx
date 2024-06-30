import React from 'react'
import {Logo} from "../assets"
import Footer from '../containers/Footer'
import { AuthButtonProvider } from '../components'
import { FaGithub, FaGoogle } from 'react-icons/fa'
const Authentication = () => {
  return (
    <div className='auth-section'>
        <img className='size-10 h-auto object-contain' src={Logo} alt = "logo"/>
      <div className='m-auto flex flex-col flex-1 items-center justify-center gap-6'>
        <h1 className='text-3xl lg:text-4xl text-yellow-300'>Welcome to Resume Builder</h1>
        <p className=' text-slate-400'>Build your resume in minutes</p>
        
        <div className='w-full lg:w-96 p-2 rounded-md flex flex-col items-center justify-start gap-6'>
            <AuthButtonProvider Icon={FaGoogle} label={"Sign in using Google"} provider={"GoogleAuthProvider"}/>
            <AuthButtonProvider Icon={FaGithub} label={"Sign in using GitHub"} provider={"GitHubAuthProvider"}/>
        </div>

      </div>

      <Footer/>
    </div>
  )
}

export default Authentication

