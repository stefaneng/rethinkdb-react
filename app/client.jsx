require("./style.css");

var io = require("socket.io-client");
var React = require('react');
var ReactDOM = require('react-dom');

var socket  = io();

var MessageBox = React.createClass({
    render: function() {
        return (
            <div>
                <ul id="messages"></ul>
                <form action="">
                    <input id="m" autoComplete="off" /><button>Send</button>
                </form>
            </div>
        );
    }
});


ReactDOM.render(
    <MessageBox />,
    document.getElementById('app')
);
