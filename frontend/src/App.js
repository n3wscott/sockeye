import React, {Component} from "react";
import Dashboard from './Dashboard';
import "./App.css"
import ReconnectingWebSocket from 'reconnecting-websocket';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    }
  }

  componentDidMount() {
    console.log("Protocol: " + window.location.protocol);
    let wsURL = "ws://" + document.location.host + "/ws";
    if (window.location.protocol === 'https:') {
      wsURL = "wss://" + document.location.host + "/ws";
    }

    wsURL = "ws://localhost:8080/ws";

    console.log("WS URL: " + wsURL);

    let that = this;

    let sock = new ReconnectingWebSocket(wsURL);
    sock.onopen = function () {
      console.log("connected to " + wsURL);
      //let fab = document.getElementById("fab");
      //fab.setAttribute("sockeye-connected", "true");
    };
    sock.onclose = function (e) {
      console.log("connection closed (" + e.code + ")");
      //fab.setAttribute("sockeye-connected", "false");
    };
    sock.onmessage = function (e) {
      window.dispatchEvent(new Event('cloudevent'));
      let t = JSON.parse(JSON.parse(e.data)); // at the moment the ws sends down a double encoded thing.

      console.log(t)
      that.onCloudEvent(t)
    };
  }

  onCloudEvent(event) {
    let data = {id: event.id};

    Object.keys(event).forEach(key => {
      if (key === "data") {
        data[key] = JSON.stringify(event[key]);
        return;
      }
      data[key] = event[key];
    });

    let al = [...this.state.events];

    console.log(data["data"]);
    if (data["data"] != null){
      al.push(data);
      this.setState( {
        events: al
    });
    return;
    } 
    if (data["data"] === undefined){
      alert("Event recieved with an invalid or missing data payload. Check the console for more information");
      console.log("More information on the invalid event: ", event);
      return; 
    }

  }


  render() {
    const events = this.state.events;

    return (
      <Dashboard items={events} />
    );
  }
}

export default App;
