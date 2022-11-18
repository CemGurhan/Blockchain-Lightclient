'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.store_encoded_vector = store_encoded_vector;
exports.remove_file_if_exists = remove_file_if_exists;
exports.read_encoded_vector = read_encoded_vector;
exports.clear_encoded_vector = clear_encoded_vector;
var fs = require('fs');
var CACHE_FOLDER = './models_cache/';
var ENCODING_SEPARATOR = "|";

var CACHE_FILE_RESOLVER = {
    'python': 'python_bus',
    'validator': 'last_validator_model',
    'retrain': 'retrained_model'
};

function store_encoded_vector(gradients) {
    var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'python';

    var targetFile = CACHE_FOLDER + CACHE_FILE_RESOLVER[target];
    var encoded = gradients.join(ENCODING_SEPARATOR);
    fs.writeFileSync(targetFile, encoded);
    return targetFile;
}

function remove_file_if_exists(target) {
    var targetFile = CACHE_FOLDER + CACHE_FILE_RESOLVER[target];
    if (fs.existsSync(targetFile)) {
        fs.unlinkSync(targetFile, function () {});
    }
}

function read_encoded_vector(target) {
    var targetFile = CACHE_FOLDER + CACHE_FILE_RESOLVER[target];
    var encodedArray = fs.readFileSync(targetFile, "utf8");
    var array = encodedArray.split(ENCODING_SEPARATOR);
    array = array.map(function (val) {
        return parseFloat(val);
    });
    return array;
}

function clear_encoded_vector() {
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'python';

    var targetFile = CACHE_FOLDER + CACHE_FILE_RESOLVER[target];
    fs.unlinkSync(targetFile, function () {});
}