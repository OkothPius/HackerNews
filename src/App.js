import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { render } from '@testing-library/react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux/',
    author: 'Dan Ambrov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];
//es5
// function isSearched(searchTerm) {
//   return function(item) {
//     //some conditions which return true or false
//     return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
//   }
// }

//es6
const isSearched = (searchTerm) => (item) =>
 !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list,
      searchTerm: '',
    };
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value});
  }

  onDismiss(id) {
    // const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(item => item.objectID !== id);
    this.setState({ list: updatedList });
  }

  render() {
    const { searchTerm, list } = this.state;
    return (
      <div className="App">
        <form>
          <input type="text"
          onChange={this.onSearchChange}/>
        </form>
        {list.filter(isSearched(searchTerm)).map(item => 
        {this.state.list.filter(isSearched(this.state.searchTerm)).map(item => 
          <div key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
             <span>{item.author}</span>
             <span>{item.num_comments}</span>
             <span>{item.points}</span>
             <span>
               <button onClick={() => this.onDismiss(item.objectID)} type="button">Dismiss</button>
             </span>

          </div>
        )}
      </div>
    );
  }
}
  

export default App;
