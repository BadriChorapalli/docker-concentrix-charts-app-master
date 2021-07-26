import React, { Component } from 'react'
import styled from 'styled-components'

import Logo from './Logo'
import Links from './Links'

const Container = styled.div.attrs({
    className: 'container',
})`
    height: 90px;
    max-width:99% !important;
    padding:10px !important;
    margin-top:10px !important;
`

const Nav = styled.nav.attrs({
    className: 'navbar navbar-expand-lg navbar-dark concentrix-bg-dark',
})`
    margin-bottom: 20 px;
`

class NavBar extends Component {
    render() {
        return (
            <Container>
                <Nav>
                    <Logo />
                    <Links />
                </Nav>
            </Container>
        )
    }
}

export default NavBar
