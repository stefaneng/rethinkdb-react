require("./style.css");

var io = require("socket.io-client");
var React = require('react');
var ReactDOM = require('react-dom');
var createStore = require('redux').createStore;
var Provider = require('react-redux').Provider;

var socket = io();
var store = createStore(messageApp);

var MessageList = React.createClass({
    getInitialState: function() {
        return { messages: [] };
    },
    render: function() {
        var messages = this.state.messages.map(function(message) {
            return (
                <li key={message.id}>{message.message}</li>
            );
        });
        return (
            <div>
                <ul id="messages">{messages}</ul>
            </div>
        );
    },
    componentDidMount: function () {
        socket.on('db message', function (msg) {
            this.setState({ messages:  this.state.messages.concat(msg) });
        }.bind(this));

        socket.on('init messages', function(messages) {
            this.setState({ messages: messages});
        }.bind(this));
    }
});

var MessageBox = React.createClass({
    render: function() {
        var input = this.state.input;
        return (
            <div className="messageBox">
                <input type="text"
                       autoFocus="true"
                       value={input}
                       onKeyPress={this.checkEnter}
                       onChange={this.onChange}
                />
                <button onClick={this.sendMessage}>Send</button>
            </div>
        );
    },
    getInitialState: function() {
        return { input: "" };
    },
    sendMessage: function(msg) {
        if (msg !== "") {
            socket.emit('chat message', msg);
        }
    },
    checkEnter: function(event) {
        if(event.key === 'Enter') {
            this.sendMessage(event.target.value);
            this.setState({input: ""});
        }
    },
    onChange: function(event) {
        this.setState({input: event.target.value});
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
