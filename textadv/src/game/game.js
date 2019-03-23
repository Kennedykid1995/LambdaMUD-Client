import React, { Component } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Pusher from "pusher-js";
import axios from "axios";

const GamePage = styled.div`
  width: 100%;
  display: flex;
  height: auto;
  margin: auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const GameHolder = styled.div`
  width: 95%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const ContentHolder = styled.div`
  width: auto;
  height: auto;
  margin: 15px;
`;
const TextBox = styled.div`
  display: flex;
  text-align: left;
  width: 100%;
  height: 350px;
  border: 3px solid #2F9599;
  border-radius: 20px;
  background: white;
  margin: 5px;
  overflow-y: auto;
`;
const SideBox = styled.div`
  display: flex;
  text-align: left;
  padding: 5px;
  width: 250px;
  height: 350px;
  border: 3px solid #F9D423;
  border-radius: 20px;
  background: white;
  margin: 5px;
  display: flex;
  flex-direction: column;
`;
const GameInput = styled.input`
    width: 100%;
    display: flex; 
    margin: 5px;
    height: 40px;
    border-radius: 10px; 
    text-decoration: none
    border: 3px solid #FC913A;
`;
const ConvoInvo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  border-radius: 20px;
  margin: 5px;
  background: white;
  border: 3px solid #FF4E50;
`;
const Room = styled.div`
  padding: 5px;
`;
const TextBoxItem = styled.div`
  margin: 5px 0;
`;
const PlayerItem = styled.div`
  margin: 5px 0;
  color: blue;
`;
const Msg = styled.div`
  margin: 5px 0;
  color: red;
`;
const NavItem = styled(NavLink)`
  color: black;
  text-decoration: none;
  padding: 3px;
  font-size: 30px;
`;
class Game extends Component {
  constructor() {
    super();
    this.state = {
      //establish the different state objects that will use the necessary information from api.
      user: "",
      input: "",
      title: "",
      description: "",
      past: [],
      players: [],
      loggedIn: true
    };
  }

  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  //pusher is used to gain access to the api, from the pusher website.
  //using the APP_KEY from the pusher channel that you established
  //and the cluster: us2. Bind that with the new channel that you want to
  //suscribe to 'p-channel'.
  pusher = uuid => {
    const p = new Pusher("f2508e405db0f184782c", { cluster: "us2" });
    const channel = p.subscribe(`p-channel-${uuid}`, uuid);
    channel.bind("broadcast", data => {
      this.updatePast(data.message);
    });
  };
  //updatePast is storing all of the past locations and movements,
  //essectially everything that you have seen or had inputted will
  //be stored. Then create a newItem object which will be what the
  //new state will be set to.
  updatePast = (message = null) => {
    const past = this.state.past;
    let newItem;
    if (message !== null) {
      newItem = { message: message };
    } else {
      newItem = {
        user: this.state.user,
        title: this.state.title,
        description: this.state.description,
        players: this.state.players
      };
    }
    past.unshift(newItem);
    this.setState({ past: past });
  };
  //massage will send messages so that other players can see them.
  //again you must create a object that has access to the token from local storage
  //post whatever the message is to the api, but make sure it is the right route.
  //the message will now be equal to whatever is put into the input.
  //.then will change the state of input and also add whatever the new
  //input is and post it in updatePast.
  message = event => {
    event.preventDefault();
    if (this.state.input === "") {
      return;
    }
    const key = localStorage.getItem("token");
    axios
      .post(
        "https://textadv.herokuapp.com/api/adv/say/",
        { message: this.state.input },
        {
          headers: {
            Authorization: `Token ${key}`,
            "Content-Type": "application/json"
          }
        }
      )
      .then(response => {
        console.log("say");
        this.setState(
          {
            input: ""
          },
          () => this.updatePast(response.data.message)
        );
      })
      .catch(err => console.log(err));
  };
  //componentDidMount is access the api to get the information avaliable on it.
  //once the get has gone through successfully, you can move on to the then.
  //the .then will user this.pusher to get the data from the uuid, api.
  //and also you must change the state of the title, description, and players objects.
  //but also call updatePast at the end so that you can push information into it.
  componentDidMount = () => {
    const key = localStorage.getItem("token");
    console.log(key, "this is the key");
    axios
      .get("https://textadv.herokuapp.com/api/adv/init/", {
        headers: { Authorization: `Token ${key}` }
      })
      .then(response => {
        this.pusher(response.data.uuid);
        this.setState(
          {
            user: response.data.user,
            title: response.data.title,
            description: response.data.description,
            players: response.data.players
          },
          () => this.updatePast()
        );
      })
      .catch(err => console.log(err, "cdm"));
    window.addEventListener("keydown", this.KeyDown);
  };
  //all that Keydown is doing is allowing the user to use the arrow keys
  //to move around the map.
  KeyDown = event => {
    const code = event.keyCode;
    const mapping = { 37: "w", 38: "n", 39: "e", 40: "s" };
    if (code in mapping) {
      const direction = mapping[code];
      this.move(direction);
    }
  };
  //move is another post function that send the new directions the
  //player takes. This function allows there to
  //be a new location sent to the user. the new location corresponds with the
  //right direction. You must get the token, then post the new direction.
  //if all of that goes through correctly .then is what happens.
  //.then will change the state of the current objects. moving their location.
  //also again updating the updatePast function.
  move = direction => {
    const key = localStorage.getItem("token");
    axios
      .post(
        "https://textadv.herokuapp.com/api/adv/move/",
        { direction: direction },
        {
          headers: {
            Authorization: `Token ${key}`,
            "Content-Type": "application/json"
          }
        }
      )
      .then(response => {
        if (response.data.error_msg) {
          this.updatePast(response.data.error_msg);
        } else {
          this.setState(
            {
              user: response.data.user,
              title: response.data.title,
              description: response.data.description,
              players: response.data.players
            },
            () => this.updatePast()
          );
        }
      })
      .catch(err => console.log(err));
  };
  logout = e => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    this.setState({
      loggedIn: false,
      user: ""
    });
  };

  render() {
    const past = this.state.past.slice().reverse();
    return (
      <GamePage>
        <GameHolder>
          <ContentHolder>
            <SideBox>
              <h2> Movements:</h2>
              <p>You will use your arrow keys to move around the rooms.</p>
              <p>North ---- ↑</p>
              <p>South ---- ↓</p>
              <p>East ---- →</p>
              <p>West ---- ←</p>
            </SideBox>
          </ContentHolder>
          <ContentHolder>
            <TextBox>
              <div>
                {past.map(pastItem => {
                  if (pastItem["message"]) {
                    return (
                      <Room key={Math.random()}>
                        <Msg>{pastItem.message}</Msg>
                      </Room>
                    );
                  } else {
                    return (
                      <Room key={Math.random()}>
                        <TextBoxItem>{pastItem.title}</TextBoxItem>
                        <TextBoxItem>{pastItem.description}</TextBoxItem>
                        <PlayerItem>
                          Players in room: {pastItem.players.join(", ")}
                        </PlayerItem>
                      </Room>
                    );
                  }
                })}
              </div>
            </TextBox>
            <form onSubmit={this.message}>
              <GameInput
                placeholder="Message other players"
                onChange={this.changeHandler}
                value={this.state.input}
                name="input"
              />
            </form>
            <ConvoInvo>
              <form onSubmit={this.logout}>
                <NavItem className="logout-btn" to="/">Logout</NavItem>
              </form>
            </ConvoInvo>
          </ContentHolder>
          <ContentHolder>
            <SideBox>
              <h2> Keep an eye out for:</h2>
              <p>Locations: will appear in Green </p>
              <p>Players: will appear in Blue</p>
              <p>Messages: will appear in red</p>
              <h3> Keep an eye out for:</h3>
              If you logout of the game your place will be saved when last
              entered.
            </SideBox>
          </ContentHolder>
        </GameHolder>
      </GamePage>
    );
  }
}

export default Game;
