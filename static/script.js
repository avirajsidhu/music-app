-
document.addEventListener('DOMContentLoaded',function() {
	state.resetIsPlaying();
	loadTrack(playlist.tracks[0].albumArt,playlist.tracks[0].name,playlist.tracks[0].artist,playlist.tracks[0].time,playlist.tracks[0].url);
	createList(playlist.tracks);
});

var state = ( function() {
	var currentTrack = 0,
		songCount    = 0;

	var playing;

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
		},
		setIsPlaying: function() {
			return playing = true;
		},
		resetIsPlaying: function() {
			return playing = false;
		},
		isPlaying : function() {
            return playing;
        },
        getSongDivId : function() {
            return songCount++;
        },
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

var createList = function(tracks) {
	var playList = document.getElementById("playList");
	
	tracks.map(function(item) {
		var sliderSongDiv = document.createElement("DIV");
		sliderSongDiv.id = "song" + state.getSongDivId();

		var sliderArt = document.createElement("IMG");
		sliderArt.className = "albumArtSlide";
		sliderArt.src = item.albumArt;

		var sliderTitle = document.createElement("SPAN");
		sliderTitle.className = "titleSlide";
		sliderTitle.innerHTML = item.name;

		var sliderTime = document.createElement("TIME");
		sliderTime.className = "duration";
		sliderTime.innerHTML = item.time;

		sliderSongDiv.onclick = function() {
            playAll(item.id);
            playPauseToggle(true);
            loadTrack(playlist.tracks[item.id].albumArt,playlist.tracks[item.id].name,playlist.tracks[item.id].artist,playlist.tracks[item.id].time,playlist.tracks[item.id].url);
            closeNav();
        }

		sliderSongDiv.appendChild(sliderArt);
		sliderSongDiv.appendChild(sliderTitle);
		sliderSongDiv.appendChild(sliderTime);

		playList.appendChild(sliderSongDiv);
	});
}


//player methods
document.getElementById("playControl").onclick = function() {
	playPauseToggle(true);
	var player = document.getElementById("playerTag");
	if(state.isPlaying) {
		player.play();
	}
	else {
		playAll(state.getCurrentTrack());
	}
}

document.getElementById("nextControl").onclick = function() {
	playPauseToggle(true);
	playAll(state.nextTrack());

	var trackNo = state.getCurrentTrack();
	loadTrack(playlist.tracks[trackNo].albumArt,playlist.tracks[trackNo].name,playlist.tracks[trackNo].artist,playlist.tracks[trackNo].time,playlist.tracks[trackNo].url);
}

document.getElementById("previousControl").onclick = function() {
	playPauseToggle(true);
	playAll(state.previousTrack());
	var trackNo = state.getCurrentTrack();
	loadTrack(playlist.tracks[trackNo].albumArt,playlist.tracks[trackNo].name,playlist.tracks[trackNo].artist,playlist.tracks[trackNo].time,playlist.tracks[trackNo].url);
}

document.getElementById("pauseControl").onclick = function() {
	state.setIsPlaying();
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
            loadTrack(playlist.tracks[trackNo++].albumArt,playlist.tracks[trackNo++].name,playlist.tracks[trackNo++].artist,playlist.tracks[trackNo++].time,playlist.tracks[trackNo++].url);
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