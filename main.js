let p_act = 1;

var buscaPokemon = async (request) => {
    try {
        const response = await axios.get(request);
        console.log(response.data)
        return(response.data);
    } catch (error) {
        console.log(error)
        throw("Error con la base de datos");
    }
};

var pintaPokemon = (p) => {
    let tipus_array = p.types;
    let tipus = tipus_array[0].type.name;
    for(let i = 1; i < tipus_array.length; ++i) {
        tipus += ` & ${tipus_array[i].type.name}`;
    }
    let hm_array = p.moves.HM;
    let hm;
    if (hm_array === null) hm = "none";
    else hm = hm_array[0];
    $("#pokemon-row").append(`
        <tr id="pokemon">
            <th scope="row" class="align-middle">${p.num}</th>
            <td colspan="4" class="align-middle"><img src="${p.images[0].front}"/></td>
            <td colspan="4" class="align-middle"><img src="${p.images[1].front_shiny}"/></td>
            <td colspan="2" class="align-middle">${p.name}</td>
            <td colspan="3" class="align-middle">${tipus}</td>
            <td class="align-middle">${hm}</td>  
        </tr>                     
    `);
};

const pokemonInici = () => {
    var request = "https://jedi-pokemon.herokuapp.com/pokemons/1";
    buscaPokemon(request)
        .then(p =>  pintaPokemon(p))
        .catch(err => console.log(err))
};

const actualitza = () => {
    var request = `https://jedi-pokemon.herokuapp.com/pokemons/${p_act}`;
    console.log("He entrat a actualitza");
    buscaPokemon(request)
        .then(p => {
            console.log("He entrat al then");
            $("#pokemon").remove();
            pintaPokemon(p);
        })
        .catch(err => console.log(err))
};

const next = () => {
    if (p_act === 6) p_act = 1;
    else p_act++;
    actualitza();
}

const prev = () => {
    if (p_act === 1) p_act = 6;
    else p_act--;
    actualitza();
}

const search = () => {
    var t =  $("#text").val();
    let nom = isNaN(t);
    let request;
    if (nom) request = `https://jedi-pokemon.herokuapp.com/pokemons/?name=${t}`;
    else request = `https://jedi-pokemon.herokuapp.com/pokemons/?num=${t}`;
    buscaPokemon(request)
        .then(p => {
            p_act = p[0].id;
            console.log("He trobat el pokemn");
            actualitza();
        })
        .catch(err => console.log(err));
}

$( window ).on("load", function() {
    pokemonInici();
    $("#next").on("click", next);
    $("#prev").on("click", prev);
    $("#search").on("click", search); 
})
