import React from 'react'
import './TrackList.css'
import Track from '../Track/Track'

class TrackList extends React.Component{
constructor(props){
    super(props)
}



render(){

 
        const resultsToShow = this.props.onResults.map((oneResult) => {
            if (oneResult.ID !== null){
                 return    <Track key={oneResult.ID} onTrack={oneResult} onIsRemoval={this.props.isRemoval} onRemove={this.props.onToRemove} onAdd={this.props.onToAdd} />

            }
            

   })
        return (
<div className="TrackList">
  {resultsToShow}
</div>
        
    )
}

}

export default TrackList