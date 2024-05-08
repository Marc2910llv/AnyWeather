/* eslint-disable no-unused-vars */
import React from "react";
import { Routes, Route } from 'react-router-dom'
import { Home, Locations, ErrorScreen, NavigateHeader } from '../components'

const RouterApp = () => {
    return (
        <>
            <NavigateHeader />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/locations' element={<Locations />} />
                <Route path='*' element={<ErrorScreen />} />
            </Routes>
        </>
    )
}

export default RouterApp;