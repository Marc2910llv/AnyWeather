import { Routes, Route } from 'react-router-dom'

//Import the components
import { Home, Locations, ErrorScreen, NavigateHeader } from '../components'

const RouterApp = () => {
    return (
        <>
            <NavigateHeader />{/*Put the header fixed on top*/}
            <Routes> {/*Create routes for every desired component*/}
                <Route path='/' element={<Home />} />
                <Route path='/locations' element={<Locations />} />
                <Route path='*' element={<ErrorScreen />} />
            </Routes>
        </>
    )
}

export default RouterApp;

