i=$1
port=$2
cd ..
cp -R -v ./lightclient ./lightclient$i
cd ./lightclient$i
python scripts/sort_data.py -n $i  
npm start -- $port models/MNIST28X28/data.csv 0.1 MNIST28X28