import React from 'react'
import { FaChevronRight } from 'react-icons/fa'

const AuthButtonProvider = ({Icon , label , provider}) => {
    
    const handleClick = async()=>{
        switch(provider){
            case 'GoogleAuthProvider':
                console.log("INSIDE GOOGLE");
                break;
            case "GitHubAuthProvider":
                console.log("INSIDE GITHUB");
                break;
            default:
                console.log("INSIDE GOOGLE");
                break;
        }
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
