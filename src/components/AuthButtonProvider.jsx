import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { useQueryClient } from 'react-query';
import { auth } from '../config/firebase.config';

const AuthButtonProvider = ({ Icon, label, provider }) => {
  const queryClient = useQueryClient();

  const handleClick = async () => {
    let providerInstance;

    switch (provider) {
      case 'GoogleAuthProvider':
        providerInstance = new GoogleAuthProvider();
        break;
      case 'GithubAuthProvider':
        providerInstance = new GithubAuthProvider();
        break;
      default:
        providerInstance = new GoogleAuthProvider();
        break;
    }

    try {
      const result = await signInWithPopup(auth, providerInstance);
      console.log('Result: ', result);
      // Store the logged-in user information
      queryClient.setQueryData('user', result.user);
    } catch (err) {
      console.error('Error: ', err.message);
    }
  };

  return (
    <div
      onClick={handleClick}
      className='w-full px-4 py-3 rounded-md border-2 cursor-pointer border-slate-600 flex items-center justify-between group hover:bg-blue-500 active:scale-95 duration-150 hover:shadow-md'
    >
      <Icon className='text-blue-500 text-xl group-hover:text-white' />
      <p className='text-blue-400 text-lg group-hover:text-white'>{label}</p>
      <FaChevronRight className='text-blue-400 text-base group-hover:text-white' />
    </div>
  );
};

export default AuthButtonProvider;
