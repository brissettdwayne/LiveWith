var ChatApp = React.createClass({
  getInitialState: function(){
    return {
      user: [],
      messages: [],
      socket: window.io('http://localhost:8000')
    }
  },
  componentDidMount: function() {
    var vm = this;
    vm.state.socket.on('get-users', function(user){
      var users = vm.state.user;
      users.push(user)
      vm.setState({user: users})
    });
    vm.state.socket.on('receive-message', function(msg){
      var messages = vm.state.messages;
      messages.push(msg)
      vm.setState({messages: messages})
    });
  },
  submitMessage: function(){
    var vm = this;
    var body = document.getElementById('message').value;
    var message = {
      user: vm.state.user || 'Guest',
      body: body
    };
    vm.state.socket.emit('new-message', message);
  },
  pickUser: function(){
    var vm = this;
    var user = document.getElementById('user').value;
    // var thisUser = vm.state.user;
    // vm.state.socket.emit('new-user', thisUser);
    // console.log(thisUser);
    vm.setState({user: user})
  },
  render: function(){
    var vm = this;
    var i = 0;
    var messages = vm.state.messages.map(function(msg){
      return (
        <li className="alert alert-info mt-1"><strong>{msg.user}: </strong><span>{msg.body}</span></li>
      )
    });
    return(
      <div >
        <h1 className="text-xs-center mb-1">Chat App</h1>
        <input id='user' className="input" type='text' placeholder='Choose a Username'/> <button className="btn btn-sm btn-outline-primary" onClick={() => vm.pickUser()}>Select User</button>
        <br/>
        <input id='message' className="input" type='text' placeholder='Enter Message'/> <button className="btn btn-sm btn-outline-primary" onClick={() => vm.submitMessage()}>Submit</button>
        <br/>
        <ul>{messages}</ul>
      </div>
    )
  }
});

ReactDOM.render(
  <ChatApp/>,
  document.getElementById('chat')
);
