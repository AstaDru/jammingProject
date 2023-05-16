import React from 'react'
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';



class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResults: [],
      playlistTracks: [
      ],
      playlistName: "MyPlaylist",

    }
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
  }

  addTrack(track) {
    const trackIndexInPlaylist = this.state.playlistTracks.findIndex((oneTrack) => oneTrack.ID === track.ID)
    if (trackIndexInPlaylist === -1) {
      const trackIndexInSearchResults = this.state.searchResults.findIndex((oneTrack) => oneTrack.ID === track.ID)
      this.setState((prevState) => {
        const searchResultsCopy = prevState["searchResults"]
        searchResultsCopy.splice(trackIndexInSearchResults, 1)
        return {
          searchResults: searchResultsCopy,
          playlistTracks: [...prevState["playlistTracks"], track],
          playlistName: prevState["playlistName"],
        }
      })
    }
  }

  removeTrack(track) {
    const trackIndex = this.state.playlistTracks.findIndex((oneTrack) => oneTrack.ID === track.ID)
    if (trackIndex !== -1) {
      this.setState((prevState) => {
        const playlistTracksCopy = prevState["playlistTracks"]
        playlistTracksCopy.splice(trackIndex, 1)
        return {
          searchResults: prevState["searchResults"],
          playlistTracks: playlistTracksCopy,
          playlistName: prevState["playlistName"],
        }
      })
    }
  }

  updatePlaylistName(name) {
    this.setState({

      playlistName: name,

    })

  }

  async savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(oneTrack => oneTrack.URI) //list of uri's from playlistTracks
    console.log('track uris in save playlist app: ' + JSON.stringify(trackURIs));
    console.log('all tracks  app: ' + JSON.stringify(this.state.playlistTracks));


    const isSucc = await Spotify.savePlaylist(this.state.playlistName, trackURIs)
    if (isSucc === "success") {
      this.setState({

        playlistTracks: [],
        playlistName: "new Playlist",
        searchResults: []
      })
    }
    else {
      alert("not right")
    }

  }

  async search(searchTerm) {
    const searchRes = await Spotify.search(searchTerm)
    this.setState((prevState) => ({
      searchResults: searchRes,
      playlistTracks: prevState["playlistTracks"],
      playlistName: prevState["playlistName"],

    }))
    console.log(JSON.stringify(this.state.searchResults))


  }


  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="Appplaylist">
            <SearchResults onAdd={this.addTrack} onSearchResults={this.state.searchResults} />
            <Playlist onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} onPlaylistName={this.state.playlistName} onPlaylistTracks={this.state.playlistTracks} />
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    Spotify.getAccessToken()
  }

}

export default App 
