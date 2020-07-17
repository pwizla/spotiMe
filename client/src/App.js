import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
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
        <h2 className="uppercase">Your Favorite Artists</h2>
        <p><RatherSee text="your favorite tracks" link="/tracks" /></p>
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

function RatherSee ({ text, link }) {
  return (
    <>
      <p className="text--small">Rather see <Link to={link} className="link link--green-underline">{text}</Link>?</p>
    </>
  )
}

function TopTracks ({ tracks }) {
  return (
    <div className="top-tracks">
      <TopTracksList tracks={tracks}/>
    </div>
  )
}

function TopTracksList ({ tracks }) {
  return (
    <>
      <div className="artists-list-container">
        <h2 className="uppercase">Your Favorite Tracks</h2>
        <RatherSee text="your favorite artists" link="/artists" />
        <ul className="flex-list">
          { tracks.map((track) => (
            <TrackCard track={track} key={track.id}/>
          ))}
        </ul>
      </div>
    </>
  )
}

function TrackCard( { track }) {
  return (
    <li className="card card--wide card--animated">
      <div className="avatar-wrapper">
        <img
          className="avatar"
          alt={`avatar for ${track.name}`}
          src={track.album.images[0].url}
        />
      </div>
      <div className="artist-details padding">
        <a
          className="link link--green-hover header header--artist-card"
          href={`${BASE_WEB_PLAYER_URL}/track/${track.id}`}>
          {track.name}
        </a>
        {track.genres && track.genres.length > 0
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

const Home = () => (
  <div className="flex flex--column page--center-both">
    <h2>What do you want to look at?</h2>
    <div className="flex flex--center-both">
      <Link
        className="link route-link"
        to="/artists">
          My Top Artists
      </Link>
      <Link
        className="link route-link"
        to="/tracks">
          My Top Tracks
      </Link>
    </div>
  </div>
)

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
      topArtists: [],
      topTracks: [],
    }
    this.getTopArtists = this.getTopArtists.bind(this)
  }
  componentDidMount() {
    this.getTopArtists();
    this.getTopTracks();
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
  getTopTracks() {
    spotifyApi.getMyTopTracks()
      .then((response) => this.setState({ topTracks: response.items }))
  }
  render() {
    const { loggedIn } = this.state

    return (
      <div className="App">
        { loggedIn === true
            ? <Router>
                <Route exact path="/" component={Home} />
                <Route path="/artists" render={() => (<TopArtists artists={this.state.topArtists}/>)} />
                <Route path="/tracks" render={() => (<TopTracks tracks={this.state.topTracks}/>)} />
              </Router>
            : ( <a href="http://localhost:8888">Login to Spotify</a>)
        }
      </div>
    )
  }
}

export default App
