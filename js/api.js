let URL = "https://api.football-data.org/v2/";

function fetchAPIKey(URL) {
    return fetch(URL, {
        headers: {
            'X-Auth-Token': 'c3e9c4aac27a4c3d81247acf340b4e3f'
        },
        method: 'GET'
    })
}

function status(response) {
    if (response.status !== 200) {
        console.log("Error: " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error: " + error);
}

function getArticles() {
    if ("caches" in window) {
        caches.match(URL + "competitions/PL/teams").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    let articlesHTML = "";
                    for (i = 0; i < data.teams[0]; i++) {
                        articlesHTML += `
                                <div class="card">
                                    <a href="./article.html?id=${data.teams[i].id}">
                                        <div class="card-image waves-effect waves-block waves-light">
                                            <img src="${data.teams[i].crestUrl}">
                                        </div>
                                    </a>
                                    <div class="card-content">
                                        <span class="card-title truncate">
                                            ${data.teams[i].name}
                                        </span>
                                    </div>
                                </div>
                        `;
                    };
                    document.getElementById("articles").innerHTML = articlesHTML;
                });
            }
        });
    }

    fetchAPIKey(URL + "competitions/PL/teams")
        .then(status)
        .then(json)
        .then(function (data) {
            let articlesHTML = "";
            for (i = 0; i < data.teams[0]; i++) {
                articlesHTML += `
                    <div class="card">
                        <a href="./article.html?id=${data.teams[i].id}">
                            <div class="card-image waves-effect waves-block waves-light">
                                <img src="${data.teams[i].crestUrl}">
                            </div>
                        </a>
                        <div class="card-content">
                            <span class="card-title truncate">
                                ${data.teams[i].name}
                            </span>
                        </div>
                    </div>
            `;
            };
            document.getElementById("articles").innerHTML = articlesHTML;
        })
        .catch(error);
}

function getArticlesById() {
    return new Promise(function (resolve, reject) {
        let urlParams = new URLSearchParams(window.location.search);
        let idParam = urlParams.get("id");

        if ("caches" in window) {
            caches.match(URL + "teams/" + idParam).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        let articleHTML = `
                            <div class="card">
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img src="${data.crestUrl}">
                                </div>
                                <div class="card-content">
                                    <span class="card-title">
                                        ${data.name}
                                    </span>
                                    ${snarkdown(data.venue)}
                                </div>
                            </div>
                        `;
                        document.getElementById("body-content").innerHTML = articleHTML;
                        resolve(data);
                    });
                }
            });
        }

        fetchAPIKey(URL + "teams/" + idParam)
            .then(status)
            .then(json)
            .then(function (data) {
                let articleHTML = `
                <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img src="${data.crestUrl}">
                    </div>
                    <div class="card-content">
                        <span class="card-title">
                            ${data.name}
                        </span>
                        ${snarkdown(data.venue)}
                    </div>
                </div>
            `;
                document.getElementById("body-content").innerHTML = articleHTML;
                resolve(data);
            });
    });
}

function getSavedArticles() {
    getAll().then(function (articles) {
        console.log(articles);

        let articlesHTML = "";
        articles.forEach(function (article) {
            let description = article.teams.venue.substring(0, 100);
            articlesHTML += `
                <div class="col s12 m6 l3">
                    <div class="card">
                        <a href="./article.html?id=${article.teams.ID}">
                            <div class="card-image waves-effect waves-block waves-light">
                                <img src="${article.teams.crestUrl}">
                            </div>
                        </a>
                        <div class="card-content">
                            <span class="card-title truncate">
                                ${article.teams.name}
                            </span>
                            <p>${description}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        document.getElementById("body-content").innerHTML = articlesHTML;
    });
}

function getSavedArticleById() {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");

    getById(idParam).then(function (article) {
        articleHTML = '';
        let articleHTML = `
            <div class="card">
                <div class="card-image waves-effect waves-block waves-light">
                    <img src="${article.crestUrl}">
                </div>
                <div class="card-content">
                    <span class="card-title">
                        ${article.name}
                    </span>
                    ${snarkdown(article.venue)}
                </div>
            </div>
        `;
        document.getElementById("body-content").innerHTML = articleHTML;
    });
}