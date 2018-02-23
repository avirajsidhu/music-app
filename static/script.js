document.addEventListener('DOMContentLoaded',function() {
	state.resetIsPlaying();
	loadTrack(playlist.tracks[0].albumArt,playlist.tracks[0].name,playlist.tracks[0].artist,playlist.tracks[0].time,playlist.tracks[0].url);
	createList(playlist.tracks);
});

var state = ( function() {
	var currentTrack = 0,
		songCount    = 0;

	var playing     = false,
		isFirstPlay = false;

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
        setIsFirstPlaying: function() {
			return isFirstPlay = true;
		},
		resetIsFirstPlaying: function() {
			return isFirstPlay = false;
		},
		isFirstPlaying : function() {
            return isFirstPlay;
        },
	}

})();

var loadTrack = function(art,titleVal,artistVal,endTimeVal, url) {
	var imageBox = document.getElementById("imageBox");
	imageBox.src = art;

	var title = document.getElementById("title");
	title.innerHTML = titleVal;

	var artist = document.getElementById("artist");
	artist.innerHTML = artistVal;

	var player = document.getElementById("playerTag");
	player.src = url;

	var endTime = document.getElementById("endTime");
	endTime.innerHTML = endTimeVal;

	state.resetIsFirstPlaying();
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
			loadTrack(playlist.tracks[item.id].albumArt,playlist.tracks[item.id].name,playlist.tracks[item.id].artist,playlist.tracks[item.id].time,playlist.tracks[item.id].url);
            playAll(item.id);
            state.setCurrentTrack(item.id);
            playPauseToggle(true);
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
	initSeekBar();
	playPauseToggle(true);

	state.resetIsFirstPlaying();

	var player = document.getElementById("playerTag");

	if(state.isPlaying()) {
		var player = document.getElementById("playerTag");
		player.play();
	}
	else {
		playAll(state.getCurrentTrack());
	}
}

document.getElementById("nextControl").onclick = function() {
	playPauseToggle(true);
	
	var trackNo = state.nextTrack();
	loadTrack(playlist.tracks[trackNo].albumArt,playlist.tracks[trackNo].name,playlist.tracks[trackNo].artist,playlist.tracks[trackNo].time,playlist.tracks[trackNo].url);

	playAll(state.getCurrentTrack());
}

document.getElementById("previousControl").onclick = function() {
	playPauseToggle(true);
	
	var trackNo = state.previousTrack();
	loadTrack(playlist.tracks[trackNo].albumArt,playlist.tracks[trackNo].name,playlist.tracks[trackNo].artist,playlist.tracks[trackNo].time,playlist.tracks[trackNo].url);

	playAll(state.getCurrentTrack());
}

document.getElementById("pauseControl").onclick = function() {
	state.setIsPlaying();
    var player = document.getElementById("playerTag");
    player.pause();
    playPauseToggle(false);
};



var playAll = function(trackNo) {
	state.setIsFirstPlaying();
    var player = document.getElementById("playerTag");
    player.src = playlist.tracks[trackNo].url;
    player.play();

    initSeekBar();

    player.addEventListener("ended", function() {
        player.pause();
        state.resetIsFirstPlaying();
	    document.getElementById("nextControl").click();
	    state.setCurrentTrack(++trackNo);
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

function calculateTotalValue(length) {
  	var minutes = Math.floor(length / 60),
    seconds_int = (length - minutes * 60).toFixed(),
    seconds_str = seconds_int.toString(),
    seconds = seconds_str.substr(0, 2),
    time = minutes + ':' + seconds

  	return time;
}

function calculateCurrentValue(currentTime) {
	
	var current_hour = parseInt(currentTime / 3600) % 24,
    current_minute = parseInt(currentTime / 60) % 60,
    current_seconds_long = currentTime % 60,
    current_seconds = current_seconds_long.toFixed(),
    current_time = (current_minute < 10 ? "0" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);

	return current_time;
}

function initSeekBar() {
	var player = document.getElementById('playerTag');
	var length = player.duration;
	var current_time = player.currentTime;

	document.getElementById("playerTag").ontimeupdate = function() {
		current_time = player.currentTime;
		var currentTime = calculateCurrentValue(current_time);
		document.getElementById("startTime").innerHTML = currentTime;
		var seekBar = document.getElementById('seekBar');
		seekBar.value = (player.currentTime / player.duration)*100;

		var progressBar = document.getElementById("progressBar");

		if(state.isFirstPlaying()) {
			progressBar.style.width = "0%";	
			state.resetIsFirstPlaying();
		}
		else {
			progressBar.style.width = (seekBar.value/1.05)+"%";			}
	}

  // calculate current value time
  
  	seekBar.addEventListener("click", seek);

	function seek(event) {
	    var percent = event.offsetX / this.offsetWidth;
	    player.currentTime = percent * player.duration;
	    seekBar.value = percent / 100;
  	}
};


function openNav() {
    document.getElementById("playList").style.width = "60%";
}

function closeNav() {
    document.getElementById("playList").style.width = "0";
    
}