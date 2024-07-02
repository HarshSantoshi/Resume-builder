import React, { Suspense } from 'react'
import {Header, MainSpinner} from '../components'
import { Route, Routes } from 'react-router-dom'
import {HomeContainer} from '../containers'
import {CreateResume, CreateTemplate, TemplateDesignDetail, UserProfile} from '../pages'
import Footer from '../containers/Footer'

const HomeScreen = () => {
  return (
    <div className='w-full flex items-center justify-center flex-col'>
      <Header/>
      <main className='w-full"'>
        <Suspense fallback={<MainSpinner/>}>
        <Routes>
          <Route path='/' element={<HomeContainer/>} />
          <Route path='/template/create' element={<CreateTemplate/>} />
          <Route path='/profile/:uid' element={<UserProfile/>} />
          <Route path='/resume/*' element={<CreateResume/>} />
          <Route path='/resumedetail/:templateID' element={<TemplateDesignDetail/>} />
        </Routes>
        </Suspense>
        <Footer/>
      </main>
    </div>
  )
}

export default HomeScreen
