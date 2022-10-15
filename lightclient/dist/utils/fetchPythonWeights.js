'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = fetchPythonWeights;

var _parsePythonList = require('./parsePythonList');

var _parsePythonList2 = _interopRequireDefault(_parsePythonList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MODELS_DIR_PATH = './models/';
// const MODEL_NAME = 'test_model';

function run_python(newModel_flag, dataset_path, modelWeights_path, MODEL_NAME) {
    var runPy = new _promise2.default(function (success, nosuccess) {
        var _require = require('python-shell'),
            PythonShell = _require.PythonShell;

        var options = {
            mode: 'text',
            scriptPath: MODELS_DIR_PATH + MODEL_NAME,
            args: [newModel_flag, dataset_path, modelWeights_path]
        };

        PythonShell.run('training_script.py', options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            success(results);
        });
    });
    return runPy;
}

//onSuccess: callback function taking one parameter: the vector from python
//onFailure prints the python error and terminates by default
function fetchPythonWeights(newModel_flag, dataset_path, modelWeights_path, MODEL_NAME, MODEL_LENGTH) {
    return run_python(newModel_flag, dataset_path, modelWeights_path, MODEL_NAME).then(function (res) {
        var model_weights = (0, _parsePythonList2.default)(res.toString(), MODEL_LENGTH);
        return model_weights;
    });
}