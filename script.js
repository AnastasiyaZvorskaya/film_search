let movie;
let movieID;

function sendRequest(method, url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.responseType = "json";
        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response)
            } else {
                resolve(xhr.response)

            }
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }
        xhr.send()
    })
}



function selectCard(element) {

    let card = undefined;
    let title = document.getElementById('text');
    let type = document.getElementById('type');
    let cont = document.getElementById('title');
    let form = document.getElementById('cardForm');
    let titleFilms = document.getElementById('titleFilms');
    if (card == cont) {
        form.style.display = "block";
        titleFilms.style.display = "block";
        card = undefined;
        let requestURL = `http://www.omdbapi.com/?s=${title.value}&apikey=9cfc115f&type=${type.value}`;
        sendRequest("GET", requestURL)
            .then(search => {
                let list = document.querySelector("#list");
                list.innerHTML = "";
                let newMovie = document.createElement("div");
                pagination.style.display = "block";
                titleFilms.style.display = "block";
                newMovie.className = "title";

                for (movie of search["Search"]) {

                    let cont = document.createElement("div");
                    cont.className = 'cont';
                    newMovie.appendChild(cont);

                    let img = document.createElement("div");
                    img.className = 'img';
                    cont.appendChild(img);

                    let image = document.createElement("img");
                    image.src = movie["Poster"];
                    img.appendChild(image);

                    let card = document.createElement("div");
                    card.className = 'card';
                    cont.appendChild(card);

                    let textName = document.createElement("div");
                    textName.className = 'textName';
                    textName.innerHTML = movie["Type"];
                    card.appendChild(textName);

                    let name = document.createElement("p");
                    name.className = 'name';

                    name.innerHTML = movie["Title"];
                    textName.appendChild(name);

                    let name1 = document.createElement("span");
                    name1.innerHTML += movie["Year"];
                    textName.appendChild(name1);

                    let button = document.createElement("button");
                    button.className = 'btn';

                    button.id = `${movie["imdbID"]}`;
                    button.innerHTML += `<span onclick="showDetails(this)" data-id="${movie["imdbID"]}">Detalis</span>`;
                    card.appendChild(button);
                    list.appendChild(newMovie);

                }
            })
            .catch(err => console.log(err));

        return false;
    } else {
        form.style.display = "none";
        titleFilms.style.display = "none";
        card = cont;
    }
    console.log(cont);

}
let pagination = document.querySelector(".pagination");
pagination.style.display = "none";
titleFilms.style.display = "none";
let selectFilms = document.querySelector(".selectFilms");
let type = document.querySelector("#type").value;


let list = document.querySelector("#list");
list.addEventListener("click", function (event) {
    if (event.target.closest(".btn")) {
        let bt = event.target.closest(".btn");
        console.log(bt);

        const requestURL1 = `http://www.omdbapi.com/?apikey=9cfc115f&i=${bt.id}`;
        sendRequest("GET", requestURL1)
            .then(search => {
                let newMovie = document.createElement("div");
                let details1 = document.querySelector(".selectFilms");
                newMovie.innerHTML = "";
                let infoFilm = document.querySelector("#infoFilm")
                infoFilm.style.display = "block";
                console.dir(search);
                // pagination.style.display = "block";
                newMovie.innerHTML += `<div class="wrapperDetails"><div><img src="${search["Poster"]}" 
                        class="imgDetails";></img></div><div><div class="text1"><span>Title: </span><span> ${search["Title"]}</span></div>
                        <div class="text1"><span>Released:</span><span> ${search["Released"]}</span></div><div class="text1"><span>Genre:</span>
                            <span> ${search["Genre"]}</span></div><div class="text1"><span>Country:</span><span> ${search["Country"]}</span>
                                </div><div class="text1"><span>Director:</span><span> ${search["Director"]}</span></div><div class="text1">
                                    <span>Writer:</span><span> ${search["Writer"]}</span></div><div class="text1"><span>Actors:</span><span> ${search["Actors"]}</span></div>
                                    <div class="text1"><span>Awards:</span><span> ${search["Awards"]}</span></div></div></div>`;
                details1.appendChild(newMovie);

            })
            .catch(err => console.log(err));;
    }
})

pagination.addEventListener("click", function (event) {
    list = document.querySelector("#list");
    list.innerHTML = "";
    selectFilms.innerHTML = "";
    // pagination.style.display = "block";
    let titleFilms = document.querySelector("#titleFilms");
    //titleFilms.style.display = "none";

    let movie = document.querySelector("#text").value;

    if (event.target.closest(".pagination_item")) {
        let selectPagination = event.target.closest(".pagination_item");
        let page = event.target.closest(".pagination_item").id;

        sendRequest("GET", `https://omdbapi.com/?s=${movie}&page=${page}&apikey=9cfc115f`)
            .then(search => {

                let films = search.Search;
                console.dir(films);
                if (search.Response == "False") {
                    titleFilms.innerHTML = "Movie not found!";
                    titleFilms.style.display = "none";
                    // pagination.style.display = "block";
                } else {
                    titleFilms.innerHTML = "Films:";
                    // titleFilms.style.display = "block";
                    setTimeout(function () {
                        pagination.style.display = "block";
                    }, 0);

                    let select = document.querySelectorAll(".pagination_item");
                    for (let i = 0; i < select.length; i++) {

                        select[i].removeAttribute("disabled");
                    }

                    selectPagination.setAttribute("disabled", "disabled");


                    for (let i = 0; i < films.length; i++) {
                        let newFilm = document.createElement("div");
                        newFilm.innerHTML = `
                            <div class="title"><div class="cont"><img class="img" src="${films[i].Poster}" alt="Poster not Founded"/></img>
                                <div class="textName">${type}<p class="name">${films[i].Title}</p><span>${films[i].Year}</span>
                                    <button class="btn" id="${films[i].imdbID}">
                                    <span onclick="showDetails(this)" data-id=${films[i].imdbID}>Detalis</span></button></div></div></div>`;
                        list.appendChild(newFilm);
                    }
                }
            })
            .catch(err => console.log(err));
    }
})