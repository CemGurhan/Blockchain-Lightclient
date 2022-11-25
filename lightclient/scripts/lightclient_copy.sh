i=$1
port=$2
cd ..
cp -R -v ./lightclient ./lightclient$i
cd ./lightclient$i
rm ModelMetadata
python scripts/sort_data.py -n $((i+1))  