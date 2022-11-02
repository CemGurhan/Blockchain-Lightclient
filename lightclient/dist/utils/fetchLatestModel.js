'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fetchLatestModelTrainer = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var fetchLatestModelTrainer = exports.fetchLatestModelTrainer = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(trainerKey, WEIGHTS_LENGTH) {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        return _context.abrupt('return', new _promise2.default(function (resolve, reject) {
                            getLatestModelIndex() //retrieve the index of the latest model from the BC
                            .then(function (latestIndex) {
                                readMetadataFile().then(function (fileContent) {
                                    if (latestIndex > fileContent) {
                                        //if there is a new model (relative to the latest model this LC trained on )
                                        console.log("New model released by the validator!, #" + latestIndex + "...Hello from lightclient/src/utils/fetchLatestmodel.js/fethclatestmodeltrainer");
                                        if ([0, -1].includes(latestIndex)) {
                                            //new model 
                                            var randArr = new Array(WEIGHTS_LENGTH).fill(0);
                                            randArr = randArr.map(function (val) {
                                                return Math.random() * 0.2 - 0.1;
                                            });
                                            (0, _store_encoded_vector.store_encoded_vector)(randArr, 'validator');
                                            writeToMetadataFile(0) //update metadata file to indicate working on an empty model 
                                            .then(function () {
                                                resolve([randArr, 0, 1]);
                                            }).catch(function (err) {
                                                return reject(err);
                                            });
                                        } else {
                                            getModelByIndex(latestIndex) //fetch latest model weights
                                            .then(function (latestModelWeights) {
                                                (0, _store_encoded_vector.store_encoded_vector)(latestModelWeights, 'validator');
                                                writeToMetadataFile(latestIndex) //update metadata file
                                                .then(function () {
                                                    resolve([latestModelWeights, 0, 0]);
                                                }).catch(function (err) {
                                                    return reject(err);
                                                });
                                            });
                                        }
                                    } else {
                                        getRetrainQuote(trainerKey).then(function (retrainQuota) {
                                            if (retrainQuota > 0) {
                                                console.log("Will retrain on the locally cached model");
                                                var cachedModel = (0, _store_encoded_vector.read_encoded_vector)('retrain');
                                                var firstIteration = latestIndex <= 0;
                                                resolve([cachedModel, 1, firstIteration]);
                                            } else resolve([-1, 0, 0]); //the LC doesn't need to train (already trained this model)
                                        });
                                    }
                                });
                            }).catch(function (err) {
                                return reject(err);
                            });
                        }));

                    case 1:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function fetchLatestModelTrainer(_x4, _x5) {
        return _ref.apply(this, arguments);
    };
}();

exports.clearMetadataFile = clearMetadataFile;

var _fetchDatasetDirectory = require('./fetchDatasetDirectory');

var _store_encoded_vector = require('./store_encoded_vector');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var http = require('http');
var fs = require('fs');
require('dotenv').config();

var METADATA_FILE_NAME = 'ModelMetadata';
// const WEIGHTS_LENGTH = 4010;
var MODELS_CACHE = "cached_model";


var latest_model_index_fmt = function latest_model_index_fmt() {
    var port_number = (0, _fetchDatasetDirectory.fetchPortNumber)();
    return process.env.HOST + '/api/services/ml_service/v1/models/latestmodel';
};
var get_model_by_index_fmt = function get_model_by_index_fmt() {
    var port_number = (0, _fetchDatasetDirectory.fetchPortNumber)();
    return process.env.HOST + '/api/services/ml_service/v1/models/getmodel';
};
var get_retrain_quote_fmt = function get_retrain_quote_fmt() {
    var port_number = (0, _fetchDatasetDirectory.fetchPortNumber)();
    return process.env.HOST + '/api/services/ml_service/v1/trainer/retrain_quota';
};

function HTTPGet(endpointURL) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var getURL = endpointURL + options;
    console.log(getURL);
    return new _promise2.default(function (resolve, reject) {
        var request = http.get(getURL, function (resp) {
            var data = '';
            resp.on('data', function (chunk) {
                data += chunk;
            });
            resp.on('end', function () {
                resolve(data);
            });
        });
        request.on("error", function (err) {
            reject("Error: " + err.message);
        });
    });
}

function readMetadataFile() {
    return new _promise2.default(function (resolve, reject) {
        var metaDataFileExists = fs.existsSync(METADATA_FILE_NAME);
        if (metaDataFileExists) {
            fs.readFile(METADATA_FILE_NAME, 'utf8', function (err, data) {
                if (err) reject(err);
                var index = parseInt(data);
                resolve(index);
            });
        } else resolve(-2); //for file doesn't exist
    });
}

function clearMetadataFile() {
    var metaDataFileExists = fs.existsSync(METADATA_FILE_NAME);
    if (metaDataFileExists) {
        fs.unlink(METADATA_FILE_NAME, function () {});
    }
}

function writeToMetadataFile(index) {
    return new _promise2.default(function (resolve, reject) {
        index = index.toString();
        fs.writeFile(METADATA_FILE_NAME, index, function (err) {
            if (err) reject(err);
            resolve();
        });
    });
}

function getLatestModelIndex() {
    var isVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    return new _promise2.default(function (resolve, reject) {
        HTTPGet(latest_model_index_fmt(isVal)).then(function (res) {
            return resolve(parseInt(res));
        }).catch(function (err) {
            console.log(err);
            reject(err);
        });
    });
}

function getModelByIndex(index) {
    var isVal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var option = '?version=' + index;
    return new _promise2.default(function (resolve, reject) {
        HTTPGet(get_model_by_index_fmt(isVal), option).then(function (res) {
            return resolve(JSON.parse(res).weights);
        }).catch(function (err) {
            return reject(err);
        });
    });
}

function getMinScoreByIndex(index) {
    var option = '?version=' + index;
    return new _promise2.default(function (resolve, reject) {
        HTTPGet(get_model_by_index_fmt(true), option).then(function (res) {
            return resolve(JSON.parse(res).min_score);
        }).catch(function (err) {
            return reject(err);
        });
    });
}

function getRetrainQuote(trainerKey) {
    var option = '?trainer_addr=' + trainerKey;
    return new _promise2.default(function (resolve, reject) {
        HTTPGet(get_retrain_quote_fmt(), option).then(function (res) {
            resolve(parseInt(res));
        }).catch(function (err) {
            return reject(err);
        });
    });
}