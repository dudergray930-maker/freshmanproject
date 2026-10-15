const challenges = [
  { name: "Fairway finder", category: "accuracy", difficulty: "easy", description: "Choose a safe target and finish the hole without a penalty stroke.", bonus: "Earn 1 bonus point for hitting the fairway from the tee." },
  { name: "Three-quarter swing", category: "accuracy", difficulty: "medium", description: "Use a controlled three-quarter swing on your tee shot.", bonus: "Earn 2 bonus points if the ball finishes in play." },
  { name: "Center of the green", category: "approach", difficulty: "medium", description: "On your approach, aim for the middle of the green rather than the flag.", bonus: "Earn 2 bonus points for a green in regulation." },
  { name: "Up-and-down attempt", category: "approach", difficulty: "hard", description: "If you miss the green, try to get down in two strokes from beside the green.", bonus: "Earn 3 bonus points for getting up and down." },
  { name: "One-putt focus", category: "putting", difficulty: "hard", description: "Read the first putt carefully and try to hole out in one putt.", bonus: "Earn 3 bonus points for a one-putt green." },
  { name: "Leave it close", category: "putting", difficulty: "easy", description: "On your first putt, prioritize leaving the ball within a putter length.", bonus: "Earn 1 bonus point if your next putt is a tap-in." },
  { name: "Pick your line", category: "creativity", difficulty: "medium", description: "Before you play, describe your intended shot shape and target to your group.", bonus: "Earn 2 bonus points if the shot finishes in play." },
  { name: "Club down", category: "club_strategy", difficulty: "medium", description: "Take one club less than usual on your approach and play a smooth shot.", bonus: "Earn 2 bonus points if you hit the green." },
  { name: "Three-club hole", category: "club_strategy", difficulty: "hard", description: "Play this hole using no more than three clubs of your choice.", bonus: "Earn 3 bonus points if you finish without changing your club selection." },
  { name: "Bump-and-run", category: "creativity", difficulty: "easy", description: "When practical around the green, choose a low-running chip instead of a lofted one.", bonus: "Earn 1 bonus point if the ball finishes on the putting surface." }
];

const modifiers = [
  { name: "Safe play", description: "Avoid hazards and penalty areas on this hole.", points: 1 },
  { name: "Opposite-hand putt", description: "Take one putt from outside the leather with your non-dominant hand.", points: 2 },
  { name: "No gimme", description: "Hole out every putt; no conceded putts on this hole.", points: 1 },
  { name: "Birdie boost", description: "A birdie or better earns 2 extra bonus points.", points: 2 },
  { name: "Tee-box choice", description: "Your group chooses a safe tee marker permitted by the course.", points: 1 },
  { name: "Recovery credit", description: "A recovery shot that returns the ball to play earns 1 extra point.", points: 1 },
  { name: "Quiet focus", description: "Keep quiet while each player makes their tee shot.", points: 1 },
  { name: "Two-club limit", description: "Choose two clubs before teeing off and use only those clubs on this hole.", points: 2 }
];

const clubs = ["Driver", "3-wood", "5-iron", "7-iron", "9-iron", "Pitching wedge", "Sand wedge", "Putter"];
const categoryNames = {
  accuracy: "Accuracy",
  creativity: "Creativity",
  club_strategy: "Club strategy",
  putting: "Putting",
  approach: "Approach play"
};
const modeNames = {
  classic: "Classic",
  chaos: "Chaos Mode",
  one_club: "One-Club",
  team_battle: "Team Battle",
  skill_builder: "Skill Builder"
};

const form = document.querySelector("#challenge-form");
const modeInputs = document.querySelectorAll('input[name="mode"]');
const modeHint = document.querySelector("#modifier-hint");
const modifierSelect = document.querySelector("#modifier-count");
const categorySelect = document.querySelector("#category");
const oneClubFields = document.querySelector("#one-club-fields");
const teamFields = document.querySelector("#team-fields");
const modifierControls = document.querySelector("#modifier-controls");
const resultPanel = document.querySelector("#result");
const errorMessage = document.querySelector("#error-message");

function selectedMode() {
  return document.querySelector('input[name="mode"]:checked').value;
}

function updateModeFields() {
  const mode = selectedMode();
  const noModifiers = mode === "one_club" || mode === "skill_builder";

  oneClubFields.hidden = mode !== "one_club";
  teamFields.hidden = mode !== "team_battle";
  modifierControls.hidden = noModifiers;

  modeHint.textContent = mode === "chaos"
    ? "(Chaos uses at least 2)"
    : "(Choose 0 to 3)";

  for (const option of modifierSelect.options) {
    option.disabled = mode === "chaos" && Number(option.value) < 2;
  }

  if (mode === "chaos" && Number(modifierSelect.value) < 2) {
    modifierSelect.value = "2";
  }

  if (noModifiers) {
    modifierSelect.value = "0";
  }

  const clubStrategy = categorySelect.querySelector(
    'option[value="club_strategy"]'
  );

  clubStrategy.disabled = mode === "one_club";

  if (mode === "one_club" && categorySelect.value === "club_strategy") {
    categorySelect.value = "any";
  }
}

function choose(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function displayChallenge() {
  const mode = selectedMode();
  const category = categorySelect.value;
  const difficulty = document.querySelector("#difficulty").value;

  const challengePool = challenges.filter((challenge) =>
    (category === "any" || challenge.category === category) &&
    (difficulty === "any" || challenge.difficulty === difficulty) &&
    (mode !== "one_club" || challenge.category !== "club_strategy")
  );

  errorMessage.hidden = true;

  if (challengePool.length === 0) {
    errorMessage.textContent =
      "No challenges match those filters. Try a different category or difficulty.";
    errorMessage.hidden = false;
    resultPanel.hidden = true;
    return;
  }

  const challenge = choose(challengePool);
  let selectedModifiers = [];

  if (mode !== "one_club" && mode !== "skill_builder") {
    let count = Number(modifierSelect.value);

    if (mode === "chaos") {
      count = Math.max(count, 2);
    }

    selectedModifiers = [...modifiers]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }

  document.querySelector("#result-mode").textContent = modeNames[mode];
  document.querySelector("#result-category").textContent =
    categoryNames[challenge.category];
  document.querySelector("#result-title").textContent = challenge.name;

  const difficultyBadge = document.querySelector("#result-difficulty");
  difficultyBadge.textContent = challenge.difficulty;
  difficultyBadge.className = `difficulty difficulty-${challenge.difficulty}`;

  document.querySelector("#result-description").textContent =
    challenge.description;
  document.querySelector("#result-bonus").textContent = challenge.bonus;

  const instructionBox = document.querySelector("#mode-instruction");
  instructionBox.replaceChildren();
  instructionBox.hidden = false;

  if (mode === "one_club") {
    const clubSelect = document.querySelector("#club");
    const club = clubSelect.value === "random"
      ? choose(clubs)
      : clubSelect.value;

    clubSelect.value = club;

    const heading = document.createElement("strong");
    heading.textContent = `Round club: ${club}`;

    const note = document.createElement("p");
    note.textContent =
      `Use only your ${club} for every shot on this hole. Keep the same club for the whole round.`;

    instructionBox.append(heading, note);
  } else if (mode === "team_battle") {
    const teamASelect = document.querySelector("#team-a");
    const teamBSelect = document.querySelector("#team-b");

    if (teamASelect.value && teamASelect.value === teamBSelect.value) {
      errorMessage.textContent = "Choose two different teams for Team Battle.";
      errorMessage.hidden = false;
      resultPanel.hidden = true;
      return;
    }

    const teamA = teamASelect.value
      ? teamASelect.selectedOptions[0].textContent
      : "Team A";
    const teamB = teamBSelect.value
      ? teamBSelect.selectedOptions[0].textContent
      : "Team B";

    const heading = document.createElement("strong");
    heading.textContent = `${teamA} vs. ${teamB}`;

    const note = document.createElement("p");
    note.textContent =
      "Both teams play the same challenge. Award 2 battle points to the team with the lower hole score; ties earn 1 point each. Add any challenge bonus points after the hole.";

    instructionBox.append(heading, note);
  } else if (mode === "skill_builder") {
    const heading = document.createElement("strong");
    heading.textContent =
      `Skill focus: ${categoryNames[challenge.category]}`;

    const note = document.createElement("p");
    note.textContent =
      "Choose a clear target, make your shot, then discuss one thing you learned.";

    instructionBox.append(heading, note);
  } else {
    instructionBox.hidden = true;
  }

  const modifierSection = document.querySelector("#modifier-results");
  const modifierList = document.querySelector("#modifier-list");
  modifierList.replaceChildren();
  modifierSection.hidden = selectedModifiers.length === 0;

  let pointTotal = 0;

  for (const modifier of selectedModifiers) {
    pointTotal += modifier.points;

    const card = document.createElement("article");
    card.className = "modifier";

    const icon = document.createElement("span");
    icon.className = "modifier-icon";
    icon.textContent = "✳";

    const text = document.createElement("div");

    const title = document.createElement("strong");
    title.textContent = modifier.name;

    const description = document.createElement("p");
    description.textContent = modifier.description;

    text.append(title, description);

    const points = document.createElement("span");
    points.className = "points";
    points.textContent = `+${modifier.points}`;

    card.append(icon, text, points);
    modifierList.append(card);
  }

  document.querySelector("#points-total").textContent =
    `Up to ${pointTotal} modifier bonus points`;

  resultPanel.hidden = false;
}

modeInputs.forEach((input) => {
  input.addEventListener("change", updateModeFields);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  displayChallenge();
});

document.querySelector("#generate-again").addEventListener("click", displayChallenge);

updateModeFields();

// Week 5 player and team records are saved as JSON in this browser.
const DATA_KEY = "golfquest-week5-data";
const emptyData = { players: [], teams: [] };
const playerForm = document.querySelector("#player-form");
const teamForm = document.querySelector("#team-form");
const playerList = document.querySelector("#player-list");
const teamList = document.querySelector("#team-list");
const playerTeamSelect = document.querySelector("#player-team");
const teamASelect = document.querySelector("#team-a");
const teamBSelect = document.querySelector("#team-b");
const playerCount = document.querySelector("#player-count");
const storageStatus = document.querySelector("#storage-status");
let groupData = loadGroupData();

function loadGroupData() {
  try {
    const saved = JSON.parse(localStorage.getItem(DATA_KEY));

    if (saved && Array.isArray(saved.players) && Array.isArray(saved.teams)) {
      return saved;
    }
  } catch (error) {
    console.warn("Could not read saved GolfQuest data.", error);
  }

  return { ...emptyData };
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function saveGroupData(message = "Saved in this browser") {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(groupData));
    storageStatus.textContent = message;
    storageStatus.classList.remove("error-text");
  } catch (error) {
    storageStatus.textContent = "Could not save. Export a JSON backup.";
    storageStatus.classList.add("error-text");
  }
}

function addOption(select, value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  select.append(option);
}

function refreshTeamOptions() {
  const previousPlayerTeam = playerTeamSelect.value;
  const previousA = teamASelect.value;
  const previousB = teamBSelect.value;

  playerTeamSelect.replaceChildren();
  addOption(playerTeamSelect, "", "No team");

  teamASelect.replaceChildren();
  addOption(teamASelect, "", "Team A — select a team");

  teamBSelect.replaceChildren();
  addOption(teamBSelect, "", "Team B — select a team");

  for (const team of groupData.teams) {
    addOption(playerTeamSelect, team.id, team.name);
    addOption(teamASelect, team.id, team.name);
    addOption(teamBSelect, team.id, team.name);
  }

  if (groupData.teams.some((team) => team.id === previousPlayerTeam)) {
    playerTeamSelect.value = previousPlayerTeam;
  }

  if (groupData.teams.some((team) => team.id === previousA)) {
    teamASelect.value = previousA;
  }

  if (groupData.teams.some((team) => team.id === previousB)) {
    teamBSelect.value = previousB;
  }

  if (!teamASelect.value && groupData.teams[0]) {
    teamASelect.value = groupData.teams[0].id;
  }

  if (!teamBSelect.value && groupData.teams[1]) {
    teamBSelect.value = groupData.teams[1].id;
  }
}

function renderTeams() {
  teamList.replaceChildren();

  if (groupData.teams.length === 0) {
    const note = document.createElement("p");
    note.className = "small-note";
    note.textContent = "No teams yet.";
    teamList.append(note);
  }

  for (const team of groupData.teams) {
    const row = document.createElement("div");
    row.className = "saved-row";

    const name = document.createElement("span");
    const memberCount = groupData.players.filter(
      (player) => player.teamId === team.id
    ).length;
    name.textContent = `${team.name} · ${memberCount} players`;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.textContent = "Remove";

    remove.addEventListener("click", () => {
      groupData.teams = groupData.teams.filter((item) => item.id !== team.id);
      groupData.players = groupData.players.map((player) =>
        player.teamId === team.id ? { ...player, teamId: "" } : player
      );
      saveGroupData();
      renderGroupData();
    });

    row.append(name, remove);
    teamList.append(row);
  }
}

function renderPlayers() {
  playerList.replaceChildren();
  playerCount.textContent = `${groupData.players.length} of 8 players`;

  if (groupData.players.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No players yet. Add your group above.";
    playerList.append(empty);
    return;
  }

  for (const player of groupData.players) {
    const team = groupData.teams.find((item) => item.id === player.teamId);
    const row = document.createElement("div");
    row.className = "player-row";

    const name = document.createElement("strong");
    name.textContent = player.name;

    const handicap = document.createElement("span");
    handicap.textContent = `Handicap: ${Number(player.handicap).toFixed(1)}`;

    const teamName = document.createElement("span");
    teamName.className = "player-team-name";
    teamName.textContent = team ? team.name : "No team";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${player.name}`);

    remove.addEventListener("click", () => {
      groupData.players = groupData.players.filter((item) => item.id !== player.id);
      saveGroupData();
      renderGroupData();
    });

    row.append(name, handicap, teamName, remove);
    playerList.append(row);
  }
}

function renderGroupData() {
  refreshTeamOptions();
  renderTeams();
  renderPlayers();
}

teamForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameInput = document.querySelector("#new-team-name");
  const name = nameInput.value.trim();

  if (!name) return;

  if (groupData.teams.some((team) => team.name.toLowerCase() === name.toLowerCase())) {
    storageStatus.textContent = "A team with that name already exists.";
    storageStatus.classList.add("error-text");
    return;
  }

  groupData.teams.push({ id: makeId(), name });
  nameInput.value = "";
  saveGroupData("Team added and saved");
  renderGroupData();
});

playerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#player-name").value.trim();
  const handicap = Number(document.querySelector("#player-handicap").value);
  const teamId = playerTeamSelect.value;

  if (groupData.players.length >= 8) {
    storageStatus.textContent = "A group can have up to 8 players.";
    storageStatus.classList.add("error-text");
    return;
  }

  if (!name || !Number.isFinite(handicap) || handicap < 0 || handicap > 54) {
    storageStatus.textContent = "Enter a name and a handicap from 0 to 54.";
    storageStatus.classList.add("error-text");
    return;
  }

  groupData.players.push({ id: makeId(), name, handicap, teamId });
  document.querySelector("#player-name").value = "";
  document.querySelector("#player-handicap").value = "0";
  saveGroupData("Player added and saved");
  renderGroupData();
});

document.querySelector("#export-json").addEventListener("click", () => {
  const file = new Blob([JSON.stringify(groupData, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "golfquest-players.json";
  link.click();
  URL.revokeObjectURL(url);
  storageStatus.textContent = "JSON backup downloaded";
});

const importFile = document.querySelector("#import-json-file");

document.querySelector("#import-json-button").addEventListener("click", () => {
  importFile.click();
});

importFile.addEventListener("change", async () => {
  const file = importFile.files[0];
  if (!file) return;

  try {
    const imported = JSON.parse(await file.text());

    if (!Array.isArray(imported.players) || !Array.isArray(imported.teams)) {
      throw new Error("The file must contain players and teams lists.");
    }

    if (imported.players.length > 8) {
      throw new Error("The JSON file has more than 8 players.");
    }

    const validTeams = imported.teams
      .filter((team) => team && typeof team.name === "string" && team.name.trim())
      .map((team) => ({
        id: String(team.id || makeId()),
        name: team.name.trim().slice(0, 24)
      }));

    const validTeamIds = new Set(validTeams.map((team) => team.id));

    const validPlayers = imported.players.map((player) => {
      const handicap = Number(player.handicap);

      if (
        !player ||
        typeof player.name !== "string" ||
        !player.name.trim() ||
        !Number.isFinite(handicap) ||
        handicap < 0 ||
        handicap > 54
      ) {
        throw new Error("Each player needs a name and a handicap from 0 to 54.");
      }

      return {
        id: String(player.id || makeId()),
        name: player.name.trim().slice(0, 32),
        handicap,
        teamId: validTeamIds.has(String(player.teamId || ""))
          ? String(player.teamId)
          : ""
      };
    });

    groupData = { players: validPlayers, teams: validTeams };
    saveGroupData("JSON data imported and saved");
    renderGroupData();
  } catch (error) {
    storageStatus.textContent = `Import failed: ${error.message}`;
    storageStatus.classList.add("error-text");
  }

  importFile.value = "";
});

renderGroupData();