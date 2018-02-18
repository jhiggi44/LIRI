// Dependencies
var Twitter = require('twitter');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: '888bb44d08f244afbe9f5606c111f96f',
    secret: 'be565e4e5b884ac7ac6a80ddf6a8b9cd'
});

var request = require('request');
var fs = require('fs');



// Establish command line arguments
var nodeArgv = process.argv;
var command = process.argv[2];
var title = process.argv[3];

switch (command) {
    case 'my-tweets':
        twitterFeed();
        console.log("fetching tweets...");
        break;
    case 'spotify-this-song':
        if (title) {
            spotifyThis(title);
        } else {
            spotifyThis("All the Small Things");
        }
        break;
    case 'movie-this':
    if (title) {
        omdbThis(title);
    } else {
        omdbThis("star wars");
    }
    break;
        
        break;
    case 'random':
        random();
        break;
}


function twitterFeed() {
    // Initialize the Twitter client
    var client = new Twitter(keys);

    // troubleshooting the client
    // console.log(client);

    // Screen name is set equal to my twitter handler
    var params = { screen_name: 'jhigcomm3580', count: 20 };

    //node the last 20 tweets
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            var errMessage = 'ERROR: something went wrong: ' + error;

            // Append the error message to the log file
            fs.appendFile('./log.txt', errMessage, (err) => {
                if (err) throw err;
                console.log(errMessage);
            });
            return;
        } else {
            // Pretty print user tweets
            var outputDisplay = '********************\n' +
                'User Tweets:\n' +
                '********************\n\n';

            for (var i = 0; i < tweets.length; i++) {
                outputDisplay += 'Posted on: ' + tweets[i].created_at + '\n' +
                    'Tweet: ' + tweets[i].text + '\n' +
                    '------------------------\n';
            }

            // write the output to the log file
            fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputDisplay + '\n', (err) => {
                if (err) throw err;
                console.log(outputDisplay);
            });
        }
    });
}

function spotifyThis(song) {


    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err + "\n \n Make sure you are using proper spelling and capitalization.");

            return;
        }
        else {
            // Pretty print user tweets
            var outputDisplay = '********************\n' +
                'Song Info:\n' +
                '********************\n\n';

            outputDisplay += 'Song: ' + data.tracks.items[0].name + '\n' +
                'Artist: ' + data.tracks.items[0].artists[0].name + '\n' +
                'Album: ' + data.tracks.items[0].album.name + '\n' +
                'Link to Song: ' + data.tracks.items[0].external_urls.spotify + '\n' +
                '-----END SONG INFO-----\n';

            // write the output to the log file
            fs.appendFile('./log.txt', 'Song Info:\n\n' + outputDisplay + '\n', (err) => {
                if (err) throw err;
                console.log(outputDisplay);
            });
        }
    });
}

function omdbThis(movieTitle) {

    // Runs a request to the OMDB API with the movie specified.
    var queryUrl = "http://www.omdbapi.com//?apikey=trilogy&t=" + movieTitle + "&y=&plot=short&tomatoes=true&r=json";

    request(queryUrl, function (err, response, body) {
        // Parses the body of the site and recovers movie info.
        var movie = JSON.parse(body);
        if (err) {
            console.log('Error occurred: ' + err + "\n \n Make sure you are using proper spelling and capitilization, and your query must be wrapped in quotation marks. For example, 'Star Wars'.");

            return;
        }
        else {
            // Pretty print user tweets
            var outputDisplay = '********************\n' +
                'Movie Info:\n' +
                '********************\n\n';

            outputDisplay += 'Title: ' + movie.Title + '\n' +
                'Released: ' + movie.Year + '\n' +
                'Plot: ' + movie.Plot + '\n' +
                'Actors: ' + movie.Actors + '\n' +
                'IMDB Rating: ' + movie.imdbRating + '\n' +
                'Rotten Tomatoes Rating: ' + movie.Ratings[2].Value + '\n' +
                'Produced In: ' + movie.Country + '\n' +
                'Language: ' + movie.Language + '\n' +

                '-----END SONG INFO-----\n';

            // write the output to the log file
            fs.appendFile('./log.txt', 'Song Info:\n\n' + outputDisplay + '\n', (err) => {
                if (err) throw err;
                console.log(outputDisplay);
            })
        }

    });
}