import React, { Component } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
//---KeyFrames---//
const hmove = keyframes`
    0% {
    left: -5px;
    }
    100% {
    left: 500px;
    }
`;
const vmove = keyframes`
    0% {
    top: -5px;
    }
    100% {
    top:528px;
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
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //create three different objects, two that are empty strings.
      //and one that is a boolean.
      username: "",
      password: "",
      loggedIn: false
    };
  }
  //not sure if I even need this componentDidMount. Looks like it is
  //doing the same thing as the handleLogin.
  componentDidMount = () => {
    let token = localStorage.getItem("token");
    let username = localStorage.getItem("username");
    if (token && username) {
      this.setState({ loggedIn: true });
    }
  };
  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  //handleLogin is very similar to the registration, the url is different.
  //you will send the two objects passed in username and the password.
  //in the .then
  //use the passed in loginHandler passed in as login.
  //retrieve the key and the username with the ones passed in from the inputs.
  //change the state of the loggedin to true.
  //save to history and push to ./game.
  handleLogin = event => {
    event.preventDefault();
    console.log("lansnjscnk");
    axios
      .post("https://textadv.herokuapp.com/api/login", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        console.log(response, "response line 50 of log in");
        this.props.login(response.data.key, this.state.username);
        this.setState({ loggedIn: true });
        this.props.history.push("/game");
      })
      .catch(error => {
        console.log(error.response);
        alert(error.response.data.error);
      });
    this.setState({ username: "", password: "" });
  };

  render() {
    return (
      <RegHolder>
        <OuterBox>
          <RegBox>
            <h1>Welcome Back,</h1>
            <h1>Login</h1>
            <InputBox className="login-form" onSubmit={this.handleLogin}>
              <Input
                placeholder="Username"
                name="username"
                value={this.state.username}
                onChange={this.changeHandler}
              />
              <Input
                type="password"
                placeholder="Password"
                name="password"
                value={this.state.password}
                onChange={this.changeHandler}
              />
              <Btn className="login-btn">Play</Btn>
            </InputBox>
          </RegBox>
        </OuterBox>
      </RegHolder>
    );
  }
}

export default Login;
