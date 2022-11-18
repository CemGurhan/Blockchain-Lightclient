"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = parsePythonList;
//Default weights length
// const WEIGHTS_LENGTH = 4010;

function parsePythonList(list, WEIGHTS_LENGTH) {
    var in_arr = list.trim().replace(/(\r\n|\n|\r)/gm, "");
    var st = in_arr.search("VECTOR");
    var end = in_arr.search("ENDVECTOR");
    in_arr = in_arr.substring(st + 6, end);

    if (in_arr[0] != '[' || in_arr[in_arr.length - 1] != ']') {
        console.log("Syntax Error: Python returned a faulty array");
        process.exit();
    }
    var weights = in_arr.slice(1, in_arr.length - 1).split(',').filter(function (el) {
        return el != "";
    });
    if (weights.length != WEIGHTS_LENGTH) {
        console.log("We only support weights of length ", WEIGHTS_LENGTH, "Received ", weights.length);
        process.exit();
    }
    for (var i = 0; i < WEIGHTS_LENGTH; i++) {
        if (isNaN(weights[i])) {
            console.log("Error: ", weights[i], " is not a number");
            process.exit();
        }
        weights[i] = parseFloat(weights[i]);
    }
    return weights;
}