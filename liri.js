require("dotenv").config();
//grab keys
var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var fs = require('fs');
var movie = '';
var songArray;

var command = process.argv[2];
var popCulture = '';

liri();
function liri() {
//switch case
  switch(command) {
    case "my-tweets":
      showTweets();
      break;
    case "spotify-this-song":
      spotifySong();
      break;
    case "movie-this":
      filmOmdb();
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("{Enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  }
}

function showTweets() {
  var userName = {screen_name: 'RalphWiley55', count: 20};
  client.get('statuses/user_timeline', userName, function(error, tweets, response) {
    if(!error) {
      for(var i = 0; i < tweets.length; i++) {
        var date = tweets[i].created_at;
        var dateArray = date.split('').slice(0, 3).join('-');
        console.log(tweets[i].text + '' + dateArray);
      }
    } else {
      console.log('Error')
    }
  });
}

function spotifySong() {
  spotify.search({ type: 'track', query: songArray}, function(error, data) {
    if(!error) {
      console.log('The song is ' + songArray.toUpperCase() + 'by' + data.tracks.items[0].artists[0].name + '. From the album, ' + data.tracks.items[0].album.name + 'Link: ' + data.tracks.items[0].artists[0].external_urls.spotify);
    } else {
      console.log('Error');
    }
  });
  if(popCulture !== '') {
    songArray = popCulture;
  } else if (!process.argv[3]) {
    songArray = 'When I Was Done Dying';
  } else {
    popCulture = process.argv;
    songArray = [];
    for(var i = 3; i < popCulture.length; i++) {
      songArray.push(popCulture[i]);
    }
    songArray = songArray.join('');
  }
}

function filmOmdb() {
  var omdbURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

  if(popCulture != '') {
    popCulture = popCulture.trim().replace('', '+');
    movie = popCulture;
  } else if(!process.argv[3]) {
    movie = 'Reefer+Madness';
  } else {
    popCulture = process.argv;
    for(var i = 3; i < popCulture.length; i++) {
      if(i > 3 && i < popCulture.length) {
        movie = movie + '+' + popCulture[i];
      } else {
        movie += popCulture[i];
      }
    }
  }
  request(omdbURL, function(error, response, body) {
    if(!error && response.statusCode == 200) {
      var body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      console.log("Rotten Tomatoes URL: " + body.tomatoURL);

    } else {
      console.log('Error');
  }
    if(movie === "Reefer Madness") {
      console.log("---------------");
      console.log("If you haven't watched 'Reefer Madness' then you should: http://www.imdb.com/title/tt0028346/?ref_=nv_sr_2");
      console.log("It's on YouTube!");
    }
  });
}

function doWhatItSays() {
  fs.readFile('random.txt', 'utf8', function(error, data) {
    var txt = data.split(',');
    command = txt[0];
    popCulture = txt[1];
    popCulture = popCulture.replace("", '');
    liri();
  });
}
