import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { render } from '@testing-library/react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = "100";



const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const isSearched = (searchTerm) => (item) =>
 !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    // this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }
  setSearchTopstories(result) {
    const {hits, page} = result;
    const {searchKey, results} = this.state;

    const oldHits = results && results[searchKey]
    ? results[searchKey].hits : [];

    const updatedHits = [
      ...oldHits,
      ...hits,
    ];

    this.setState({ 
      results:{ 
        ...results,
        [searchKey]:{ hits: updatedHits, page }
      }
    });
  }

  fetchSearchTopstories(searchTerm, page) {
    fetch(`${PATH_BASE}${PARAM_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}\${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    event.preventDefault();
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
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
    const page = (result && result.page) || 0;
    return (
      <div className="page">
        <div className="interactions">
          <Search
            input type="text"
            value={searchTerm}
            onChange={this.onSearchChange} 
            onSubmit = {this.onSearchSubmit}
          >
          Search
          </Search> 
        </div>  
         
        { result &&
          <Table
          list={result.hits}
          onDismiss={this.onDismiss} 
          />
        }
        <div className="interactions">
            <Button onClick={() => this.fetchSearchTopstories(searchTerm, page + 1
              )}>
               More
            </Button>
        </div>
      </div>  
    );
  }
}

const Search = ({value, onChange, onSubmit, children}) =>
    <form onSubmit={onSubmit}>
      <input
      type="text"
      value={value}
      onChange={onChange}
      />
      <button type="submit">
        {children}
      </button>
    </form>  


const Table = ({list, onDismiss}) => 
    <div className="table">
      {list.map(item =>
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
