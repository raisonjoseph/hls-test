const videojs = window.videojs;
const VideoJsButtonClass = videojs.getComponent("MenuButton");
const VideoJsMenuClass = videojs.getComponent("Menu");
const VideoJsMenuItemClass = videojs.getComponent("MenuItem");
const VideoJsComponent = videojs.getComponent("Component");
const Dom = videojs.dom;

/**
 * Extend vjs button class for quality button.
 */

const QualityButton = videojs.extend(VideoJsButtonClass, {
  constructor: function (player) {
    VideoJsButtonClass.call(this, player);
  }, // notice the comma

  createItems: function () {
    return [];
  },

  createMenu: function () {
    const menu = new VideoJsMenuClass(this.player_, { menuButton: this });

    this.hideThreshold_ = 0;

    // Add a title list item to the top
    if (this.options_.title) {
      const titleEl = Dom.createEl("li", {
        className: "vjs-menu-title",
        innerHTML: this.options_.title,
        tabIndex: -1,
      });
      const titleComponent = new VideoJsComponent(this.player_, {
        el: titleEl,
      });

      this.hideThreshold_ += 1;

      menu.addItem(titleComponent);
    }

    this.items = this.createItems();

    if (this.items) {
      // Add menu items to the menu
      for (let i = 0; i < this.items.length; i++) {
        menu.addItem(this.items[i]);
      }
    }

    return menu;
  },
});

/**
 * Extend vjs menu item class for quality button.
 * @param {Object} item - Item object
 * @param {*} setQuality  Function to set quality
 * @param {ConcreteButton} qualityButton - The containing button.
 * @returns
 */
const QualityButtonItem = videojs.extend(VideoJsMenuItemClass, {
  constructor: function (player, item, setQuality, qualityButton) {
    VideoJsMenuItemClass.call(this, player, {
      label: item.label,
      selectable: true,
    });
    this.item = item;
    this.setQuality = setQuality;
    this.qualityButton = qualityButton;
    this.selected(item.selected || false);
  },

  handleClick: function () {
    for (let i = 0; i < this.qualityButton.items.length; ++i) {
      this.qualityButton.items[i].selected(false);
    }
    // Set this menu item to selected, and set quality.
    this.setQuality(this.item.value);
    this.selected(true);
  },
});

function QualitySelector() {
  function init(player) {
    this.player = player;
    this.config = {
      displayCurrentQuality: true,
    };
    createQualityButton();
    this.player
      .qualityLevels()
      .on("addqualitylevel", onAddQualityLevel.bind(this));
  }

  function createQualityButton() {
    const player = this.player;

    this.qualityButton = new QualityButton(player);

    const placementIndex = player.controlBar.children().length - 2;
    const qualityButtonInstance = player.controlBar.addChild(
      this.qualityButton,
      { componentClass: "qualitySelector" },
      this.config.placementIndex || placementIndex
    );

    setButtonInnerText("auto");
    qualityButtonInstance.addClass("vjs-quality-selector");
    qualityButtonInstance.removeClass("vjs-hidden");
  }

  function setButtonInnerText(text) {
    this.qualityButton.menuButton_.$(".vjs-icon-placeholder").innerHTML = text;
  }

  function setQuality(height) {
    const qualityList = this.player().qualityLevels();

    // Set quality on plugin
    this.currentQuality = height;

    setButtonInnerText(height === "auto" ? height : height + "p");

    for (let i = 0; i < qualityList.length; ++i) {
      const quality = qualityList[i];

      quality.enabled = quality.height === height || height === "auto";
    }
    this.qualityButton.unpressButton();
  }

  function getQualityMenuItem(item) {
    return new QualityButtonItem(
      this.player,
      item,
      setQuality,
      this.qualityButton
    );
  }

  /**
   * Executed when a quality level is added from HLS playlist.
   */

  function onAddQualityLevel() {
    const player = this.player;
    const qualityList = player.qualityLevels();
    const levels = qualityList.levels_ || [];
    const levelItems = [];

    for (let i = 0; i < levels.length; ++i) {
      if (
        !levelItems.find((existing) => existing.item.value === levels[i].height)
      ) {
        const levelItem = getQualityMenuItem.call(this, {
          label: levels[i].height + "p",
          value: levels[i].height,
        });
        levelItems.push(levelItem);
      }
    }

    levelItems.sort(function (current, next) {
      if (!current || !next) {
        return -1;
      }
      if (current.item.value < next.item.value) {
        return -1;
      }
      if (current.item.value > next.item.value) {
        return 1;
      }
      return 0;
    });

    levelItems.push(
      getQualityMenuItem.call(this, {
        label: player.localize("Auto"),
        value: "auto",
        selected: true,
      })
    );

    if (this.qualityButton) {
      this.qualityButton.createItems = function () {
        return levelItems;
      };
      this.qualityButton.update();
    }
  }
  return init;
}
