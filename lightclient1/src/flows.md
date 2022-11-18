fetchClientKeys called in app.js in async func main on line 115. This function then returns the keys to a global variable known as TRAINER_KEY. 

fetchDatasetDirectory is called on line 44 in app.js. It is then used on line 63 to fetchPythonWeights. fetchDatasetDirectory returns a value from process.argv[3]. Come back to it to find exactly what process.argv[3].

fetchLatestModel.js is called on line 7 in app.js. The function fetchLatestModelTrainer is called from fetchLatestModel on this line, along with clearMetadataFile. 

----------------------------------------------------------------------

fetchLatestModelTrainer calls getLatestModelIndex on line 115, where getLatestModelIndex is on line 73. getLatestModelIndex calls latest_model_index_fmt, which returns the url http://127.0.0.1:${port_number}/api/services/ml_service/v1/models/latestmodel. port_number is obtained from fetchPortNumber on line 11. fetchPortNumber is instantiated in fetchDatetestDirectory.js, which extracts a port process.argv[2]. 

After the GET request, an index is extracted. A function called readMetaDatafile is then called on line 117, which was instansiated on line 42. A function on line 44 called fs.existsSync() is called, which takes a variable called METADATA_FILE_NAME. METADATA_FILE_NAME) was instantiated on line 4 with value 'ModelMetadata'. 'ModelMetadata' is just the name of a file that contains the current version (index) of the model the LC has.

The fs.existsSync(path) method is used to synchronously check if a file already exists in the given path or not. It returns a boolean value which indicates the presence of a file. path: It holds the path of the file that has to be checked. It can be a String, Buffer or URL. The boolean is returned into metaDataFileExists, which is then used in an if statement on line 45. 

If true, A method called fs.readFIle is called on METADATA_FILE_NAME, whcih takes in METADATA_FILE_NAME, how we are going to encode the file (using utf-8 encoding) and a callback function. The callback function takes in the contents of the METADATA_FILE_NAME, along with an error. It then parses the data from the file into ints. This parsed data is called an index, and it is returned as a resolved promise. If the contents of the file was empty, -2 is returned instead. 

This index from the file data is then used on line 118. If this index (which is labeled as fileContent) is less than the latestIndex that was taken from getLatestModelIndex() , then the next block of code is executed. This check is done to see if there actually is a new model. If there was a new model released by a validator to the blockchain, the model on the blockchain would have a greater version that the one that the lightclient had stored locally in the ModelMetadat file.

The next block of code then prints to the terminal that the validator has released a new model with a new ID. An if statement is called, with a condition stating [0, -1].includes(latestIndex). This is asking whether the array [0, -1] contains the latestIndex. If so, it returns true. This basically checks whether the model from the bc has been created yet. The ModelMetadata file is only populated after the first round of training. Hence, if there is nothing in the file, it probably means that the first round of trainig has not yet completed, which means that we dont have a new model created in the BC at this point. This means that the empty file wouldve returned a value of -2 to the fileContent variable. If the BC does not yet have a model available, then it returns -1 to the http get method called earlier, which means that the latestIndex variable value would be -1. We can see why the if statement that executes this block of code is still passed. 

In this case, a new array is created with a lenth equal to the global variable WEIGHTS_LENGTH. We then fill this array of weights with zeros. We then turn these values into random numbers using a map, and then multiply all these values by 0.2 and minus 0.1 from them. This array is called randArray.

We then call a function called store_encoded_vector from store_encoded_vector.js. It takes in the randArr as its first argument, which is analgous to gradients. It also takes in 'validator' as its second argument. If validator isnt given, then the argument defaults to 'python'. 'validator' is essentially a path. 

In store_encoded_vector, we create a target file using CACHE_FOLDER + CACHE_FILE_RESOLVER[target]. CACHE_FOLDER represents ./models_cache/ , and CACHE_FILE_RESOLVER selects a file depending on what the argument is. For us , the argument is 'validator', hence, the 'last_validator_model' file is selected on line 7. This basically creates a path to our file, which is './models_cache/last_validator_model'. We then turn our array of weights into a file, where each gradient/weight is seperated using ENCODING_SEPARATOR, which just represents '|'. 

We then call fs.writeFileSync(targetFile, encoded). targetFile is just the location of the file we want to write to, which for us is './models_cache/last_validator_model'. We then write to this file, the contents of encoded, which is the variable that represents our array of weights that we joined together with the '|' value. We then return this targetFile. 

Our model weights are now stored in './models_cache/last_validator_model'. We then call the function writeToMetadataFile(0), which writes an index of zero to our ModelMetadata file to indicate working on an empty model. The function fetchLatestModelTrainer then returns an array containing our array of weights, and the number 0, and the number 1. 

If on line 121, our condition [0, -1].includes(latestIndex) was false, it means that there was already a model in the BC. In that case, we get the latest model from the BC using getModelByIndex(latestIndex). We then do the same as what we did before, update the file in './models_cache/last_validator_model' with a model, update our ModelMetadata file with the models index, and then we return an array containing the latest models weights, the number 0 and the number 0. 

If the condition on line 119 was not met, which was latestIndex > fileContent, then the fileContent was there, but the latestIndex was probably equal to the index found inside the ModelMetadata. We now need to verify whetehr we need to further training on this model.

If so, a function called getRetrainQuote , which takes in a trainerKey from the main functions argument. The function getRetrainQuote creates a url using this key and assigns it to the variable option. This url is 
'?trainer_addr=${trainerKey}'. A http get is then made using the function get_retrain_quote_fmt, which returns the url `http://127.0.0.1:${port_number}/api/services/ml_service/v1/trainer/retrain_quota`. The retrun from this is then used in a method called HTTPGET, along with the option variable. 

inside the HTTPGET method, we create a variable called getURL by adding up the returned url from the get_retrain_quote_fmt function , and the url inside the option variable, '?trainer_addr=${trainerKey}'. We then make a http.get request to this url, which calls the method get_retrain_quato in api.rs, line 194. This calls the method _get_retrain_quota_ on line 119 in schema.rs. 

This will let us know whether the LC is allowed to retrain the data agin or not. If the quota is greater than zero, we call read_encoded_vector('retrain'). This function does almost the same as store_encoded_vector. It finds the file 'retrained_model' after looking for the value of 'retrain' in the CACHE_FILE_RESOLVER fucntion. It splits this file into an array, and converts all the values to a floating point number via a map. It then returns this array as the cachedModel.

We then return an array, with the chached model, the number 1, and let firstIteration = (latestIndex <= 0);, which is a boolean that checks to see if this is the first iteration of the model. If the retrain quota is zero, then we return an array of -1, 0 and 0, which means that the LC doesnt need to retrain this model. 

fethLatestModelTrainer is called on line 129 in app.js as an await function. It is called as fetchLatestModelTrainer(TRAINER_KEY.publicKey, MODEL_LENGTH). TRAINER_KEY is filled with client keys on line 117. 
, and we extract the public key from this to insert as the first argument of the fetchLatestModelTrainer function. MODEL_LENGTH is instansiated on line 17, and is the length of our modelmetada (MNIST28X28).

