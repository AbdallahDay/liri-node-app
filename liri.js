require("dotenv").config();
var keys = require("./keys");
var request = require("request");
var moment = require("moment");
var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);

// Commands:

// concert-this <artist/band name>
// spotify-this-song <song name>
// movie-this <movie name>
// do-what-it-says

const cmd = process.argv[2];
const term = process.argv.split(3).join(" ");

switch (cmd) {
    case "concert-this":
        Concert(term);
        break;
    case "spotify-this-song":
        Song(term);
        break;
    case "movie-this":
        Movie(term);
        break;
    case "do-what-it-says":
        //
        break;
    default:
        //
}

var Concert = function (artist) {
    const URL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;
        
    var json = request(URL, function(err, res, body) {
        var events = JSON.parse(body);

        for (var i = 0; i < events.length; i++) {
            var data = events[i];

            var output = [
                "----------------------------------------------",
                "Venue: " + data.venue.name,
                "Location: " + data.venue.city + ", " + data.venue.region,
                "Date: " + moment(data.datetime).format("MM/DD/YYYY")
            ].join("\n");

            console.log(output);
        }
    });
};

var Song = function (song) {
    spotify.search({ type: "track", query: (song ? song : "The Sign") }, function(err, data) {
        if (err) throw err;

        console.log(data);//TEMP

        //TODO: parse and format data
        //Artist(s)
        //Song name
        //Preview link
        //Album
    })
};

var Movie = function (movie) {
    var URL = `http://www.omdbapi.com/?apikey=${keys.omdb.apikey}&t=${movie}`;

    var json = request(URL, function(err, res, body) {
        var data = JSON.parse(body);

        var output = [
            "Title: " + data.Title,
            "Year: " + data.Year,
            "Ratings:",
            "- IMDB: " + data.Ratings[0].Value,
            "- Rotten Tomatoes: " + data.Ratings[1].Value,
            "Country: " + data.Country,
            "Language: " + data.Language,
            "Plot: " + data.Plot,
            "Actors: " + data.Actors
        ].join("\n");

        console.log(output);
    });
}