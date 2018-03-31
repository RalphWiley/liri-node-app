require("dotenv").config();
//grab keys
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var fs = require('fs');

//argument array
var nodeArgv = process.argv;
var command = process.argv[2];

//movie or song
var x = "";

//combines word arguments
for(var i = 3; i < nodeArgv.length; i++) {
  if(i > 3 && i < nodeArgv.length) {
    x = x + "+" + nodeArgv[i];
  } else {
    x = x + nodeArgv[i];
  }
}

//switch case
switch(command) {
  case "my-tweets":
    showTweets();
  break;

  case "spotify-this-song":
    if(x) {
      spotifySong(x);
    } else {
      spotifySong("When I Was Done Dying");
    }
  break;

  case "movie-this":
    if(x) {
      filmOmdb(x)
    } else {
      filmOmdb("Reefer Madness");
    }
  break;

  case "do-what-it-says":
    doWhatItSays();
  break;

  default:
    console.log("{Enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  break;
}

function showTweets() {
  var userName = {screen_name: 'RalphWiley'};
  client.get('statuses/user_timeline', userName, function(error, tweets, response) {
    if(!error) {
      for(var i = 0, i < tweets.length; i++) {
        var date = tweets[i].created_at;
        console.log("@RalphWiley55: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        console.log("-------------------");

        fs.appendFile('log.txt', "@RalphWiley55: " + tweets[i].text + "Created At: " + date.substring(0, 19));
        fs.appendFile('log.txt', "----------------");
      }
    } else {
      console.log('Error')
    }
  });
}

function spotifySong(song) {
  spotify.search({ type: 'track', query: song}, function(error, data) {
    if(!error) {
      for(var i = 0; i < data.tracks.items.length; i++) {
        var songData = data.tracks.items[i];
        console.log("Artist: " + songData.artists[0].name);
        console.log("Song: " + songData.name);
        console.log("Preview URL: " + songData.preview_url);
        console.log("Album: " + songData.album.name);
        console.log("---------------")

        fs.appendFile('log.txt', songData.artists[0].name);
        fs.appendFile('log.txt', songData.name);
        fs.appendFile('log.txt', songData.preview_url);
        fs.appendFile('log.txt', songData.album.name);
        fs.appendFile('log.txt', "---------------");
      }
    } else {
      console.log('Error');
    }
  });
}

function filmOmdb(movie) {
  var omdbURL = "http://ww.omdbapi.com/?t=" + movie + "&plot=short&tomatoes=true";

  request(omdbURL, function(error, response, body) {
    if(!error && response.statusCode == 200) {
      var body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      Console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      console.log("Rotten Tomatoes URL: " + body.tomatoURL);

      fs.appendFile('log.txt', "Title: " + body.Title);
      fs.appendFile('log.txt', "Release Year: " + body.Year);
      fs.appendFile('log.txt', "IMdB Rating: " + body.imdbRating);
      fs.appendFile('log.txt', "Country: " + body.Country);
      fs.appendFile('log.txt', "Language" + body.Language);
      fs.appendFile('log.txt', "Plot: " + body.Plot);
      fs.appendFile('log.txt', "Actors: " + body.Actors);
      fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + body.tomatoRating);
      fs.appendFile('log.txt', "Rotten Tomatoes URL: " + body.tomatoURL);
    } else {
      console.log('Error');
    }
    if(movie === "Reefer Madness") {
      console.log("---------------");
      console.log("If you haven't watched 'Reefer Madness' then you should: http://www.imdb.com/title/tt0028346/?ref_=nv_sr_2");
      console.log("It's on YouTube!");

      fs.appendFile('log.txt', "-------------");
      fs.appendFile('log.txt', "If you haven't watched 'Reefer Madness' then you should: http://www.imdb.com/title/tt0028346/?ref_=nv_sr_2");
      fs.appendFile('log.txt', "It's on YouTube!");
    }
  });
}

function doWhatItSays() {
  fs.readFile('random.txt', "utf8", function(error, data) {
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}
