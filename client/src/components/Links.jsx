import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Collapse = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

const List = styled.div.attrs({
    className: 'navbar-nav mr-auto',
})``

const Item = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

class Links extends Component {
    render() {
        return (
            <React.Fragment>
                <Link to="/" className="navbar-brand">
                   Concentrix Chart ApplicationV0.1
                </Link>
                <Collapse>
                    <List>
                        <Item>
                            <Link to="/charts/dashboard" className="nav-link">
                               Dashboard
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/charts/manage" className="nav-link">
                                Manage Charts
                            </Link>
                        </Item>
                        
                    </List>
                </Collapse>
            </React.Fragment>
        )
    }
}

export default Links
