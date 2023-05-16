let userToken = ""
let expires = null

const Spotify = {

    getAccessToken() {
       
        const prevStorageToken = window.localStorage.getItem("token")
        const prevStorageExp = window.localStorage.getItem("exp")
        const today = new Date()
        const expDate = today.getTime() + 360000
        const removeItemsFromStorage = () => {
            window.localStorage.removeItem("token")
            window.localStorage.removeItem("exp")
        }
        const callLink = () => {
            function generateRandomStr() {
                const characters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
                    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
                let word = ""
                for (let i = 0; i < 16; i++) {
                    word += characters[Math.floor(Math.random() * 52)]
                }
                return word
            }
            const stateKey = "spotKey"
            const id = encodeURIComponent(process.env.REACT_APP_CLIENT_ID)
            const scope = encodeURIComponent('user-read-private user-read-email playlist-modify-public playlist-modify-private')
            const uri = process.env.REACT_APP_URI
            const state = encodeURIComponent(generateRandomStr())
            localStorage.setItem(stateKey, state)
            const urlToAccess = `https://accounts.spotify.com/authorize?response_type=token&client_id=${id}&scope=${scope}&redirect_uri=${uri}&state=${state}`
            window.location = urlToAccess
        }
        const tokenMatch = window.location.href.match(/access_token=([^&]*)/)
        const expMatch = window.location.href.match(/expires_in([^&]*)/)

        if (tokenMatch && expMatch) {
            const setItemsToStorage = () => {
                window.localStorage.setItem("token", tokenMatch[1])
                window.localStorage.setItem("exp", expDate)
                userToken = tokenMatch[1]
                expires = Number(expMatch[1])
                window.setTimeout(() => userToken = "", expires * 1000)
                window.history.pushState("Token", null, "/")
                return userToken
            }

            if (prevStorageToken && prevStorageExp) {
                if (prevStorageToken === tokenMatch[1]) {
                    userToken = prevStorageToken
                    return userToken
                }
                else {
                    removeItemsFromStorage()
                    return setItemsToStorage()
                }
            }
            else {
                return setItemsToStorage()
            }
        }

        else {
            if (prevStorageToken && prevStorageExp) {
                const extToCheck = today.getTime() + 10000
                if (Number(prevStorageExp) > extToCheck) {
                    console.log('exp in storage is: ' + JSON.stringify(Number(prevStorageExp)));
                    console.log("time to check " + JSON.stringify(extToCheck))
                    userToken = prevStorageToken
                    return userToken
                }
                else {
                    removeItemsFromStorage()
                    callLink()
                }
            }
            else {
                callLink()
            }

        }
    },

    async search(term) {
        console.log('search in spotify. Term is: ' + JSON.stringify(term));
        Spotify.getAccessToken()
        const getSearchedTerm = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {"Authorization": `Bearer ${userToken}`}
        })
        const data = await getSearchedTerm.json()

        let tracksArray = []
        const objKeys = Object.keys(data)
        if (objKeys.length !== 0 && objKeys.includes("tracks")) {
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


    async savePlaylist(playlistName, listTracksURIs) {
        if (!playlistName) {
            return
        }
        Spotify.getAccessToken()
        let userID = ""
        const getUsername = await fetch(`https://api.spotify.com/v1/me`, {
            method: "GET",
            headers: { Authorization: `Bearer ${userToken}` }
        })
        const data = await getUsername.json()
        const username = data.display_name
        userID = data.id
    
        const createNewPlaylist = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            method: "POST",
            body: JSON.stringify({
                name: "New Playlist",
                description: "New playlist description",
                public: false
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`

            },
        })

        const newPlaylistData = await createNewPlaylist.json()
        const playlistID = newPlaylistData.id

        if (listTracksURIs.length !== 0) {
        
            const addTracksToPlaylist = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                method: "POST",
                body: JSON.stringify({
                    uris: listTracksURIs,
                    position: 0
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`
                },
            })
            const addedTracksResponse = await addTracksToPlaylist.json()
        }

        return "success"

    }


}


export default Spotify