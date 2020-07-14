import React from 'react'
import './App.css'
import SpotifyWebApi from 'spotify-web-api-js'
const spotifyApi = new SpotifyWebApi()
const BASE_WEB_PLAYER_URL = "https://open.spotify.com"

function TopArtists ({ artists }) {
  return (
    <div className="top-artists">
      <TopArtistsList artists={artists}/>
    </div>
  )
}

function TopArtistsList ({ artists }) {
  return (
    <>
      <div className="artists-list-container">
        <h2 className="uppercase rotate--90">Your Favorite Artists</h2>
        <ul className="flex-list">
          { artists.map((artist) => (
            <ArtistCard artist={artist} key={artist.id}/>
          ))}
        </ul>
      </div>
    </>
  )
}

function ArtistCard( { artist }) {
  return (
    <li className="card card--wide card--animated">
      <div className="avatar-wrapper">
        <img
          className="avatar"
          alt={`avatar for ${artist.name}`}
          src={artist.images[0].url}
        />
      </div>
      <div className="artist-details padding">
        <a
          className="link link--green-hover header header--artist-card"
          href={`${BASE_WEB_PLAYER_URL}/artist/${artist.id}`}>
          {artist.name}
        </a>
        {artist.genres && artist.genres.length > 0
          ? (
            <div className="genres">
              {/* <span className="">Genres: {artist.genres.join(', ')}</span> */}
            </div>
          )
          : null
        }
      </div>
    </li>
  )
}

class App extends React.Component {
  constructor() {
    super()
    const params = this.getHashParams()
    const token = params.access_token
    if (token) {
      spotifyApi.setAccessToken(token)
    }
    this.state = {
      loggedIn: token ? true : false,
      topArtists: []
    }
    this.getTopArtists = this.getTopArtists.bind(this)
  }
  componentDidMount() {
    this.getTopArtists();
  }
  getHashParams() {
    var hashParams = {}
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q)
    }
    return hashParams
  }
  getTopArtists() {
    spotifyApi.getMyTopArtists()
      .then((response) => this.setState({ topArtists: response.items }))
  }
  render() {
    const { loggedIn } = this.state

    return (
      <div className="App">
        { loggedIn === true
            ? <TopArtists artists={this.state.topArtists}/>
            : ( <a href="http://localhost:8888">Login to Spotify</a>)
        }
      </div>
    )
  }
}

export default App
