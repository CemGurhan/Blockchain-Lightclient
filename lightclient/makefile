start:
	npm start -- 9000 models/MNIST28X28/data.csv 0.1 MNIST28X28
.PHONY: start

rm-ten:
	@rm -rf ../lightclient1
	@rm -rf ../lightclient2
	@rm -rf ../lightclient3
	@rm -rf ../lightclient4
	@rm -rf ../lightclient5
	@rm -rf ../lightclient6
	@rm -rf ../lightclient7
	@rm -rf ../lightclient8
	@rm -rf ../lightclient9
.PHONY:rm-ten

remove-data: 
	rm -f models/MNIST28X28/data_old.csv \
	rm -f models/MNIST28X28/data.csv 
.PHONY:remove-data

set-data: remove-data
	cp ../mnist_train/data.csv models/MNIST28X28/data.csv
.PHONY:set-data

n-ten:
	sh scripts/local_testing/decentralized/config_local_trainers.sh -n 10 -t 1
.PHONY: n-ten

ten:
	sh scripts/local_testing/decentralized/config_local_trainers.sh -n 10 
.PHONY: ten

