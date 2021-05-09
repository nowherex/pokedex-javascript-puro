const getPokemonByIdUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`
const ul = document.querySelector('[data-js="pokedex"]')
let pokemonPromises = []
let currentIndice = 50


const fetchPokemons = index => fetch(getPokemonByIdUrl(index + 1)).then(response => response.json())

const generatePokemonPromieses = () => Array(50).fill().map((_, index) => fetchPokemons(index))


const generateHtml = pokemons => pokemons.reduce((accumulator, { name, id, types, sprites }) => {
    let urlImage = id => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
    const elementTypes = types.map(typeinfo => typeinfo.type.name)

    accumulator += `
    <li class="card ${elementTypes[0]}">
        <img class="card-image" alt="${name}" src="${urlImage(id)}" />
        <h2 class="card-title">${id}. ${name}</h2>
        <p class="card-subtitle">${elementTypes.join(' | ')}</p>
    </li>
    `
    return accumulator

}, '')


const promisesGenerateAndInsert = pokemonPromises => Promise.all(pokemonPromises)
    .then(generateHtml)
    .then(insertPokemonIntoPage)


const loadMore = () => {
    let newIndice = 0
    for (newIndice = currentIndice; newIndice < currentIndice + 50 && currentIndice < 850; newIndice++) {
        pokemonPromises.push(fetchPokemons(newIndice))
    }
    promisesGenerateAndInsert(pokemonPromises)
    currentIndice = newIndice


}

const insertPokemonIntoPage = pokemons => {
    ul.innerHTML = pokemons

}


pokemonPromises = generatePokemonPromieses()
promisesGenerateAndInsert(pokemonPromises)



window.addEventListener('scroll', () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight > scrollHeight - 5) {
        loadMore()
    }
});