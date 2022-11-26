rm ModelMetadata
port=9000
number_of_trainers=1
trainer_noise=0.1
model_name="MNIST28X28"
isMainTest=0

while getopts "p:n:tn:m:t:" arg; do
    case $arg in
    p) port=$(($OPTARG)) ;;
    n) number_of_trainers=$(($OPTARG)) ;;
    tn) trainer_noise=$(($OPTARG)) ;;
    m) model_name="$OPTARG" ;;
    t) isMainTest=$(($OPTARG)) ;;
    esac
done


for ((i=1;i<$number_of_trainers;i++))
do
    sh ./scripts/lightclient_copy.sh $i $port
done

python scripts/sort_data.py -n 1

if [[ isMainTest != 0 ]]
then
    for ((i=0;i<$number_of_trainers;i++))
    do
        if [[ $i == 0 ]]
        then
             pub_key_response_header="$(curl -X POST --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" --data-binary "@./test_data/test_data.csv" 0.0.0.0:8000/postData/$i)"
             while [[ pub_key_response_header -eq 000 ]] 
             do
                pub_key_response_header="$(curl -X POST --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" --data-binary "@./test_data/test_data.csv" 0.0.0.0:8000/postData/$i)"
             done
             continue
        fi
        cd ..
        cd lightclient$i
        pub_key_response_header="$(curl -X POST --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" --data-binary "@./test_data/test_data.csv" 0.0.0.0:8000/postData/$i)"
        while [[ pub_key_response_header -eq 000 ]] 
        do
                pub_key_response_header="$(curl -X POST --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" --data-binary "@./test_data/test_data.csv" 0.0.0.0:8000/postData/$i)"
             done
    done

fi

echo "calling data reciever service"
data_fill_check_header="$(curl --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" 0.0.0.0:8000/dataFilledConfirm)"
while [[ data_fill_check_header -eq 500 ]] || [[ data_fill_check_header -eq 000 ]]
do
    data_fill_check_header="$(curl --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" 0.0.0.0:8000/dataFilledConfirm)"
done

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

# TODO add wait period for validators to have been spun up before running lightclients 

