import React from 'react';
import { Client } from '@stomp/stompjs';
import logo from './logo.svg';
import './App.css';

const accessToken = '';

const searchTicleBody = {
  search_user_id: 1,
  keyword:"abc",
  index_count: 10
};

const client = new Client({
  brokerURL: "ws://localhost:8000/ticle/api/v1/websocket",
  connectHeaders: {
    Authorization: `JWT ${accessToken}`,
  },
  debug: function (str) {
    console.log(str);
  },
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000
});

client.onConnect = function () {
  client.subscribe('/search-ticle-result', (message) => {
    if (message.body) {
      console.log(message.body);
      alert("got message with body " + message.body)
    } else {
      alert("got empty message");
    }
  }, { Authorization: `JWT ${accessToken}` });
};

client.onStompError = function (frame) {
  // Will be invoked in case of error encountered at Broker
  // Bad login/passcode typically will cause an error
  // Complaint brokers will set `message` header with a brief message. Body may contain details.
  // Compliant brokers will terminate the connection after any error
  console.log('Broker reported error: ' + frame.headers['message']);
  console.log('Additional details: ' + frame.body);
};

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button
          onClick={() => {
            client.activate();
          }}
        >
          connect
        </button>
        <button
          onClick={() => {
            client.deactivate();
          }}
        >
          disconnect
        </button>
        <button
          onClick={() => {
            client.publish({
              destination: '/search-ticle',
              body: JSON.stringify(searchTicleBody),
              headers: { Authorization: `JWT ${accessToken}` },
            });
          }}
        >
          send
        </button>
      </header>
    </div>
  );
};

export default App;
