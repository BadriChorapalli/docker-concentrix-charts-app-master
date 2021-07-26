import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import {Dashboard,Charts} from '../pages'
import Login from '../pages/login/Login';
import useToken from './useToken';

import 'bootstrap/dist/css/bootstrap.min.css'


function App() {
    const { token, setToken } = useToken();
    if(!token) {
        return <Login setToken={setToken} />
      }
    return (
        <Router>
            <NavBar />
            <Switch>
                

                <Route path="/charts/dashboard" exact component={Dashboard} />
                
                <Route path="/charts/manage" exact component={Charts} />
                
                
            </Switch>
        </Router>
    )
}

export default App
