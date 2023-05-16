import React from 'react'
import './SearchBar.css'

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { term: "" }
    this.search = this.search.bind(this)
    this.handleTermChange = this.handleTermChange.bind(this)
  }

  search() {
    this.props.onSearch(this.state.term)

  }

  handleTermChange(event) {
    const newTerm = event.target.value
    this.setState(() => ({
      term: newTerm
    }))
    console.log("writing to search bar" + newTerm)
  }

  render() {
    return (
      <div className="SearchBar">

        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />


        <button onClick={this.search} className="SearchButton">SEARCH</button>

      </div>
    )
  }

}

export default SearchBar


