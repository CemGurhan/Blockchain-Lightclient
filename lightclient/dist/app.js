'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var trainNewModel = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(newModel_flag, modelWeightsPath, modelWeights, fromLocalCache) {
        var SERVICE_ID, SHAREUPDATES_ID, ShareUpdates, explorerPath, dataset_directory, noise_scale, update_gradients, noise, i, newModel, latestValidatorModel, shareUpdatesPayload, transaction, serialized;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:

                        // Numeric identifier of the machinelearning service
                        SERVICE_ID = 3;

                        // Numeric ID of the `TxShareUpdates` transaction within the service

                        SHAREUPDATES_ID = 0;
                        ShareUpdates = new exonum.Transaction({
                            schema: proto.TxShareUpdates,
                            serviceId: SERVICE_ID,
                            methodId: SHAREUPDATES_ID
                        });

                        // let port_number = fetchPortNumber();
                        // let explorerPath = BASE_URL + ":" + port_number + TRANSACTIONS_SERVICE;

                        if (process.env.HOST === "http://127.0.0.1") {
                            explorerPath = BASE_URL + ":" + port_number + TRANSACTIONS_SERVICE;
                        } else {
                            explorerPath = BASE_URL + TRANSACTIONS_SERVICE;
                        }

                        dataset_directory = (0, _fetchDatasetDirectory2.default)();
                        noise_scale = (0, _fetchDatasetDirectory.fetchImposterState)();
                        // if (is_imposter){
                        //     clear_encoded_vector();
                        //     // Generating random uniformly distributed vector with values 9000 - 11000
                        //     const shareUpdatesPayload = {
                        //         gradients: Array.from({length: MODEL_LENGTH}, () => 5000 + Math.floor(Math.random() * 10000)),
                        //         seed: exonum.randomUint64(),
                        //     }

                        //     const transaction = ShareUpdates.create(shareUpdatesPayload, TRAINER_KEY)
                        //     const serialized = transaction.serialize()
                        //     console.log(serialized)

                        //     exonum.send(explorerPath, serialized, 10, 5000)
                        //     .then((obj) => console.log(obj))
                        //     .catch((obj) => console.log(obj))

                        // } else {

                        _context.next = 8;
                        return (0, _fetchPythonWeights2.default)(newModel_flag, dataset_directory, modelWeightsPath, MODEL_NAME, MODEL_LENGTH);

                    case 8:
                        update_gradients = _context.sent;


                        (0, _store_encoded_vector.clear_encoded_vector)();

                        if (noise_scale) {
                            noise = (0, _generateNormalNoise2.default)(MODEL_LENGTH, noise_scale);

                            for (i = 0; i < MODEL_LENGTH; i++) {
                                update_gradients[i] += noise[i];
                            }
                        }

                        //caching weights before adding them to a BC transaction
                        newModel = update_gradients;

                        if (!newModel_flag) {
                            newModel = update_gradients.map(function (val, idx) {
                                return val + modelWeights[idx];
                            });
                        }
                        (0, _store_encoded_vector.store_encoded_vector)(newModel, 'retrain');

                        if (fromLocalCache) {
                            //accumalating gradients in the case of a retrain
                            latestValidatorModel = (0, _store_encoded_vector.read_encoded_vector)('validator');

                            update_gradients = update_gradients.map(function (val, idx) {
                                return val + (modelWeights[idx] - latestValidatorModel[idx]);
                            });
                        }

                        shareUpdatesPayload = {
                            gradients: update_gradients,
                            seed: exonum.randomUint64()
                        };
                        transaction = ShareUpdates.create(shareUpdatesPayload, TRAINER_KEY);
                        serialized = transaction.serialize();

                        console.log(serialized);
                        console.log("TRANSACTION SENT TO BACKEND");

                        _context.next = 22;
                        return exonum.send(explorerPath, serialized, 1000, 3000).then(function (obj) {
                            console.log(obj);
                        }).catch(function (obj) {
                            console.log(obj);(0, _fetchLatestModel.clearMetadataFile)();
                        }).finally(function () {
                            can_train = true;
                        });

                    case 22:
                        // }
                        console.log("New model ready, can_train = true");

                    case 23:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function trainNewModel(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
    };
}();

var main = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var _this = this;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return (0, _fetchClientKeys2.default)().then(function (client_keys) {
                            TRAINER_KEY = client_keys;
                        });

                    case 2:
                        if (!1) {
                            _context3.next = 16;
                            break;
                        }

                        randomizeDuration();
                        console.log("Will pause for " + intervalDuration + " secs");
                        _context3.next = 7;
                        return timeout(intervalDuration);

                    case 7:
                        if (can_train) {
                            _context3.next = 11;
                            break;
                        }

                        console.log("training is in progress");
                        _context3.next = 14;
                        break;

                    case 11:
                        console.log("Fetching new updated model from BC!");
                        _context3.next = 14;
                        return (0, _fetchLatestModel.fetchLatestModelTrainer)(TRAINER_KEY.publicKey, MODEL_LENGTH).then(function () {
                            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(fetcherResult) {
                                var newModel, isLocallyCached, firstIteration, newModel_path;
                                return _regenerator2.default.wrap(function _callee2$(_context2) {
                                    while (1) {
                                        switch (_context2.prev = _context2.next) {
                                            case 0:
                                                newModel = fetcherResult[0];
                                                isLocallyCached = fetcherResult[1];
                                                firstIteration = fetcherResult[2];

                                                if (!(newModel !== -1)) {
                                                    _context2.next = 11;
                                                    break;
                                                }

                                                if (!can_train) {
                                                    _context2.next = 9;
                                                    break;
                                                }

                                                can_train = false;
                                                newModel_path = (0, _store_encoded_vector.store_encoded_vector)(newModel);
                                                _context2.next = 9;
                                                return trainNewModel(firstIteration, newModel_path, newModel, isLocallyCached);

                                            case 9:
                                                _context2.next = 12;
                                                break;

                                            case 11:
                                                console.log("No retrain quota at the moment, will retry in a bit");

                                            case 12:
                                            case 'end':
                                                return _context2.stop();
                                        }
                                    }
                                }, _callee2, _this);
                            }));

                            return function (_x5) {
                                return _ref3.apply(this, arguments);
                            };
                        }());

                    case 14:
                        _context3.next = 2;
                        break;

                    case 16:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function main() {
        return _ref2.apply(this, arguments);
    };
}();

var _exonumClient = require('exonum-client');

var exonum = _interopRequireWildcard(_exonumClient);

var _proto = require('./proto');

var proto = _interopRequireWildcard(_proto);

var _fetchPythonWeights = require('./utils/fetchPythonWeights');

var _fetchPythonWeights2 = _interopRequireDefault(_fetchPythonWeights);

var _fetchDatasetDirectory = require('./utils/fetchDatasetDirectory');

var _fetchDatasetDirectory2 = _interopRequireDefault(_fetchDatasetDirectory);

var _fetchClientKeys = require('./utils/fetchClientKeys');

var _fetchClientKeys2 = _interopRequireDefault(_fetchClientKeys);

var _fetchLatestModel = require('./utils/fetchLatestModel');

var _store_encoded_vector = require('./utils/store_encoded_vector');

var _generateNormalNoise = require('./utils/generateNormalNoise');

var _generateNormalNoise2 = _interopRequireDefault(_generateNormalNoise);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("regenerator-runtime/runtime");
// import getModelLength from './utils/getModelLength';

require('dotenv').config();

var intervalDuration = 15;
var MODEL_NAME = process.argv[5];
var fs = require("fs");

var model_metadata = fs.readFileSync("./models/" + MODEL_NAME + "/metadata", { encoding: "utf8" });
var MODEL_LENGTH = model_metadata.substring(model_metadata.indexOf('WEIGHTS_LENGTH=') + 1).split("=")[1].split("\n")[0];
MODEL_LENGTH = parseInt(MODEL_LENGTH);

// const BASE_URL = "http://127.0.0.1";
var BASE_URL = process.env.HOST;
var TRANSACTIONS_SERVICE = "/api/explorer/v1/transactions";
var MODELS_CACHE = "cached_model";

var can_train = true;

var TRAINER_KEY = void 0;

function timeout(s) {
    return new _promise2.default(function (resolve) {
        return setTimeout(resolve, s * 1000);
    });
}

function randomizeDuration() {
    var secs = Math.round(Math.random() * 6); //from 0 to 60 in a steps of 10
    intervalDuration = secs;
}

main();