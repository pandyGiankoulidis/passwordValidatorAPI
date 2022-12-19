const editDistance = require('edit-distance');

/*The costs of the editing operations in the password*/
const insert = function (node) { return 1; }
const remove = function (node) { return 1; }
const update = function (stringA, stringB) { return stringA !== stringB ? 1 : 0; };
const treeUpdate = function (nodeA, nodeB) { return nodeA.id !== nodeB.id ? 1 : 0; };

const db = require("../models");
const storedPasswords = db.storedPassword;
const url = require('url');

levenshteinEditDistance = (req, res, next) => {
    const queryObject = url.parse(req.url, true).query
    if (queryObject.password) {
        storedPasswords.find().exec((err, rows) => {
            if (err) {
                console.log("Error");
                return;
            }
            var lev = 0, pwords = 1;
            var startTime = performance.now();

            rows.forEach((p) => {
                if (pwords < 150 && queryObject.password.length < 12)
                    lev = lev + editDistance.levenshtein(queryObject.password, p.password, insert, remove, update).distance;
                pwords = pwords + 1;
            });

            var endTime = performance.now()
            console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)


            req.levenshteinDistance = lev / pwords;
            next();
        });
    } else {
        res.status(200).send({ 'message': 'No password provided in the request URL' });
    }

};

treeEditDistance = (req, res, next) => {
    var rootA = { id: 1, children: [{ id: 2 }, { id: 3 }] };
    var rootB = { id: 1, children: [{ id: 4 }, { id: 3 }, { id: 5 }] };
    var children = function (node) { return node.children; };
    const treeEditDist = editDistance.ted(rootA, rootB, children, insert, remove, treeUpdate);
    req.treeDistance = treeEditDist.distance;
    next();
};

const editDistances = {
    levenshteinEditDistance,
    treeEditDistance
};

module.exports = editDistances;