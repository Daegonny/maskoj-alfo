const playersInput = document.getElementById("players");
const playersLabel = document.getElementById("players-label");
const hasExtraCardInput = document.getElementById("has-extra-card");
const generateButton = document.getElementById("generate");
const scenarioSection = document.getElementById("scenario");

const cards = [
    {
        "id": 0,
        "name": "Juiz",
        "has_star": false,
        "min_required": 4
    },
    {
        "id": 1,
        "name": "Benfeitor",
        "has_star": true,
        "min_required": 6
    },
    {
        "id": 2,
        "name": "Bobo",
        "has_star": true,
        "min_required": 4
    },
    {
        "id": 3,
        "name": "Bruxa",
        "has_star": false,
        "min_required": 4
    },
    {
        "id": 4,
        "name": "Campones",
        "has_star": true,
        "min_required": 8
    },
    {
        "id": 5,
        "name": "Campones",
        "has_star": true,
        "min_required": 8
    },
    {
        "id": 6,
        "name": "Espiao",
        "quantity": 1,
        "has_star": false,
        "min_required": 6
    },
    {
        "id": 7,
        "name": "Guru",
        "has_star": false,
        "min_required": 8
    },
    {
        "id": 8,
        "name": "Imperatriz",
        "has_star": true,
        "min_required": 4
    },
    {
        "id": 9,
        "name": "Ladrao",
        "has_star": false,
        "min_required": 4
    },
    {
        "id": 10,
        "name": "Manipulador",
        "quantity": 1,
        "has_star": false,
        "min_required": 6
    },
    {
        "id": 11,
        "name": "Pedinte",
        "has_star": false,
        "min_required": 4
    },
    {
        "id": 12,
        "name": "Princesa",
        "has_star": true,
        "min_required": 6
    },
    {
        "id": 13,
        "name": "Rei",
        "has_star": true,
        "min_required": 4
    },
    {
        "id": 14,
        "name": "Traidor",
        "has_star": false,
        "min_required": 4
    },
    {
        "id": 15,
        "name": "Vigarista",
        "has_star": false,
        "min_required": 4
    },
    {
        "id": 16,
        "name": "Viuva",
        "has_star": true,
        "min_required": 4
    }

]

function get_subsets(set, size) {
    const subsets = [];

    function backtrack(start = 0, current_subset = []) {
        if (current_subset.length == size) {
            subsets.push([...current_subset]);
            return;
        }

        for (let i = start; i < set.length; i++) {
            current_subset.push(set[i]);
            backtrack(i + 1, current_subset);
            current_subset.pop();
        }
    }

    backtrack()

    return subsets;
}

function contains_judge(set) {
    return set.some((card) => card.name == "Juiz");
}

function contains_zero_or_two_peasants(set) {
    const peasants = set.filter((card) => card.name == "Campones");
    return peasants.length == 0 || peasants.length == 2;
}

function allowed_according_to_min_required(set) {
    const size = set.length;
    return set.every((card) => card.min_required <= size);
}

function contains_min_required_stars(set) {
    const size = set.length
    const stars = set.filter((card) => card.has_star).length
    return stars / size >= 0.333333
}

function contains_max_required_stars(set) {
    const size = set.length
    const stars = set.filter((card) => card.has_star).length
    return stars / size <= 0.5
}

function is_valid(set) {
    return contains_judge(set) &&
        contains_zero_or_two_peasants(set) &&
        allowed_according_to_min_required(set) &&
        contains_min_required_stars(set) &&
        contains_max_required_stars(set);
}

function get_valid_subsets(set, size) {
    const subsets = get_subsets(set, size);
    return subsets
        .filter((subset) => is_valid(subset))
        .map((subset) => subset.map((card) => card.id));
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function get_random_scenario(valid_subsets_map, size) {
    const valid_subsets = valid_subsets_map[size];
    const random_index = getRandomInt(valid_subsets.length);
    const scenario = valid_subsets[random_index].map((id) => cards[id]);
    scenario.sort((a, b) => a.name.localeCompare(b.name));
    return scenario;
}

const valid_subsets = {};
for (let i = 4; i <= 13; i++) {
    valid_subsets[i] = get_valid_subsets(cards, i);
}

playersInput.addEventListener("change", () => {
    const players = parseInt(playersInput.value);
    const text = `Quantidade de jogadores: ${players}`;
    playersLabel.innerHTML = text;
})

generateButton.addEventListener("click", () => {
    scenarioSection.innerHTML = "";

    const players = parseInt(playersInput.value);
    const hasExtraCard = hasExtraCardInput.checked;
    const total_cards = hasExtraCard ? (players + 1) : players;

    const scenario = get_random_scenario(valid_subsets, total_cards);
    render(scenario);
})

function render(scenario) {
    const cardsHeader = document.createElement("h2");
    cardsHeader.textContent = "Cartas";
    const cardsList = document.createElement("ul");

    scenario.forEach((card) => {
        const cardItem = document.createElement("li");
        cardItem.textContent = `${card.name}`;
        cardsList.appendChild(cardItem);
    });

    scenarioSection.appendChild(cardsHeader);
    scenarioSection.appendChild(cardsList);
}