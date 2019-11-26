let dbPromised = idb.open("futbol", 1, function (upgradeDb) {
    let articlesObjectStore = upgradeDb.createObjectStore("teams", {
        keyPath: "id"
    });
    articlesObjectStore.createIndex("name", "name", {
        unique: false
    });
});

function Save(article) {
    dbPromised
        .then(function (db) {
            let tx = db.transaction("teams", "readwrite");
            let store = tx.objectStore("teams");
            console.log(article);
            store.add(article);
            return tx.complete;
        })
        .then(function () {
            console.log("Team has been saved.");
        });
}

function Delete(article) {
    dbPromised
        .then(function (db) {
            let tx = db.transaction("teams", "readwrite");
            let store = tx.objectStore("teams");
            store.delete(article.id);
            return tx.complete;
        })
        .then(function () {
            console.log("Team has been deleted.");
        })
}

function getAll() {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                let tx = db.transaction("teams", "readonly");
                let store = tx.objectStore("teams");
                return store.getAll();
            })
            .then(function (articles) {
                resolve(articles);
            });
    });
}

function getAllByTitle(title) {
    dbPromised
        .then(function (db) {
            let tx = db.transaction("teams", "readonly");
            let store = tx.objectStore("teams");
            let titleIndex = store.index("name");
            let range = IDBKeyRange.bound(title, title + "\uffff");
            return titleIndex.getAll(range);
        })
        .then(function (articles) {
            console.log(articles);
        });
}

function getById(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                let tx = db.transaction("teams", "readonly");
                let store = tx.objectStore("teams");
                return store.get(id);
            })
            .then(function (article) {
                resolve(article);
            });
    });
}