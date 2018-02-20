-
document.addEventListener('DOMContentLoaded',function() {
	console.log(playlist);
	loadTrack(playlist.tracks[0].albumArt,playlist.tracks[0].name,playlist.tracks[0].artist,playlist.tracks[0].time,playlist.tracks[0].url);
});

var state = ( function() {
	var currentTrack = 0;

	return {
		nextTrack: function() {
			currentTrack = (++currentTrack > 8) ? 8 : currentTrack;
			return currentTrack;
		},
		previousTrack: function() {
			currentTrack = (--currentTrack < 0) ? 0 : currentTrack;
			return currentTrack;
		},
		setCurrentTrack: function(song) {
			currentTrack = song;
		},
		getCurrentTrack: function() {
			return currentTrack;
		}
	}

})();

var loadTrack = function(art,titleVal,artistVal,endTimeVal) {
	var imageBox = document.getElementById("imageBox");
	imageBox.src = art;

	var title = document.getElementById("title");
	title.innerHTML = titleVal;

	var artist = document.getElementById("artist");
	artist.innerHTML = artistVal;

	var endTime = document.getElementById("endTime");
	endTime.innerHTML = endTimeVal;

	var player = document.getElementById("playerTag");
}


//player methods
document.getElementById("playControl").onclick = function() {
	playPauseToggle(true);
	var player = document.getElementById("playerTag");
	playAll(state.getCurrentTrack());
}

document.getElementById("nextControl").onclick = function() {
	playAll(state.nextTrack());

	var trackNo = state.getCurrentTrack();
	loadTrack(playlist.tracks[trackNo].albumArt,playlist.tracks[trackNo].name,playlist.tracks[trackNo].artist,playlist.tracks[trackNo].time,playlist.tracks[trackNo].url);
}

document.getElementById("previousControl").onclick = function() {
	playAll(state.previousTrack());
	var trackNo = state.getCurrentTrack();
	loadTrack(playlist.tracks[trackNo].albumArt,playlist.tracks[trackNo].name,playlist.tracks[trackNo].artist,playlist.tracks[trackNo].time,playlist.tracks[trackNo].url);
}

document.getElementById("pauseControl").onclick = function() {
    var player = document.getElementById("playerTag");
    player.pause();
    playPauseToggle(false);
};



var playAll = function(trackNo) {
	console.log(trackNo);
    var player = document.getElementById("playerTag");
    player.src = playlist.tracks[trackNo].url;
    player.play();

    player.addEventListener("ended", function() {
        player.pause();
        if(trackNo++<=playlist.tracks.length-1) {
            playAll(trackNo++);
            console.log("song changed");
        }
        else {
            playPauseToggle(false);
        }
    });
};

var playPauseToggle = function(toggleBool) {
    var play = document.getElementById("playControl");
    var pause = document.getElementById("pauseControl");

    if(toggleBool) {
        play.style.display = "none";
        pause.style.display = "block";
    }
    else {
        play.style.display = "block";
        pause.style.display = "none";
    }
};


function openNav() {
    document.getElementById("playList").style.width = "80%";
}

function closeNav() {
    document.getElementById("playList").style.width = "0";
    
}