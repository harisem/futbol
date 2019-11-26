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
                    for (i = 0; i < data.teams.length; i++) {
                        articlesHTML += `
                            <div class="col s12 m8 offset-m2 l6 offset-l3">
                                <a href="./article.html?id=${data.teams[i].id}">
                                    <div class="card-panel grey lighten-5 z-depth-1">
                                        <div class="row valign-wrapper">
                                            <div class="col s3">
                                                
                                                    <img src="${data.teams[i].crestUrl}" alt="" class="responsive-img">
                                                
                                            </div>
                                            <div class="col s7">
                                                <h5 class="black-text">
                                                    ${data.teams[i].name}
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                </a>
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
            for (i = 0; i < data.teams.length; i++) {
                articlesHTML += `
                    <div class="col s12 m8 offset-m2 l6 offset-l3">
                        <a href="./article.html?id=${data.teams[i].id}">
                            <div class="card-panel grey lighten-5 z-depth-1">
                                <div class="row valign-wrapper">
                                    <div class="col s3">
                                        
                                            <img src="${data.teams[i].crestUrl}" alt="" class="responsive-img">
                                        
                                    </div>
                                    <div class="col s7">
                                        <h5 class="black-text">
                                            ${data.teams[i].name}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </a>
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
                            <div class="row section">
                                <div class="col s5">
                                    <img width="300px" class="responsive-img" src="${data.crestUrl}">
                                </div>
                                <div class="col s7">
                                    <div class="card">
                                        <div class="card-content">
                                            <h5>${data.name} ( ${snarkdown(data.tla)} )</h5>
                                            <p class="section no-pad-bot">Since: ${data.founded}</p>
                                            <p>Venue: ${snarkdown(data.venue)}</p>
                                            <p>Address: ${snarkdown(data.address)}</p>
                                            <p>Website: ${snarkdown(data.website)}</p>
                                            <p>Email: ${data.email}</p>
                                            <p>Phone: ${data.phone}</p>
                                            
                                            <p class="section no-pad-bot">Active Competitions:</p>
                        `
                        for (i = 0; i < data.activeCompetitions.length; i++) {
                            articleHTML += `
                                            <p>- ${data.activeCompetitions[i].name}</p>`
                        }
                        articleHTML += `
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row" id="squad">
                            
                            </div>
                        `

                        let squadHTML = `
                                <h4 class="center-align">Squad ${data.name}</h4>
                                <div class="col s12">
                                    <div class="card">
                                        <div class="card-content">
                                            <table class="centered">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Role</th>
                                                        <th>Position</th>
                                                        <th>Nationality</th>
                                                    </tr>
                                                </thead>
                                        
                                                <tbody>
                        `
                        for (i = 0; i < data.squad.length; i++) {
                            squadHTML += `
                                                    <tr>
                                                        <td>${data.squad[i].name}</td>
                                                        <td>${data.squad[i].role}</td>
                                                        <td>${data.squad[i].position}</td>
                                                        <td>${data.squad[i].nationality}</td>
                                                    </tr>
                            `
                        }

                        squadHTML += `
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                        `;

                        document.getElementById("body-content").innerHTML = articleHTML;
                        document.getElementById("squad").innerHTML = squadHTML;
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
                    <div class="row section">
                        <div class="col s5">
                            <img width="300px" class="responsive-img" src="${data.crestUrl}">
                        </div>
                        <div class="col s7">
                            <div class="card">
                                <div class="card-content">
                                    <h5>${data.name} ( ${snarkdown(data.tla)} )</h5>
                                    <p class="section no-pad-bot">Since: ${data.founded}</p>
                                    <p>Venue: ${snarkdown(data.venue)}</p>
                                    <p>Address: ${snarkdown(data.address)}</p>
                                    <p>Website: ${snarkdown(data.website)}</p>
                                    <p>Email: ${data.email}</p>
                                    <p>Phone: ${data.phone}</p>
                                    
                                    <p class="section no-pad-bot">Active Competitions:</p>
                                    `
                for (i = 0; i < data.activeCompetitions.length; i++) {
                    articleHTML += `
                                    <p>- ${data.activeCompetitions[i].name}</p>`
                }
                articleHTML += `
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row" id="squad">
                        
                        </div>
                    `

                let squadHTML = `
                    <h4 class="center-align">Squad ${data.name}</h4>
                    <div class="col s12">
                        <div class="card">
                            <div class="card-content">
                                <table class="centered">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Role</th>
                                            <th>Position</th>
                                            <th>Nationality</th>
                                        </tr>
                                    </thead>
                            
                                    <tbody>
                `
                for (i = 0; i < data.squad.length; i++) {
                    squadHTML += `
                                        <tr>
                                            <td>${data.squad[i].name}</td>
                                            <td>${data.squad[i].role}</td>
                                            <td>${data.squad[i].position}</td>
                                            <td>${data.squad[i].nationality}</td>
                                        </tr>
                    `
                }

                squadHTML += `
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;

                document.getElementById("body-content").innerHTML = articleHTML;
                document.getElementById("squad").innerHTML = squadHTML;
                resolve(data);
            });
    });
}

function getSavedArticles() {
    getAll().then(function (articles) {
        console.log(articles);

        let articlesHTML = "";
        articles.forEach(function (article) {
            let description = article.name.substring(0, 100);
            articlesHTML += `
                <div class="col s12 m8 offset-m2 l6 offset-l3">
                    <a href="./article.html?id=${article.id}&saved=true">
                        <div class="card-panel grey lighten-5 z-depth-1">
                            <div class="row valign-wrapper">
                                <div class="col s3">
                                    
                                    <img src="${article.crestUrl}" alt="" class="responsive-img">
                                    
                                </div>
                                <div class="col s7">
                                    <h5 class="black-text">
                                        ${description}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        });
        document.getElementById("articles").innerHTML = articlesHTML;
    });
}

function getSavedArticleById() {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");

    getById(idParam).then(function (article) {
        let articleHTML = `
            <div class="row section">
                <div class="col s5">
                    <img width="300px" class="responsive-img" src="${article.crestUrl}">
                </div>
                <div class="col s7">
                    <div class="card">
                        <div class="card-content">
                            <h5>${article.name} ( ${snarkdown(article.tla)} )</h5>
                            <p class="section no-pad-bot">Since: ${article.founded}</p>
                            <p>Venue: ${snarkdown(article.venue)}</p>
                            <p>Address: ${snarkdown(article.address)}</p>
                            <p>Website: ${snarkdown(article.website)}</p>
                            <p>Email: ${snarkdown(article.email)}</p>
                            <p>Phone: ${snarkdown(article.phone)}</p>
                            
                            <p class="section no-pad-bot">Active Competitions:</p>
        `
        for (i = 0; i < article.activeCompetitions.length; i++) {
            articleHTML += `
                            <p>- ${article.activeCompetitions[i].name}</p>`
        }
        articleHTML += `
                        </div>
                    </div>
                </div>
            </div>
            <div class="row" id="squad">
                
            </div>
        `

        let squadHTML = `
            <h4 class="center-align">Squad ${article.name}</h4>
                <div class="col s12">
                    <div class="card">
                        <div class="card-content">
                            <table class="centered">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Role</th>
                                        <th>Position</th>
                                        <th>Nationality</th>
                                    </tr>
                                </thead>
                                <tbody>
        `
        for (i = 0; i < article.squad.length; i++) {
            squadHTML += `
                                    <tr>
                                        <td>${article.squad[i].name}</td>
                                        <td>${article.squad[i].role}</td>
                                        <td>${article.squad[i].position}</td>
                                        <td>${article.squad[i].nationality}</td>
                                    </tr>
            `
        }

        squadHTML += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
        `;
        document.getElementById("body-content").innerHTML = articleHTML;
        document.getElementById("squad").innerHTML = squadHTML;
        resolve(article);
    });
}