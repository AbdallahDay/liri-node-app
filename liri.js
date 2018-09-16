require("dotenv").config();

var keys = require("./keys");
var request = require("request");
var fs = require("fs");
var Spotify = require("node-spotify-api");
var moment = require("moment");

var spotify = new Spotify(keys.spotify);

var Concert = function (artist) {
    const URL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;
        
    request(URL, function(err, res, body) {
        if(err) throw err;

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
    spotify.search({ type: "track", query: (song ? song : "The Sign") }, function(err, body) {
        if (err) throw err;

        var data = body.tracks.items[0];

        //TODO: parse and format data
        //Artist(s)
        //Song name
        //Preview link
        //Album

        var output = [
            "Artist(s): " + data.artists[0].name,
            "Song name: " + data.name,
            "Preview: " + data.preview_url,
            "Album: " + data.album.name
        ].join("\n");

        console.log(output);
    })
};

var Movie = function (movie) {
    var URL = `http://www.omdbapi.com/?apikey=${keys.omdb.apikey}&t=${movie}`;

    request(URL, function(err, res, body) {
        if (err) throw err;

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

var DoWhatItSays = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) throw error;

        var cmd = data.split(",")[0];
        var term = data.split(",")[1];

        executeCommand(cmd, term);
    });
};

var executeCommand = function (cmd, term) {
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
            DoWhatItSays();
            break;
    }
}

const cmd = process.argv[2];
const term = process.argv.slice(3).join(" ");

executeCommand(cmd, term);