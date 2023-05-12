

const Spotify = {

    userToken: "", 
    expires: null,

    async getAccessToken(){
        const id = process.env.REACT_APP_CLIENT_ID
        const uri = process.env.REACT_APP_URI
        if (this.userToken === ""){
          const scrt = process.env.REACT_APP_CLIENT_SECRET
        const getToken = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            body: `grant_type=client_credentials&client_id=${id}&client_secret=${scrt}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        const data = await getToken.json()
        const tok = data.access_token
        const today = new Date()
            this.userToken = tok
            this.expires =  new Date(today.getTime() + 3600000) 
        const timer = setTimeout(()=>{
            this.userToken = ""
            this.expires = null
            clearTimeout(timer)
        }, 3600000)
        }
        console.log('received access token');
        
     //  window.location.replace(`https://accounts.spotify.com/authorize?client_id=${id}&response_type=token&scope=playlist-modify-public&redirect_uri=${uri}`)
    },

    async search(term){
        console.log('search in spotify. Term is: ' + JSON.stringify(term));
        if (this.userToken === ""){
            console.log('user token is empty');
            
            await this.getAccessToken()
        }
        
        console.log('tok is: ' + JSON.stringify(this.userToken));
        
        const getSearchedTerm = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
       
        headers: {
            "Authorization": `Bearer ${this.userToken}`
          }
        })
        const data = await getSearchedTerm.json()
       
        let tracksArray = []
        const objKeys = Object.keys(data)
        if (objKeys.length !== 0 && objKeys.includes("tracks")){
            //console.log('search tracks: ' + JSON.stringify(data.tracks));
            tracksArray = data.tracks.items.map(oneObj => {
                const trackObj = {
                    ID: oneObj.id,
                    Name: oneObj.name,
                    Artist: oneObj.artists[0].name,
                    Album: oneObj.album.name,
                    URI: oneObj.uri
                }
               return trackObj
       })
        }
      
       return tracksArray
    },


    async savePlaylist(playlistName, listTracksURIs){
        if (playlistName !== "" ){
            if (this.userToken === ""){
                await this.getAccessToken()
            }
            const currentToken = this.userToken
            console.log('current tok ' +JSON.stringify(currentToken));
            
            const authHeader = `Authorization: Bearer ${currentToken}`
            let userID = ""

            const getUsername = await fetch(`https://api.spotify.com/v1/me`, {
                header: authHeader
            })
            const data = await getUsername.json()
            console.log("user details are: " + JSON.stringify(data))

            const username = data.display_name
            console.log("username is: " + JSON.stringify(username))
            userID = data.id
            console.log("user id is: " + JSON.stringify(userID))


            const createNewPlaylist = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                method: "POST",
                body: {
                    "name": `${playlistName}`,
                    "description": "new playlist description",
                    "public": false
                },
                headers: {
                    "Authorization": `Bearer ${currentToken}`
                  },
                header: `Content-Type: application/json`
            })

            const newPlaylistData = await createNewPlaylist.json()
            const playlistID =  newPlaylistData.id
            console.log('created playlost id: ' + JSON.stringify(playlistID));
            
            if (listTracksURIs.length !== 0){
                  const addTracksToPlaylist = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,{
                method: "POST",
                body: {
                    "uris": listTracksURIs,
                    "position": 0
                },
                header: `Authorization: Bearer ${currentToken},
                    Content-Type: application/json`
            })

               const addedTracksResponse = await addTracksToPlaylist.json()
            console.log(`added tracks to playlist resp is: ${addedTracksResponse}`)
            }
          

         
        }
        else {
            return;
        }

    }
}


export default Spotify