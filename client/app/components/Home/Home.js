import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  getFromStorage,
  setInStorage
} from "../../utils/storage";
// import "../SignUp/SignUp.css";
// import "../login.css";
import AboutCard from '../AboutCard/AboutCard';
import MyMapComponent from "../MyMapComponent/MyMapComponent";


class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signUpError: "",
      signInError: "",
      signInEmail: "",
      signInPassword: "",
      signUpFirstName: "",
      signUpLastName: "",
      signUpEmail: "",
      signUpPassword: "",

    };

    this.onTextBoxChangeSignInEmail = this.onTextBoxChangeSignInEmail.bind(this);
    this.onTextBoxChangeSignInPassword = this.onTextBoxChangeSignInPassword.bind(this);
    this.onTextBoxChangeSignUpEmail = this.onTextBoxChangeSignUpEmail.bind(this);
    this.onTextBoxChangeSignUpPassword = this.onTextBoxChangeSignUpPassword.bind(this);
    this.onTextBoxChangeSignUpFirstName = this.onTextBoxChangeSignUpFirstName.bind(this);
    this.onTextBoxChangeSignUpLastName = this.onTextBoxChangeSignUpLastName.bind(this);
   
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage("the_main_app");
    if (obj && obj.token) {
      const { token } = obj;
      // verify token
      fetch('/api/account/verify?token=' + token)
      .then(res => res.json())
      .then(json => {
       if (json.success) {
         this.setState({
           token,
           isLoading: false
         });
       } else {
         this.setState({
           isLoading: false,
         });
       }
      });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  onTextBoxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value,
    });
  }

  onTextBoxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value,
    });
  }

  onTextBoxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value,
    });
  }

  onTextBoxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    });
  }

  onTextBoxChangeSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value,
    });
  }

  onTextBoxChangeSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value,
    });
  }


  onSignUp () {
     //Grab state
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword
    } = this.state;

    this.setState({
      isLoading: true,
    })

      //POST req to backend
      fetch('/api/account/signup', { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: signUpFirstName,
          lastName: signUpLastName,
          email: signUpEmail,
          password: signUpPassword,
        }),
      }).then(res => res.json())
        .then(json => {
          if(json.success) { 
            this.setState({
              signUpError: json.message,
              isLoading: false,
              signUpEmail: "",
              signUpPassword: "",
              signUpFirstName: "",
              signUpLastName: ""
          });
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false,
          });
        }
      });
  }


  onSignIn () {
    //Grab state
    const {
      signInEmail,
      signInPassword
    } = this.state;

    this.setState({
      isLoading: true,
    })

      //POST req to backend
      fetch('/api/account/signin', { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: signInEmail,
          password: signInPassword,
        }),
      }).then(res => res.json())
        .then(json => {
          if(json.success) { 
            setInStorage('the_main_app', { token: json.token });
            this.setState({
              signInError: json.message,
              isLoading: false,
              signInEmail: "",
              signInPassword: "",
              token: json.token
          });
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      });
  }

  logout () {
    const obj = getFromStorage("the_main_app");
    if (obj && obj.token) {
      const { token } = obj;
      // verify token
      fetch('/api/account/logout?token=' + token)
      .then(res => res.json())
      .then(json => {
       if (json.success) {
         this.setState({
           token: '',
           isLoading: false
         });
       } else {
         this.setState({
           isLoading: false,
         });
       }
      });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }
  

  render() {

    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpError,
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>)
    }

    if (!token) {
      return (
        <div id="all">
        <h2 className = "title">Chordinate</h2>
          <div id="login-box">
          <div id="left-box">
            {
              (signInError) ? (
                <p>{signInError}</p>
              ) : (null)
            }
            <div className="signUp">
            <h1>Chordinate</h1>
            <hr></hr>
            <h5>Discover Live Music</h5>
            <h5>Without Ever Getting Lost</h5>
            <p>Sign In</p>
            <input 
              type="email" 
              placeholder="Email" 
              value={signInEmail} 
              onChange = {this.onTextBoxChangeSignInEmail}
            />
            <br />
            <input 
              type="password" 
              placeholder="Password" 
              value={signInPassword} 
              onChange = {this.onTextBoxChangeSignInPassword}
            />
            </div>
            <br />
            <button onClick={this.onSignIn}>Sign In</button>
          </div>
          <br />
          <br />
            <div>
            {
                (signUpError) ? (
                  <p>{signUpError}</p>
                ) : (null)
              }
            </div>
            </div>
             
         
          <div className="right-box">
            <p>Sign Up</p>
            <input 
            type="text" 
            placeholder="First Name"
            value={signUpFirstName}
            onChange = {this.onTextBoxChangeSignUpFirstName}
            /><br />
            <input 
            type="text" 
            placeholder="Last Name"
            value={signUpLastName}
            onChange = {this.onTextBoxChangeSignUpLastName}
            /><br />
            <input 
            type="email" 
            placeholder="Email"
            value={signUpEmail}
            onChange = {this.onTextBoxChangeSignUpEmail}
            /><br />
            <input 
            type="password" 
            placeholder="Password"
            value={signUpPassword}
            onChange = {this.onTextBoxChangeSignUpPassword}
            /><br />
            <button onClick={this.onSignUp}>Sign Up</button>
          </div>
          
          <div> <div className="or">OR sign in with Spotify</div>
             {/* <button onClick={() => window.location = 'localhost:8080' } className= "social spotify">Login With Spotify</button> */}
             <button onClick={() => window.location = 'https://bandmap-backend.herokuapp.com/login' } className= "social spotify">Login With Spotify</button>
         </div>
         
        </div>
      );
    }

    // !!! The code below only appears once the user has logged in
    // This would be where we'd put the map component
    return (
      <div>
        <MyMapComponent />
        <button onClick={this.logout}>Logout</button>
      </div>
    );
  }
}

export default Home;
