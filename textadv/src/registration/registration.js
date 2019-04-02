import React, { Component } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
//---KeyFrames---//
const hmove = keyframes`
    0% {
    left: -5px;
    }
    100% {
    left: 550px;
    }
`;
const vmove = keyframes`
    0% {
    top: -5px;
    }
    100% {
    top:578px;
    }
`;
//---Components---//
const RegHolder = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  box-sizing: border-box;

`;
const OuterBox = styled.div`
  width: 500px;
  height: 500px;
  overflow: hidden;
  margin: 50px auto;
  box-sizing: border-box;

`;
const RegBox = styled.div`
    display: flex;
    flex-direction: column;
    border: 5px solid white;
    position: relative; 
    width: 500px; 
    height: 500px;
    box-sizing: border-box;

`;
const BarTop = styled.div`
    position: absolute; 
    width: 150px;
    height: 5px;
    background: #2F9599;
    transition: all 1s linear;
    animation: ${hmove} 1s both infinite;
    top: -5px;
    left: -5px;
    box-sizing: border-box;

`;
const BarBottomDelay = styled.div`
  position: absolute;
  width: 150px;
  height: 5px;
  background: #FF4E50;
  transition: all 1s linear;
  animation: ${hmove} 1s both infinite;
  animation-delay: 0.5s;
  bottom: -5px;
  left: -5px;
  box-sizing: border-box;

`;
const BarRightDelay = styled.div`
  position: absolute;
  width: 150px;
  height: 5px;
  background: #F9D423;
  transition: all 1s linear;
  animation: ${vmove} 1s both infinite;
  animation-delay: 0.5s;
  top: 18px;
  right: -75px;
  transform: rotate(90deg);
  box-sizing: border-box;

`;
const BarLeft = styled.div`
  position: absolute;
  width: 150px;
  height: 5px;
  background: #cbf747;
  transition: all 1s linear;
  animation: ${vmove} 1s both infinite;
  top: 18px;
  left: -75px;
  transform: rotate(90deg);
  box-sizing: border-box;
`;
const InputBox = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;
  margin: auto;
`;
const Input = styled.input`
  width: 450px;
  height: 30px;
  margin: 20px;
  text-fill-color: white !important;
  text-decoration: none;
`;
const Btn = styled.button`
    width: 400px
`
class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //create empty objects for the registration.
      username: "",
      password1: "",
      password2: ""
    };
  }
  //allows for change in the input.
  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  //the registerHandler handles the registration of a new user.
  //before you move onto the the .post you must check the two passwords
  //being passed in, and they need to be the same inorder to register.
  //in the post once the passwords are the same and the username has not
  //been used post the new username and password to the api/registration page.
  //.then use the loginHandler from App.js, which is passed in as
  //login, this is used to register the user. generates a key and also username.
  //then push the info to ./game page and also save the info in the history object.
  //then reset the inputs on the registration page to blank.

  registerHandler = event => {
    event.preventDefault();
    if (this.state.password1 === this.state.password2) {
      axios
        .post("https://textadv.herokuapp.com/api/registration", {
          username: this.state.username,
          password1: this.state.password1,
          password2: this.state.password2
        })
        .then(response => {
          console.log(response.data);
          this.props.login(response.data.key, this.state.username);
          this.props.history.push("/game");
        })
        .catch(error => {
          console.log(error.response);
          alert(error.response.data.error);
        });
    }
    this.setState({ username: "", password1: "", password2: "" });
  };

  render() {
    return (
      <OuterBox>
        <RegBox>
          <h1>Join the fun,</h1>
          <h1>Create a User</h1>
          <InputBox className="registration-form">
            <Input
              name="username"
              placeholder="Username"
              value={this.state.username}
              onChange={this.changeHandler}
            />
            <Input
              name="password1"
              placeholder="Password"
              value={this.state.password1}
              onChange={this.changeHandler}
            />
            <Input
              name="password2"
              placeholder="Re-type Password"
              value={this.state.password2}
              onChange={this.changeHandler}
            />
            {/* <Route path="/games" render={props => <Game {...props}/>} /> */}
            <Btn className="registration-btn" onClick={this.registerHandler}>Play</Btn>
          </InputBox>
        </RegBox>
      </OuterBox>
    );
  }
}
export default Registration;
