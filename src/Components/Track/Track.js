import React from 'react'
import './Track.css'



class Track extends React.Component {
  constructor(props) {
    super(props)
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
  }

  addTrack() {
    this.props.onAdd(this.props.onTrack)
  }

  removeTrack() {

    this.props.onRemove(this.props.onTrack)
  }



  render() {
    return (

      <div className="Track">
        <div className="Trackinformation">
          <h3>{this.props.onTrack.Name}</h3>
          <p>{this.props.onTrack.Artist} | {this.props.onTrack.Album} </p>
        </div>
        <button onClick={this.props.onIsRemoval ? this.removeTrack : this.addTrack} className="Trackaction">{this.props.onIsRemoval ? "-" : "+"}</button>
      </div>
    )
  }

}

export default React.memo(Track)

