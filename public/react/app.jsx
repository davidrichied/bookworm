// We have to add a new players property to our application component

// Jim always builds his app, first, using stateless functional components (having components that take static properties)

// In order to update data, we have to use state (dynamic data)

// We need to rewrite our components into component classes before we can start using state

// State is data in our application that can change over time. It has an inital value, and events happen that can mutate it.

// The score is a state that starts at zero.

// We are encouraged to add other libraries to help with things like AJAX, persistence, and state management

// Flux is a popular way to consolidate state into a manageable form, but Redux (recommended by Andrew) takes the Flux pattern further

// We are only going to use the state handling mechanisms built into react

// Stateful components use the createClass method, whereas stateless components look like normal anonymous JavaScript functions. 

// 1. Create stateful or stateless component which returns some HTML.
// 2. Call component in Application

// the key in getInitialState's object can be accessed with this.state.key

var PLAYERS = [
  {
    name: "Player 1",
    score: 31,
    id: 1,
  },
  {
    name: "Player 2",
    score: 35,
    id: 2,
  },
  {
    name: "Player 3",
    score: 20,
    id: 3
  }
];
var nextId = 4;

// We are creating a new stateful component called StopWatch
var Stopwatch = React.createClass({
  getInitialState: function() {
    return {
      running: false,
      elapsedTime: 0,
      previousTime: 0,
    }
  },

  componentDidMount: function() {
    this.interval = setInterval(this.onTick, 100);
  },

  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  onTick: function() {
    if (this.state.running) {
      var now = Date.now();
      this.setState({
        previousTime: now,
        elapsedTime: this.state.elapsedTime + (now - this.state.previousTime),
      });
    }
    console.log('onTick');
  },

  onStart: function() {
    this.setState({ 
      running: true,
      previousTime: Date.now(),
    });
  },

  onStop: function() {
    this.setState({ running: false });
  },

  onReset: function() {
    this.setState({
      elapsedTime: 0,
      previousTime: Date.now(),
    });
  },

  render: function() {
    var seconds = Math.floor(this.state.elapsedTime / 1000);
    var startStop;
    if (this.state.running) {
      startStop = <button onClick={this.onStop}>Stop</button>;
    } else {
      startStop = <button onClick={this.onStart}>Start</button>;
    }
    return (
      <div className="stopwatch">
        <h2>Stopwatch</h2>
        <div className="stopwatch-time">{ seconds }</div>
        { startStop }
        <button onClick={this.onReset}>Reset</button>
      </div>
    );
  }
});
var AddPlayerForm = React.createClass({
  propTypes: {
    onAdd: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return {
      name: ""
    };
  },

  onNameChange: function(e) {
    this.setState({name: e.target.value});
  },

  onSubmit: function(e) {
    e.preventDefault();
    this.props.onAdd(this.state.name);
    this.setState({name: ""});
  },

  render: function() {
    return (
      <div className="add-player-form">
        <form onSubmit={this.onSubmit}>
          <input type="text" value={this.state.name} onChange={this.onNameChange} />
          <input type="submit" value="Add Player" />
        </form>
      </div>
    )
  }
});

// the reduce method (props.players.reduce) takes a function as the first argument and an initial value as the second. The function takes two arguments. The first is the the thing being added onto, and the second is the object to get the thing to add.
function Stats(props) {
  var totalPlayers = props.players.length;
  var totalPoints = props.players.reduce(function(total, player) {
    return total + player.score;
    }, 0);
  return (
    <table className="stats">
      <tbody>
        <tr>
          <td>Players:</td>
          <td>{totalPlayers}</td>
        </tr>
        <tr>
          <td>Total Points:</td>
          <td>{totalPoints}</td>
        </tr>
      </tbody>
    </table>
  );
}

Stats.propTypes = {
  players: React.PropTypes.array.isRequired,
}
function Header(props) {
  return (
    <div className="header">
      <Stats players={props.players} />
      <h1>{props.title}</h1>
      <Stopwatch />
    </div>
  );
}

Header.propTypes = {
  title: React.PropTypes.string.isRequired,
  players: React.PropTypes.array.isRequired,
}

// To turn a stateless functional component into a class component, we use React's createClass method

// createClass takes an object that defines the methods the class

// We will add our own methods as needed to build our component

// The render method is the only required method for us to define. render returns a virtual DOM representation for components.

// All we have to do is cut out the entire return statement with its content and paste it into the render function
// We also need to replace props.score with this.props.score

// We can also include propTypes as a property of the class instead of creating it separately

// Stateless function components are preferred, but if state is needed, it's important to know how to convert an SFC into a class

// We can use the React method called getInitialState to specify what the initial value of our state will be

// In our render method, we need to replace our props with state. We will no longer get our score from our properties but from our state object

// We attach another method to the Counter class called incrementScore that takes an event as a param.
// We add an onClick attribute to a button and pass in the incrementScore method

// We can use the setState method in our incrementScore method to update the score. We can access the score variable in the state, and React will know which score to update

// The setState method re-renders the element after the state changes

// when binding the incrementScore function to the button, typically, we would need to do onClick={this.incrementScore.bind(this)}. 

// Data that changes should be state, not props, but they can start out as props and then be converted into state

function Counter(props) {
  return (
    <div className="counter">
      <button className="counter-action decrement" onClick={function() {props.onChange(-1);}}> -
      </button>
      <div className="counter-score">
        {props.score}
      </div>
      <button className="counter-action increment" onClick={function() {props.onChange(+1);}}> +
      </button>
    </div>
  );
}

Counter.propTypes = {
  score: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
}
// We no longer pass in score={props.score} since state will take care of it
function Player(props) {
  return (
    <div className="player">
      <div className="player-name">
        <a className="remove-player" onClick={props.onRemove}>X</a>
        {props.name}
      </div>
      <div className="player-score">
        <Counter  score={props.score} onChange={props.onScoreChange} />
      </div>
    </div>
  );
}

Player.propTypes = {
  name: React.PropTypes.string.isRequired,
  score: React.PropTypes.number.isRequired,
  onScoreChange: React.PropTypes.func.isRequired,
  onRemove: React.PropTypes.func.isRequired,
}
// Components start with a capital letter
// The param props comes from when we call our Application
// <Header /> was originally inline, but we extracted it into a new component
// We can't use a for loop because it is a statement (liek an if statement), we must use an expression like the map function
// We need to add a key to the component in the loop (the Player component) which makes it easier for React to create new objects and removes an error that pops up

var Application = React.createClass({

  propTypes: {
    title: React.PropTypes.string,
    initialPlayers: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      score: React.PropTypes.number.isRequired,
      id: React.PropTypes.number.isRequired,
    })).isRequired,
  },

  getDefaultProps: function() {
    return {
      title: "Scoreboard"
    }
  },

  getInitialState: function() {
    return {
      players: this.props.initialPlayers,
    };
  },

  onScoreChange: function(index, delta) {
    console.log('onScoreChange', index, delta);
    this.state.players[index].score += delta;
    this.setState(this.state);
  },

  onPlayerAdd: function(name) {
    console.log('Player added', name);
    this.state.players.push({
      name: name,
      score: 0,
      id: nextId,
    });
    this.setState(this.state);
    nextId += 1;
  },

  onRemovePlayer: function(index) {
    this.state.players.splice(index, 1);
    this.setState(this.state);
  },

  render: function() {
    return (
      <div className="scoreboard">
        <Header title={this.props.title} players={this.state.players} />
        <div className="players">
          {this.state.players.map(function (player, index) {
            return (
              <Player 
                onScoreChange={function(delta) {this.onScoreChange(index, delta)}.bind(this)}
                onRemove={function() {this.onRemovePlayer(index)}.bind(this)} 
                name={player.name} 
                score={player.score} 
                key={player.id} />
            )
          }.bind(this))}
        </div>
        <AddPlayerForm onAdd={this.onPlayerAdd} />
      </div>
    );
  }
});

// In react, we can document what properties which components take and what types they should be
//proptypes is just an object of all the keys that our component can take
// This is optional but helps with debugging
// This really defines what kind of properties the Application takes


//defaultProps can be used if no properties are passed to our app

//Props passed to a component should not be changed by that component.
// We need to wrap PLAYERS in curly braces to pass it in literally as its value
ReactDOM.render(<Application initialPlayers={PLAYERS} />, document.getElementById('container'));