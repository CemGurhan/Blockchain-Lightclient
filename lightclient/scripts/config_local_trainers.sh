rm ModelMetadata
port=9000
number_of_trainers=1
trainer_noise=0.1
model_name="MNIST28X28"
is_non_iid=0

while getopts "p:n:s:m:t:d:" arg; do
    case $arg in
    p) port=$(($OPTARG)) ;;
    n) number_of_trainers=$(($OPTARG)) ;;
    s) trainer_noise=$(($OPTARG)) ;;
    m) model_name="$OPTARG" ;;
    t) is_non_iid=$(($OPTARG)) ;;
    d) validator_data_reciever_service_addresses+=("$OPTARG");;
    esac
done


for ((i=1;i<$number_of_trainers;i++))
do
    sh ./scripts/lightclient_copy.sh $i $port $is_non_iid
done

if [[ is_non_iid -ne 0 ]]
then
    python scripts/sort_data.py -n 1

    python scripts/create_test_data.py

    for ((i=0;i<$number_of_trainers;i++))
    do
        if [[ $i == 0 ]]
        then
            for ((j=0;j<$validator_data_reciever_service_addresses;j++))
            do
                echo "sending test data from lightclient 1 to validator data reciever service running at ${validator_data_reciever_service_addresses[j]}"
                pub_key_response_header="$(curl -X POST --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" --data-binary "@./test_data/test_data.csv" ${validator_data_reciever_service_addresses[j]}/postData/$i)"
                while [[ pub_key_response_header -ne 200 ]] 
                do
                    pub_key_response_header="$(curl -X POST --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" --data-binary "@./test_data/test_data.csv" ${validator_data_reciever_service_addresses[j]}/postData/$i)"
                done
                continue
            done
        fi
        cd ..
        cd lightclient$i
        for ((j=0;j<$validator_data_reciever_service_addresses;j++))
        do
            echo "sending test data from lightclient $((i+1)) to validator data reciever service running at ${validator_data_reciever_service_addresses[j]}"
            pub_key_response_header="$(curl -X POST --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" --data-binary "@./test_data/test_data.csv" ${validator_data_reciever_service_addresses[j]}/postData/$i)"
            while [[ pub_key_response_header -eq 000 ]] 
            do
                pub_key_response_header="$(curl -X POST --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" --data-binary "@./test_data/test_data.csv" ${validator_data_reciever_service_addresses[j]}/postData/$i)"
            done
        done
    done

    for ((i=0;i<$validator_data_reciever_service_addresses;i++))
    do
        echo "calling data reciever service running at ${validator_data_reciever_service_addresses[i]}"
        data_fill_check_header="$(curl --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" ${validator_data_reciever_service_addresses[i]}/dataFilledConfirm)"
        while [[ data_fill_check_header -eq 500 ]] || [[ data_fill_check_header -eq 000 ]]
        do
            data_fill_check_header="$(curl --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" ${validator_data_reciever_service_addresses[i]}/dataFilledConfirm)"
        done
    done

    echo "calling lead validator"
    validation_run_check_header="$(curl --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" http://127.0.0.1:9000/api/services/ml_service/v1/models/latestmodel)"
    while [[ validation_run_check_header -ne 200 ]]
    do
        validation_run_check_header="$(curl --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" http://127.0.0.1:9000/api/services/ml_service/v1/models/latestmodel)"
    done

fi

for ((i=0;i<$number_of_trainers;i++))
do
    if [[ $i == 0 ]]
    then
        cd ..
        cd lightclient
        ttab -w npm start -- $port models/MNIST28X28/data.csv $trainer_noise $model_name 
    else
        cd ..
        cd lightclient$i
        ttab -w npm start -- $port models/MNIST28X28/data.csv $trainer_noise $model_name
    fi

done

