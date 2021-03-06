import React, { Component } from "react";
import "./App.css";
import Navigation from "./component/Navigation/Navigation";
import Logo from "./component/Logo/Logo";
import ImageLinkForm from "./component/ImageLinkForm/ImageLinkForm";

import FaceRecognition from "./component/FaceRecognition/FaceRecognition";
import Signin from "./component/Signin/Signin";
import Register from "./component/Register/Register";
import Rank from "./component/Logo/Rank/Rank";

const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "587336a99a8c446b95011c5215e7f196",
});

class App extends Component {
  //phai viet hoa C
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedIn :false,
      user: {
        id: '',
        name : '',
        email: '',
        password: '',
        entries: 0,
        joined: ''
      }
    };
  }


  loadUser = (data) => {
    this.setState({user:{
        id: data.id,
        name : data.name,
        email: data.email,
        password: data.password,
        entries: data.entries,
        joined: data.joined

    }})
  }
  // componentDidMount() {
  //   fetch('http://localhost:3000')
  //     .then(response => response.json())
  //     .then(console.log)
  // }



  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width,height)
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
    // console.log(box)
  };

  onInputChange = (e) => {
    console.log(e.target.value);
    this.setState({ input: e.target.value });
  };

  onSubmit = () => {
    // console.log('click'); 

    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:300/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then ( response => response.json()) 
            .then( count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            }  
        this.displayFaceBox(this.calculateFaceLocation(response))
        })  
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    if (route === 'signout') {

      this.setState({ isSignedIn :false });
      
    } else if (route === 'home') {
      this.setState({ isSignedIn :true });
    }
    this.setState({route: route})
  };


 



  render() {
    return (
      <div className="App">
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        {this.state.route === "home" ? (
          <div>
            <Logo />

            <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
            />
           
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onSubmit}
            />
            <FaceRecognition
              box={this.state.box}
              imageUrl={this.state.imageUrl}
            />
          </div>
        ) : this.state.route === "signin" ? (
          <Signin onRouteChange={this.onRouteChange} />
        ) : (
          <Register loadUser={this.loadUser}  onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
