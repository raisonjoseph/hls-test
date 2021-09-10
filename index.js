const createSeekButton = (player) => {
  const videojs = window.videojs;
  const buttonClass = videojs.getComponent("Button");
  const seekButtonClass = videojs.extend(buttonClass, {
    // The `init()` method will also work for constructor logic here, but it is
    // deprecated. If you provide an `init()` method, it will override the
    // `constructor()` method!
    constructor: function () {
      buttonClass.call(this, player);
      this.el().classList.add("take-quiz");
      this.el().innerHTML = "Take Quiz";
    }, // notice the comma

    handleClick: function () {
      // Do your stuff
      const playerInstance = this.player();
      playerInstance.trigger("quiz_take");
    },
  });
  return seekButtonClass;
};

// vjs 5/6 support
const registerPlugin = videojs.registerPlugin || videojs.plugin;

/**
 * Initialization function for the qualityLevels plugin. Sets up the QualityLevelList and
 * event handlers.
 *
 * @param {Player} player Player object.
 * @param {Object} options Plugin options object.
 * @function initPlugin
 */
const initPlugin = function (player, options) {
  console.log('hi')
  const originalPluginFn = player.qualityLevels;

  const qualityLevelList = {}

  const disposeHandler = function () {
    qualityLevelList.dispose();
    player.qualityLevels = originalPluginFn;
    player.off("dispose", disposeHandler);
  };

  player.on("dispose", disposeHandler);

  player.qualityLevels = () => qualityLevelList;

  return qualityLevelList;
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @param {Object} options Plugin options object
 * @function qualityLevels
 */
const quality = function (options) {
  console.log('ih')
  return initPlugin(this, videojs.mergeOptions({}, options));
};

// Register the plugin with video.js.
registerPlugin("quality", quality);

var player = (window.player = videojs("player", {
  muted: true,
  fill: true,
  fluid: true,
  controlBar: {
    timeDivider: false,
    durationDisplay: false,
    remainingTimeDisplay: false,
    customControlSpacer: true,
  },
  html5: {
    vhs: {
      overrideNative: false,
      withCredentials: false,
      handleManifestRedirects: true,
    },
    nativeVideoTracks: false,
    nativeAudioTracks: false,
    nativeTextTracks: false,
  },
}));
const levels = Object.assign({}, player.qualityLevels());
const qualitySelector = QualitySelector();
qualitySelector(player);

player.src({
  src: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
});
const forwardSeekButton = createSeekButton(player, "forward");
player.addChild(new forwardSeekButton(), {}, 2);
