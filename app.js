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
    /**
     * Here, the ids variable is undefined. Something you could do is
     * console.log(req.query) and see what key you actually need to use
     * HINT: you're using req.query.q here, but in the form (index.hbs)
     * your input's name is "name", so you will have a key called req.query.name
     * If your input's name was "q" then you would have a key under req.query.q
     */
    const ids = req.query.q;
    // console.log(req.query);
    const data = await spotifyApi.searchArtists(ids);
    //  console.log(data);
    const artistSearched = data.body;
    /**
     * The Array of artists given by spotifyApi is actually under the data.body.items key !
     * Try to console.log different part of your data once the search is working, this will
     * Allow you to give the correct variable to your view 😉
     */
    //  console.log(artistSearched);
    res.render("artist-search-results", { artistSearched });
  } catch (error) {
    console.log(error);
  }
});

app.get("/albums/:artistId", async (req, res) => {
  try {
    /**
     * The previous code was not working so I think you tried to prepare the field here,
     * which is great!
     * Just remember to use the "spotifyApi" before the getArtistAlbums
     * And try to console.log the data given by the spotifyApi so you'll know what keys to look for in
     * your hbs files 😉
     */
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
