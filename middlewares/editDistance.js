const editDistance = require('edit-distance');

/*The costs of the editing operations in the password*/
const insert = function (node) { return 1; }
const remove = function (node) { return 1; }
const update = function (stringA, stringB) { return stringA !== stringB ? 1 : 0; };
const treeUpdate = function (nodeA, nodeB) { return nodeA.id !== nodeB.id ? 1 : 0; };

const db = require("../models");
const storedPasswords = db.storedPassword;


levenshteinEditDistance = (req, res, next) => {

    storedPasswords.find().exec((err, rows) => {
        if (err) {
            console.log("Error");
        }
        var lev = 0, pwords = 1;
        rows.forEach((p) => {
            lev = lev + editDistance.levenshtein(req.body.password, p.password, insert, remove, update).distance;
            pwords = pwords + 1;
        });
        console.log("Pwords = " + pwords + ", dist = " + lev)
        req.levenshteinDistance = lev / pwords;
        next();
    });

};

treeEditDistance = (req, res, next) => {
    var rootA = { id: 1, children: [{ id: 2 }, { id: 3 }] };
    var rootB = { id: 1, children: [{ id: 4 }, { id: 3 }, { id: 5 }] };
    var children = function (node) { return node.children; };

    const treeEditDist = editDistance.ted(rootA, rootB, children, insert, remove, treeUpdate);

    //console.log('Tree Edit Distance', ted.distance, ted.pairs(), ted.alignment());


    req.treeDistance = treeEditDist.distance;
    next();
};

const editDistances = {
    levenshteinEditDistance,
    treeEditDistance
};

module.exports = editDistances;