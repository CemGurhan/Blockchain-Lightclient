rm ModelMetadata
port=9000
number_of_trainers=1
trainer_noise=0.1
model_name="MNIST28X28"

while getopts "p:n:" arg; do
    case $arg in
    p) port=$(($OPTARG)) ;;
    n) number_of_trainers=$(($OPTARG)) ;;
    t) trainer_noise=$(($OPTARG)) ;;
    m) model_name="$OPTARG" ;;
    esac
done


for ((i=1;i<$number_of_trainers;i++))
do
    sh ./scripts/lightclient_copy.sh $i $port
done

python scripts/sort_data.py -n 1

for ((i=0;i<$number_of_trainers;i++))
do
    if [[ $i == 0 ]]
    then
        ttab -w npm start -- $port models/MNIST28X28/data.csv $trainer_noise $model_name 
    else
        cd ..
        cd lightclient$i
        ttab -w npm start -- $port models/MNIST28X28/data.csv $trainer_noise $model_name
    fi

done


