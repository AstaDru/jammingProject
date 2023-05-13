

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
        console.log('data is: ' + JSON.stringify(data));
        
        const tok = data.access_token
        const today = new Date()
            this.userToken = tok
            this.expires =  new Date(today.getTime() + 3600000) 
            console.log('exp token in getAccessToken ' + JSON.stringify(this.expires));
            console.log('today: ' + JSON.stringify(today));
            
        const timer = setTimeout(()=>{
            this.userToken = ""
            this.expires = null
            clearTimeout(timer)
        }, 3600000)
        }
        console.log('received access token');
        
     // window.location = `https://accounts.spotify.com/authorize?client_id=${id}&response_type=token&scope=playlist-modify-public&redirect_uri=${uri}`
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
            

            function generateRandomStr(){
                const characters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", 
                "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
                //16
                let word = ""
                for (let i=0; i < 16; i++){
                    word += characters[Math.floor(Math.random() * 52)]
                }
                return word
            }
            const stateKey = "spotKey"
            
            let userID = ""
            const id = encodeURIComponent(process.env.REACT_APP_CLIENT_ID)
            const scope = encodeURIComponent('user-read-private user-read-email')
            const uri = process.env.REACT_APP_URI
            const state = encodeURIComponent(generateRandomStr())
            console.log('### ###   generated word is: ' + state);
            localStorage.setItem(stateKey, state)
            //get user to authorize access to read-private read-email
            const urlToAccess = `https://accounts.spotify.com/authorize?response_type=token&client_id=${id}&scope=${scope}&redirect_uri=${uri}&state=${state}`
            window.location = urlToAccess
           
            

            function getHashParams() {
                var hashParams = {};
                var e, r = /([^&;=]+)=?([^&;]*)/g,
                    q = window.location.hash.substring(1);
                while ( e = r.exec(q)) {
                   hashParams[e[1]] = decodeURIComponent(e[2]);
                }
                return hashParams;
              }

              const hashParams = getHashParams()
              //const a = window.location.hash.substring(1)
              //console.log("response: " + JSON.stringify(a))

              const currentToken = hashParams.access_token
              const storedState = localStorage.getItem(stateKey)

              if (currentToken && (state == null || state !== storedState)) {
                alert('There was an error during the authentication')
                console.log("err occured")
              }
              else {
                localStorage.removeItem(stateKey);

                if (currentToken){

                    const getUsername = await fetch(`https://api.spotify.com/v1/me`, {
                       method: "GET", 
                        headers: {Authorization: `Bearer ${currentToken}`}
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
                            "Authorization": `Bearer ${currentToken}`,
                            "Content-Type": "application/json"
                          },
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
                    alert("no token")
                }
            


              }

          

         
        }
        else {
            return;
        }

    }
}


export default Spotify