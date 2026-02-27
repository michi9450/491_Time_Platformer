let gameStarted = false;
const totalLevels = 20; // Total planned levels
const availableLevels = 5; // Currently available levels

// Generate level grid
function generateLevelGrid() {
  const levelGrid = document.getElementById("levelGrid");
  levelGrid.innerHTML = "";

  for (let i = 1; i <= totalLevels; i++) {
    const levelCard = document.createElement("div");
    levelCard.className =
      i <= availableLevels ? "level-card" : "level-card locked";

    const levelNumber = document.createElement("div");
    levelNumber.className = "level-number";
    levelNumber.textContent = i;

    const levelStatus = document.createElement("div");
    levelStatus.className = "level-status";
    levelStatus.textContent = i <= availableLevels ? "Available" : "Locked";

    levelCard.appendChild(levelNumber);
    levelCard.appendChild(levelStatus);

    if (i <= availableLevels) {
      levelCard.addEventListener("click", () => startLevel(i));
    }

    levelGrid.appendChild(levelCard);
  }
}

// Start level
function startLevel(levelNum) {
  document.getElementById("levelSelect").classList.add("hidden");
  document.getElementById("mainMenu").classList.add("hidden");
  location.href = location.pathname + "?level=" + levelNum;
}

// Initialize and start the game
function initializeGame(levelNum = 1) {
  if (typeof window.startGame === "function") {
    window.startGame(levelNum);
  }
  document.getElementById("gameWorld").focus();
  document.getElementById("backToMenuBtn").classList.remove("hidden");
}

// Back to menu function
function goBackToMenu() {
  location.href = location.pathname;
}

// Check if a level was selected via URL parameter
window.addEventListener("load", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const level = urlParams.get("level");
  if (level) {
    const levelNum = parseInt(level);
    if (levelNum >= 1 && levelNum <= availableLevels) {
      document.getElementById("mainMenu").classList.add("hidden");
      const checkAssets = setInterval(function () {
        if (window.assetsLoaded) {
          clearInterval(checkAssets);
          initializeGame(levelNum);
        }
      }, 100);
    }
  }
});

// Menu navigation
document.getElementById("playButton").addEventListener("click", () => {
  document.getElementById("mainMenu").classList.add("hidden");
  initializeGame(1); // Play Now starts at level 1
});

document.getElementById("levelsButton").addEventListener("click", () => {
  document.getElementById("levelSelect").classList.remove("hidden");
});

document.getElementById("directionsButton").addEventListener("click", () => {
  document.getElementById("directionsModal").classList.remove("hidden");
});

document.getElementById("backToMenu").addEventListener("click", () => {
  document.getElementById("levelSelect").classList.add("hidden");
});

document.getElementById("closeDirections").addEventListener("click", () => {
  document.getElementById("directionsModal").classList.add("hidden");
});

document
  .getElementById("backToMenuBtn")
  .addEventListener("click", goBackToMenu);

  document.getElementById('playAgainBtn').addEventListener('click', () => {
            location.href = location.pathname + '?level=1';
        });

        document.getElementById('backToMainMenu').addEventListener('click', () => {
            location.href = location.pathname;
        });
// Initialize level grid on page load
generateLevelGrid();

const muteBtn = document.getElementById("mutebutton");
const volumeSlider = document.getElementById("volumeSlider");
let isMuted = false;
let lastVolume = 1;
function setVolume(value) {
    if (window.GAME_ENGINE && window.GAME_ENGINE.sound) {
      const sound = window.GAME_ENGINE.sound;
      if (sound.masterGain) {
        sound.masterGain.gain.value = value;
      }
    }
    volumeSlider.value = value;
    muteBtn.textContent = value === 0 ? "🔇" : value < 0.5 ? "🔉" : "🔊";
}
muteBtn.addEventListener("click", () => {
    if (isMuted) {
        isMuted = false;
        setVolume(lastVolume);
    } else {
        isMuted = true;
        lastVolume = parseFloat(volumeSlider.value);
        setVolume(0);
    }
});

volumeSlider.addEventListener("input", () => {
    isMuted = false;
    lastVolume = parseFloat(volumeSlider.value);
    setVolume(lastVolume);
});
function resizeGame() {
    const baseWidth = 1600;
    const baseHeight = 700;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const scaleX = windowWidth / baseWidth;
    const scaleY = windowHeight / baseHeight;

    const scale = Math.min(scaleX, scaleY);

    const gameContainer = document.getElementById("gameContainer");

    gameContainer.style.transform = `scale(${scale})`;

    // Center it
    const scaledWidth = baseWidth * scale;
    const scaledHeight = baseHeight * scale;

    gameContainer.style.position = "absolute";
    gameContainer.style.left = `${(windowWidth - scaledWidth) / 2}px`;
    gameContainer.style.top = `${(windowHeight - scaledHeight) / 2}px`;
}
window.addEventListener("resize", resizeGame);
window.addEventListener("load", resizeGame);

// Show congratulations screen
        window.showCongratsScreen = function() {
            document.getElementById('backToMenuBtn').classList.add('hidden');
            document.getElementById('congratsScreen').classList.remove('hidden');
        };