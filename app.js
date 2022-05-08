require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const async = require('hbs/lib/async');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });  

  // Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", async (req, res) =>{
  const {q} = req.query;
  spotifyApi
  .searchArtists(q)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    /**
     * This is where you want to explore a bit the data received from the API,
     * data.body is an Object with a key named "artists"
     * in the data.body.artists, you have:
     * - A key called "href" which is a link.
     * - A key called items which is an Array of Objects
     * - Some other less important keys.
     * Let's make a console.log of data.body.artists.items to see what is inside this array! 
    */
   console.log("Inside data.body.artists.items: ", data.body.artists.items)
   /**
    * If you have a look at this console.log, you'll see that this "items" Array
    * is the search result you're looking for, it contain all of the artist which
    * Spotify thought were relevant according to the query "q".
    * So this is probably the variable you want to give to your view !
    * Every object in this array have a few values which might interest you, I'll list some here but have a look through the data !
    * some interesting keys/values:
    * - id
    * - images (Array)
    * - name
    */
    res.render("artist-search-results", {q})
    /**
     * Here you're doing a render of the artist-search-result and give to this page
     * the variable "q"
     * So, what is "q" ? If on the main page, I searched for "Beatles", q will be "Beatles"
     * And not the array with all of the relevant artists.
     * Here is how you might have wanted to do the render, uncomment the next line to try it !  
     */
    // res.render("artist-search-results", { artists: data.body.artists.items })
    //Go to artists-search-result for the following feedback.
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
  const {q} = req.query;
  /**
   * You should arrive on this route using the links created in the "artist-search-results" file
   * You were not requested to create a form to arrive on this route so there is no query on the request object,
   * so you don't need line 76.
   * How do you perform a search then you don't have any data inside req.query ?
   * Well, you have a parameter in the url ! "/:artistId"
   * so this artistId should be the id of an artist right? Then we can use it with the spotifyApi
   * How to access this parameter ?
   * Remember this syntax? "req.params" ?
   * Here you could write const {artistId} = req.params
   * and the use this variable to do a search  using the spotifyApi. 
   */
  spotifyApi.getArtistAlbums(q)
  .then(function(data) {
    console.log('Artist albums', data.body);
    /**
     * Same remark as line 40, explore the data.body you receive here
     */
    // res.render("albums", {q})
    /**
     * Same remark as line 62, try to reproduce the syntax I provided line 68
     * to give to your page the variables you want to display.
     */
  }, function(err) {
    console.error(err);
  });
});

app.get('/tracks/:albumId', (req, res, next) => {
  /**
   * Same remark as line 78
   */
  spotifyApi.searchTracks(req.query)
  .then(function(data) {
    console.log('Search by ""', data.body);
  }, function(err) {
    console.error(err);
  });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
