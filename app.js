require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const async = require("hbs/lib/async");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", async (req, res) => {
  try {
    const ids = req.query.q;
    // console.log(req.query);
    const data = await spotifyApi.searchArtists(ids);
    //  console.log(data);
    const artistSearched = data.body;
    //  console.log(artistSearched);
    res.render("artist-search-results", { artistSearched });
  } catch (error) {
    console.log(error);
  }
});

app.get("/albums/:artistId", async (req, res) => {
  try {
    const id = req.params.artistId;
    const data = await getArtistAlbums(id);
    const albums = data.body.items;
    res.render("albums", { albums });
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
