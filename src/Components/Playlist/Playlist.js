import React from 'react'
import TrackList from "../TrackList/TrackList"
import "./Playlist.css"

class Playlist extends React.Component{
constructor(props){
  super(props)
  this.handleNameChange = this.handleNameChange.bind(this)
}

  handleNameChange(event){
    const name = event.target.value
    this.props.onNameChange(name)
}

  render(){
const defaultValue = 'New Playlist'

        return <div className="Playlist">
    <input value={defaultValue} onChange={this.handleNameChange}/>
   <TrackList isRemoval={true} onToRemove={this.props.onRemove} playlistName={this.props.onPlaylistName}  onResults={this.props.onPlaylistTracks}/>
    <button onClick={this.props.onSave} className="Playlistsave">SAVE TO SPOTIFY</button>
  </div>
  }

}

export default Playlist