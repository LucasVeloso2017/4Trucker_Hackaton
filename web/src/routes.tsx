import { Route, BrowserRouter} from 'react-router-dom'
import React from 'react'

import Home from './pages/Home'
import Point from './pages/CreatePoint'


const Routes = () => {
    return (
    <BrowserRouter>
        <Route path='/' component={Home} exact/>
        <Route path='/create-point' component={Point}/>
    </BrowserRouter>
    );
}

export default Routes;