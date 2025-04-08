(function (VideoPlayer, $, undefined) {

  var IsIE = function() {
    var sAgent = window.navigator.userAgent;
    var Idx = sAgent.indexOf("MSIE");
    if (Idx > 0 || !!navigator.userAgent.match(/Trident\/7\./)) {
      return true;
    }
    return false;
  };

  VideoPlayer.PauseAll = function() {
    $(".new-player").removeAttr("playing");
    if($(".new-player video").length > 0) {
      $(".new-player video").each(function() {
        if(typeof $(this)[0].pause !== "undefined") {
          $(this)[0].pause();
        }
      });
    }
  };

  VideoPlayer.InitPlayers = function(selector) {
    var element;
    if(selector instanceof jQuery) {
      element = selector;
    }
    else {
      element = $(selector);
    }
    element.each(function(index) {
      var $this = $(this);
      if($this.hasClass("video-player-init-done")) {
        $("video").each(function() {
          $(this)[0].pause();
        });
        return false;
      }
      $this.addClass("video-player-init-done");
      var source = $this.find('video').attr("pbyg-data-src-id");
      var subtitlesId = "T_" + source.replace(' ', '');
      var settings = {
        audio: ($this.attr("data-audio") === "false" ? false : true),
        fullscreen: ($this.attr("data-fullscreen") === "false" ? false : true),
        subtitles: ($this.attr("data-subtitles") === "true" ? true : false),
        pathPrefix: 'assets/videoplayer/images/'
      };

      var subtitlesContainer = $this.find('.new-player-subtitles');
      if(settings.subtitles) {
        $this.addClass("cc-active");
      }

      var $video = $this.find('video');
      var video = $video[0];
      var videoDuration = video.duration;
      var videoWidth = video.parentElement.style.width;
      var videoHeight = video.parentElement.style.height;

      if(subtitles.hasOwnProperty(subtitlesId)) {
          for(var i=0; i < subtitles[subtitlesId].tracks.length; i++) {
              var tempP = $('<p data-start="'+subtitles[subtitlesId].tracks[i].start+'" data-end="'+subtitles[subtitlesId].tracks[i].end+'" style="display:none;"></p>').html(subtitles[subtitlesId].tracks[i].text).appendTo(subtitlesContainer);
              tempP.css("direction", subtitles[subtitlesId].tracks[i].direction);
          }
      }
      else {
          console.warn("Missing or wrong subtitles Id: "+subtitlesId, $this);
      }

      var footer = $this.find('.new-player-footer');
      var controlsContainer = $('<div class="new-player-controls"></div>').appendTo(footer);

      var playPauseControl = $('<div class="new-player-play-pause-btn"></div>').appendTo(controlsContainer);
      var playBtn = $('<span class="new-player-play-icon"><img src="'+settings.pathPrefix+'new-player-play.png" /></span>').appendTo(playPauseControl);
      var pauseBtn = $('<span class="new-player-pause-icon"><img src="'+settings.pathPrefix+'new-player-pause.png" /></span>').appendTo(playPauseControl);

      if(settings.audio && !navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        var volumeControl = $('<div class="new-player-volume-control"></div>').appendTo(controlsContainer);
        $('<div class="volume-icon"><img src="'+settings.pathPrefix+'new-player-audio.png" /></div>').appendTo(volumeControl).on("click", function() {
          if($video.hasClass("muted")) {
            if(typeof $video.data("volume") !== "undefined") {
              video.volume = $video.data("volume");
            }
            else {
              video.volume = 1;
            }
            $video.removeData("volume");
            $video.removeClass("muted");
          }
          else {
            $video.data("volume", video.volume);
            video.volume = 0;
            $video.addClass("muted");
          }
          UpdateVolumeData(video.volume*100);
        });
        var volumeSlider = $('<div class="new-player-volume-slider"></div>').appendTo(volumeControl);

        var volumeBackground = $('<div class="new-player-volume-progress-background">').appendTo(volumeSlider);
        var volumeBar = $('<div class="new-player-volume-progress-over"></div>').appendTo(volumeBackground);
        var volumeDown = false;
        var volumeHandle = $('<div class="new-player-volume-progress-hidden"></div>').appendTo(volumeSlider);
      }

      var indicator = $('<div class="new-player-indicator">0:00 / 0:00</div>').appendTo(controlsContainer);

      var progressContainer = $('<div class="new-player-progress"></div>').appendTo(controlsContainer);
      var progressBackground = $('<div class="new-player-progress-background">').appendTo(progressContainer);
      var progressBar = $('<div class="new-player-progress-over"></div>').appendTo(progressBackground);
      var progressDown = false;
      var progressHandle = $('<div class="new-player-progress-hidden"></div>').appendTo(progressContainer);

      if(settings.fullscreen) {
        var fullscreenBtn = $(' <div class="new-player-fullscreen"><img class="open-fullscreen" src="'+settings.pathPrefix+'new-player-fullscreen.png" /><img class="close-fullscreen" src="'+settings.pathPrefix+'new-player-close-fullscreen.png" /></div>').appendTo(controlsContainer);
      }
      var accessabilityBtn = $(' <div class="new-player-accessability"><img src="'+settings.pathPrefix+'new-player-accessability.png" /></div>').appendTo(controlsContainer);

      // Event handlers
      if (navigator.userAgent.match(/ANDROID/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/NOKIA/i)) {
        progressHandle.on("touchstart", function(e) {
          var touchmove = function(event) {
            if(progressDown) {
              UpdateProgress(event.touches[0].pageX);
            }
          };
          var touchend = function(event) {
            e.target.removeEventListener("touchmove", touchmove);
            e.target.removeEventListener("touchend", touchend);

            UpdateProgress(event.changedTouches[0].pageX, true);
            setTimeout(function() {
              progressDown = false;
              var playing = $this.attr("data-playing");
              $this.removeAttr("data-playing");
              if(playing == "true") {
                var playPromise = video.play();
                if (playPromise !== undefined) {
                  // play is async, so we run the then when it's ready
                  playPromise
                    .then(function() {})
                    .catch(function() {});
                }
              }
            }, 10);
          };
          if($this.attr("playing") == "true") {
            $this.attr("data-playing", "true");
          }
          e.target.addEventListener("touchmove", touchmove);
          e.target.addEventListener("touchend", touchend);
          video.pause();
          progressDown = true;
          setTimeout(function() {
            UpdateProgress(e.originalEvent.touches[0].pageX);
          }, 10);
        });

        if(settings.audio && !navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
          volumeHandle.on("touchstart", function(e) {
            var touchmove = function(event) {
              if(volumeDown) {
                UpdateVolume(event.touches[0].pageX);
              }
            };
            var touchend = function(event) {
              e.target.removeEventListener("touchmove", touchmove);
              e.target.removeEventListener("touchend", touchend);
              if(volumeDown) {
                volumeDown = false;
              }
            };
            e.target.addEventListener("touchmove", touchmove);
            e.target.addEventListener("touchend", touchend);
            volumeDown = true;
            UpdateVolume(e.originalEvent.touches[0].pageX);
          });
        }
      }
      else {
        progressHandle.on("mousedown", function(e) {
          if($this.attr("playing") == "true") {
            $this.attr("data-playing", "true");
          }
          video.pause();
          progressDown = true;
          UpdateProgress(e.pageX);
        }).on("mousemove", function(e) {
          if(progressDown) {
            UpdateProgress(e.pageX);
          }
        });

        $(document).on("mouseup", function(e) {
          if(progressDown) {
            UpdateProgress(e.pageX);
            progressDown = false;
            var playing = $this.attr("data-playing");
            $this.removeAttr("data-playing");
            if(playing == "true") {
              var playPromise = video.play();
              if(!IsIE()) {
                if (playPromise !== undefined) {
                  // play is async, so we run the then when it's ready
                  playPromise.then(function() {

                  })
                    .catch(function() {

                    });
                }
              }
            }
          }
          if(volumeDown) {
            volumeDown = false;
          }
        });

        if(settings.audio) {
          volumeHandle.on("mousedown", function(e) {
            volumeDown = true;
            UpdateVolume(e.pageX);
          }).on("mousemove", function(e) {
            if(volumeDown) {
              UpdateVolume(e.pageX);
            }
          });
        }
      }

      var updateProgressTimeout = null;
      var controlShow = null;
      $this.on("touchmove mousemove", function() {
        if(IsFullscreen()) {
          $("body").css("cursor", "inherit");
          clearTimeout(controlShow);
          footer.slideDown(180);
          controlShow = setTimeout(function() {
            if(IsFullscreen()) {
              footer.slideUp(180);
              $("body").css("cursor", "none");
            }
          }, 1500);
        }
      });

      video.addEventListener("play", function() {
        $this.attr("playing", "true");
      });
      video.addEventListener("pause", function() {
        $this.removeAttr("playing");
      });
      video.addEventListener("loadeddata", function() {
        videoDuration = video.duration;
        ProgressVideo();
      }, false);
      video.addEventListener("timeupdate", function() {
        ProgressVideo();
      }, false);
      if(subtitles.hasOwnProperty(subtitlesId)) {
        video.ontimeupdate = function() {
          var currentTime = video.currentTime;
          subtitlesContainer.find("p").each(function() {
            var start = $(this).attr("data-start");
            var end = $(this).attr("data-end");
            if((currentTime*1) > (start*1)) {
              $(this).show();
            }
            else {
              $(this).hide();
            }
            if((currentTime*1) > (end*1)) {
              $(this).hide();
            }
          });
        };
      }

      playBtn.on("click", function() {
        video.play();
      });

      pauseBtn.on("click", function() {
        video.pause();
      });

      if(settings.fullscreen) {
        fullscreenBtn.on("click", function() {
          if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement && !$this.hasClass("fullscreen"))
          {
            if (document.documentElement.requestFullscreen)
            {
              document.documentElement.requestFullscreen();
            }
            else if (document.documentElement.msRequestFullscreen)
            {
              document.documentElement.msRequestFullscreen();
            }
            else if (document.documentElement.mozRequestFullScreen)
            {
              document.documentElement.mozRequestFullScreen();
            }
            else if (document.documentElement.webkitRequestFullscreen)
            {
              document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
            $this.addClass("fullscreen");
            video.parentElement.style.width = null;
            video.parentElement.style.height = null;
            footer[0].style.width = null;
            subtitlesContainer[0].style.width = null;
            controlShow = setTimeout(function() {
              if(IsFullscreen()) {
                footer.slideDown(180);
                $("body").css("cursor", "none");
              }
            }, 1500);
          }
          else
          {
            if (document.exitFullscreen)
            {
              document.exitFullscreen();
            }
            else if(document.msExitFullscreen)
            {
              document.msExitFullscreen();
            }
            else if (document.mozCancelFullScreen)
            {
              document.mozCancelFullScreen();
            }
            else if (document.webkitExitFullscreen)
            {
              document.webkitExitFullscreen();
            }
            $this.removeClass("fullscreen");
            video.parentElement.style.width = videoWidth;
            video.parentElement.style.height = videoHeight;
            footer[0].style.width = videoWidth;
            subtitlesContainer[0].style.width = videoWidth;
          }
        });
      }

      // Only enable accessabilityButton if any subtitles exist for the video
      if (subtitles.hasOwnProperty(subtitlesId)) {
        accessabilityBtn.on("click", function() {
          $this.toggleClass("cc-active");
          setTimeout(function() {
            ResizeVideos();
          }, 100);
        });
      }

      // Functions
      var ProgressVideo = function() {
        SetIndicator(video.currentTime, videoDuration);
        var percent = (100 / videoDuration) * video.currentTime;
        progressBar.css("width", percent+"%");
      };

      var UpdateProgress = function(pageX, forceUpdate) {
        var position = pageX - progressHandle.offset().left;
        var percent = Math.min(Math.max(100 * position / progressHandle.width(), 0), 100);


        SetIndicator(((videoDuration / 100) * percent), videoDuration);

        // Don't update video before we are done dragging progress bar on small devices
        if (forceUpdate === true || (!navigator.userAgent.match(/ANDROID/i) && !navigator.userAgent.match(/iPhone|iPad|iPod/i) && !navigator.userAgent.match(/NOKIA/i))) {
          UpdateVideo(percent);
        }

        progressBar.css("width", percent+"%");
      };

      var UpdateVideo = function(percent) {
        // Using a timeout to set the currentTime so we don't set it multiple times per millisecond
        clearTimeout(updateProgressTimeout);
        updateProgressTimeout = setTimeout(function() {
          video.currentTime = videoDuration * percent / 100;
        }, 10);
      };

      var SetIndicator = function(start, end) {
        var startDate = new Date(null);
        startDate.setSeconds(start);
        var endDate = new Date(null);
        endDate.setSeconds(end);
        indicator.html(startDate.toISOString().substr(11, 8)+" / "+endDate.toISOString().substr(11, 8));
      };

      if(settings.audio && !navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        var UpdateVolume = function(pageX) {
          var position = pageX - volumeHandle.offset().left;
          var percent = Math.min(Math.max(100 * position / volumeHandle.width(), 0), 100);
          UpdateVolumeData(percent);
        };

        var UpdateVolumeData = function(percent) {
          volumeBar.css("width", percent+"%");
          video.volume = percent/100;
        };
      }
    });
  };
}(window.VideoPlayer = window.VideoPlayer || {}, jQuery));

if (document.onfullscreenchange === null) {
  document.onfullscreenchange = OnFullScreenChange;
}
else if (document.onmsfullscreenchange === null) {
  document.onmsfullscreenchange = OnFullScreenChange;
}
else if (document.onmozfullscreenchange === null) {
  document.onmozfullscreenchange = OnFullScreenChange;
}
else if (document.onwebkitfullscreenchange === null) {
  document.onwebkitfullscreenchange = OnFullScreenChange;
}

function OnFullScreenChange() {
  if(!IsFullscreen()) {
    $("body").css("cursor", "inherit");
    var fullscreen = $(".fullscreen");
    var footer = fullscreen.find(".new-player-footer");
    var videoContainer = fullscreen.find(".new-player-video")[0];
    var video = fullscreen.find("video");
    var videoWidth = `${video.attr('width')}px`;
    var videoHeight = `${video.attr('height')}px`;
    footer.show();
    footer[0].style.width = videoWidth;
    videoContainer.style.width = videoWidth;
    videoContainer.style.height = videoHeight;
    fullscreen.removeClass("fullscreen");
  }
}

function IsFullscreen() {
  // If no element is returned it means there is no fullscreen anymore
  // We change the potential null to a boolean by inverting it ( ! ) twice.
  if(navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
    return $(".fullscreen").length != 0;
  }
  return !!(document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement);
}