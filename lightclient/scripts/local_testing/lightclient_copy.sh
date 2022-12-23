i=$1
port=$2
isMainTest=$3
cd ..
cp -R -v ./lightclient ./lightclient$i
cd ./lightclient$i
rm ModelMetadata
if [[ isMainTest -ne 0 ]]
then
python scripts/python_scripts/sort_data.py -n $((i+1))
python scripts/python_scripts/create_test_data.py 
fi 