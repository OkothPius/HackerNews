import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { render } from '@testing-library/react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const isSearched = (searchTerm) => (item) =>
 !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    // this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }
  setSearchTopstories(result) {
    this.setState({ result });
  }

  fetchSearchTopstories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm);
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({ 
      result: { ...this.state.result, hits: updatedHits }
     });
  }

  render() {
    const { searchTerm, result } = this.state;
    return (
      <div className="page">
        <div className="interactions">
          <Search
            input type="text"
            value={searchTerm}
            onChange={this.onSearchChange} 
          >
          Search
          </Search> 
        </div>  
         
        { result
        ? 
          <Table
          list={result.hits}
          pattern={searchTerm}
          onDismiss={this.onDismiss} 
          />
          : null
          }
      </div>  
    );
  }
}

const Search = ({value, onChange, children}) =>
    <form>
      {children} <input
      type="text"
      value={value}
      onChange={onChange}
      />
    </form>  


const Table = ({list, pattern, onDismiss}) => 
    <div className="table">
      {list.filter(isSearched(pattern)).map(item =>
        <div key={item.objectID} className="table-row">
          <span style={{ largeColumn}}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={{ midColumn }}>
            {item.author}
          </span>
          <span style={{ smallColumn}}>
            {item.num_comments}
          </span>
          <span style={{ smallColumn}}>
            {item.points}
          </span>
          <span style={{ smallColumn}}>
            <Button 
              onClick={() => onDismiss(item.objectID)}
              className="button-inline"
            >
              Dismiss
            </Button>
          </span>
        </div>  
        )}
    </div> 

const largeColumn = {
  width: '40%',
};     

const midColumn = {
  width: '10%',
}; 

const smallColumn = {
  width: '40%',
}; 



const Button = ({onClick, className='', children}) =>
  <button 
  onClick={onClick}
  className="button-active"
  type="button">
    {children}
  </button>  
  

export default App;
