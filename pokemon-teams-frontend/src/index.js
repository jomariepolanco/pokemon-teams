const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const main = document.querySelector("main")

main.addEventListener("click", event => {
    if (event.target.tagName === "BUTTON" && event.target.textContent === "Add Pokemon" && event.target.nextElementSibling.children.length < 6) {
        addNewPokemonPost(event.target.dataset.trainerId)
            .then(response => response.json())
            .then((pokemon)=> {
                const pokeCardUl = document.querySelector(`.card [data-trainer-id='${event.target.dataset.trainerId}']`).nextElementSibling
                const li = document.createElement("li")
                li.textContent = `${pokemon.nickname} (${pokemon.species})`
                const pokeButton = document.createElement("button")
                pokeButton.className = "release"
                pokeButton.dataset.pokemonId = pokemon.id 
                pokeButton.textContent = "Release"
                li.append(pokeButton)
                pokeCardUl.append(li)
        })
    } else if (event.target.tagName === "BUTTON" && event.target.textContent === "Release") {
        const pokemonObj = {
            id: event.target.dataset.pokemonId,
            nickname: event.target.parentElement.textContent.split(" ")[0],
            species: event.target.parentElement.textContent.split(" ")[1].split("(")[1].split(")")[0],
            trainer_id: event.target.closest("div").dataset.id
        }
        deletePokemon(pokemonObj, event.target.dataset.pokemonId)
            .then(response => response.json())
            .then(() => {
                console.log("success")
                event.target.parentElement.remove()
            })
    }
})

const deletePokemon = (pokemon, id) => {
    return fetch(`${POKEMONS_URL}/${id}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
    })
}

const addNewPokemonPost = id => {
    return fetch(POKEMONS_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({trainer_id: id})
    })
}

const renderTrainerCards = trainers => {
    trainers.forEach(trainer => {
        const div = document.createElement("div")
        div.className = "card"
        div.dataset.id = trainer.id 
        const p = document.createElement("p")
        p.textContent = trainer.name
        const button = document.createElement("button")
        button.dataset.trainerId = trainer.id 
        button.textContent = "Add Pokemon"
        const ul = document.createElement("ul")
        
        trainer.pokemons.forEach(pokemon => {
            const li = document.createElement("li")
            li.textContent = `${pokemon.nickname} (${pokemon.species})`
            const pokeButton = document.createElement("button")
            pokeButton.className = "release"
            pokeButton.dataset.pokemonId = pokemon.id 
            pokeButton.textContent = "Release"
            li.append(pokeButton)
            ul.append(li)
        })

    div.append(p, button, ul)
    main.append(div)
    })
}

const initialize = () => {
    return fetch(TRAINERS_URL)
        .then(response => response.json())
        .then(trainerData => renderTrainerCards(trainerData))
}
initialize()