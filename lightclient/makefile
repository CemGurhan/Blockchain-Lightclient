start:
	npm start -- 9000 models/MNIST28X28/data.csv 0.1 MNIST28X28
.PHONY: start


remove-data:
	rm -f models/MNIST28X28/data_old.csv \
	rm -f models/MNIST28X28/data.csv 
.PHONY:remove-data

set-data: remove-data
	cp ../mnist_train/data.csv models/MNIST28X28/data.csv
.PHONY:set-data

ten:
	sh scripts/config_local_trainers.sh -n 10 -t 1
.PHONY: ten