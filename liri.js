//*****************************************************************************
//Variables********************************************************************
//*****************************************************************************
var firstUserInput = process.argv[2];
var secondUserInput = process.argv[3];

var fs = require("fs");

//*****************************************************************************
//Twitter**********************************************************************
//*****************************************************************************
function twitter() {
    var Twitter = require('twitter');

    var twitterkeys = require("./keys.js");

    var client = new Twitter({
        consumer_key: twitterkeys.consumer_key,
        consumer_secret: twitterkeys.consumer_secret,
        access_token_key: twitterkeys.access_token_key,
        access_token_secret: twitterkeys.access_token_secret
    });

    var params = {
        screen_name: 'aegir09',
        count: 20
    };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            tweets.forEach(function (currentTweet) {
                console.log(currentTweet.created_at.split(' +0000') + ': ' + currentTweet.text);
            });
            // console.log(tweets);
        } else {
            console.log('error', error);
        }
    });
}
//*****************************************************************************
//Spotify**********************************************************************
//*****************************************************************************
function spotify(data) {
    var Spotify = require('node-spotify-api');

    var spotify = new Spotify({
        id: '189872eaea9e471aadf8bdcda4cba4bf',
        secret: '9ea9faeae2504a00a78f3d45c4d1d490'
    });

    spotify
        .search({
            type: 'track',
            query: data,
            limit: 1
        })
        .then(function (response) {
            // console.log(JSON.stringify(response, null, 2));
            console.log('* Artist: ' + response.tracks.items[0].album.artists[0].name);
            console.log('* Song Name: ' + response.tracks.items[0].name);
            console.log('* Preview Link: ' + response.tracks.items[0].album.artists[0].external_urls.spotify);
            console.log('* Album: ' + response.tracks.items[0].album.name);

        })
        .catch(function (err) {
            console.log(err);
        });
}


//*****************************************************************************
//OMDB*************************************************************************
//*****************************************************************************
function movieThis() {
    var request = require("request");

    var movieTitle = secondUserInput.replace(" ", "+");

    request("http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=40e9cece", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("* Movie Title: " + JSON.parse(body).Title);
            console.log("* Year: " + JSON.parse(body).Year);
            console.log("* IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("* Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
            console.log("* Country: " + JSON.parse(body).Country);
            console.log("* Language: " + JSON.parse(body).Language);
            console.log("* Plot: " + JSON.parse(body).Plot);
            console.log("* Actors: " + JSON.parse(body).Actors);
            // console.log(JSON.parse(body));
        }
    });
}

//*****************************************************************************
//Do-what-it-says**************************************************************
//*****************************************************************************
function doIt() {
    // var doIt = require("./random.txt");


    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            return console.log(error);
        }

        var songTitle = data.split(',')[1];
        spotify(songTitle);

        // console.log(songTitle);
        // console.log(data);

    });

}

//*****************************************************************************
//User Input Logic*************************************************************
//*****************************************************************************
if (firstUserInput === 'my-tweets') {
    twitter();
} else if (firstUserInput === 'spotify-this-song') {
    if (!secondUserInput) {
        secondUserInput = 'The Sign';
        spotify(secondUserInput);
    } else {
        spotify(secondUserInput);
    }
} else if (firstUserInput === 'movie-this') {
    if (!secondUserInput) {
        secondUserInput = 'Mr.+Nobody';
        movieThis();
    } else {
        movieThis();
    }
} else if (firstUserInput === 'do-what-it-says') {
    doIt();
}