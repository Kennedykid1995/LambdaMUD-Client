import React, { Component } from 'react';
import { NavLink} from 'react-router-dom';
import styled from 'styled-components'

const AppHeader = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin: auto; 
  padding: 10px;  
  border-bottom: 10px solid #DCEDC2; 
`
const NavItem = styled(NavLink)`
    color: black;
    text-decoration: none;
    padding:5px;
    font-size: 20px; 
    &:hover {
        background-color:black;
        color: white;
        border-radius: 5px; 
      }
`
class Home extends Component{
    render(){
        return(
        <AppHeader>
        <>
          <NavItem className="nav-item" to="/registration">New User</NavItem>
          <NavItem className="nav-item" to="/login">Login</NavItem>
        </>
        </AppHeader>
        )
    }
}

export default Home; 