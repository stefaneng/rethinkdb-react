require("./style.css");

var io = require("socket.io-client");
var React = require('react');
var ReactDOM = require('react-dom');
var createStore = require('redux').createStore;
var Provider = require('react-redux').Provider;

var socket = io();
var store = createStore(messageApp);

socket.on('chat message', function(msg) {
    console.log("Received message: ", msg);
});

var MessageList = React.createClass({
    render: function() {
        return (
            <ul id="messages"></ul>
        );
    }
});

var MessageBox = React.createClass({
    render: function() {
        var message = this.state.message;
        return (
            <div className="messageBox">
                <input type="text"
                       autoComplete="off"
                       value={message}
                       onChange={this.handleChange}
                />
                <button onClick={this.sendMessage}>Send</button>
            </div>
        );
    },
    getInitialState: function() {
        return { message: "" };
    },
    sendMessage: function() {
        var msg = this.state.message;
        if (msg !== "") {
            socket.emit('chat message', msg);
        }
        this.setState({message: ""});
    },
    handleChange: function(event) {
        this.setState({message: event.target.value});
    }
});

var App = React.createClass({
    render: function() {
        return (
            <div>
                <MessageList />
                <MessageBox />
            </div>
        );
    }
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
