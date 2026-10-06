const challenges = [
  {
    name: "Fairway finder",
    category: "accuracy",
    difficulty: "easy",
    description: "Choose a safe target and finish the hole without a penalty stroke.",
    bonus: "Earn 1 bonus point for hitting the fairway from the tee."
  },
  {
    name: "Three-quarter swing",
    category: "accuracy",
    difficulty: "medium",
    description: "Use a controlled three-quarter swing on your tee shot.",
    bonus: "Earn 2 bonus points if the ball finishes in play."
  },
  {
    name: "Center of the green",
    category: "approach",
    difficulty: "medium",
    description: "On your approach, aim for the middle of the green rather than the flag.",
    bonus: "Earn 2 bonus points for a green in regulation."
  },
  {
    name: "Up-and-down attempt",
    category: "approach",
    difficulty: "hard",
    description: "If you miss the green, try to get down in two strokes from beside the green.",
    bonus: "Earn 3 bonus points for getting up and down."
  },
  {
    name: "One-putt focus",
    category: "putting",
    difficulty: "hard",
    description: "Read the first putt carefully and try to hole out in one putt.",
    bonus: "Earn 3 bonus points for a one-putt green."
  },
  {
    name: "Leave it close",
    category: "putting",
    difficulty: "easy",
    description: "On your first putt, prioritize leaving the ball within a putter length.",
    bonus: "Earn 1 bonus point if your next putt is a tap-in."
  },
  {
    name: "Pick your line",
    category: "creativity",
    difficulty: "medium",
    description: "Before you play, describe your intended shot shape and target to your group.",
    bonus: "Earn 2 bonus points if the shot finishes in play."
  },
  {
    name: "Club down",
    category: "club_strategy",
    difficulty: "medium",
    description: "Take one club less than usual on your approach and play a smooth shot.",
    bonus: "Earn 2 bonus points if you hit the green."
  },
  {
    name: "Three-club hole",
    category: "club_strategy",
    difficulty: "hard",
    description: "Play this hole using no more than three clubs of your choice.",
    bonus: "Earn 3 bonus points if you finish without changing your club selection."
  },
  {
    name: "Bump-and-run",
    category: "creativity",
    difficulty: "easy",
    description: "When practical around the green, choose a low-running chip instead of a lofted one.",
    bonus: "Earn 1 bonus point if the ball finishes on the putting surface."
  }
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

const clubs = [
  "Driver", "3-wood", "5-iron", "7-iron",
  "9-iron", "Pitching wedge", "Sand wedge", "Putter"
];

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
    const teamA = document.querySelector("#team-a").value.trim() || "Team A";
    const teamB = document.querySelector("#team-b").value.trim() || "Team B";

    const heading = document.createElement("strong");
    heading.textContent = `${teamA} vs. ${teamB}`;

    const note = document.createElement("p");
    note.textContent =
      "Both teams play the same challenge. Award 2 battle points to the team with the lower hole score; ties earn 1 point each. Add any challenge bonus points after the hole.";

    instructionBox.append(heading, note);
  } else if (mode === "skill_builder") {
    const heading = document.createElement("strong");
    heading.textContent = `Skill focus: ${categoryNames[challenge.category]}`;

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