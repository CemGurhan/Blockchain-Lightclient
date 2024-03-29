rm ModelMetadata
port=9000
trainer_noise=0.1
model_name="MNIST28X28"
is_non_iid=0
lightclient_number=0

while getopts "p:s:m:t:d:l:v:" arg; do
    case $arg in
    p) port=$(($OPTARG)) ;;
    s) trainer_noise=$(($OPTARG)) ;;
    m) model_name="$OPTARG" ;;
    t) is_non_iid=$(($OPTARG)) ;;
    d) validator_data_reciever_service_addresses+=("$OPTARG");;
    l) lightclient_number=$(($OPTARG)) ;;
    v) validator_public_addresses+=("$OPTARG");;
    esac
done

if [[ is_non_iid -ne 0 ]]
then
    python scripts/python_scripts/sort_data.py -n $(($lightclient_number+1))

    python scripts/python_scripts/create_test_data.py

 
    for ((j=0;j<${#validator_data_reciever_service_addresses[@]};j++))
    do
        echo "sending test data from lightclient to validator data reciever service running at ${validator_data_reciever_service_addresses[j]}"
        pub_key_response_header="$(curl -X POST --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" --data-binary "@./test_data/test_data.csv" ${validator_data_reciever_service_addresses[j]}/postData/$lightclient_number)"
        while [[ pub_key_response_header -ne 200 ]] 
        do
            pub_key_response_header="$(curl -X POST --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" --data-binary "@./test_data/test_data.csv" ${validator_data_reciever_service_addresses[j]}/postData/$lightclient_number)"
        done
    done
        


    for ((i=0;i<${#validator_data_reciever_service_addresses[@]};i++))
    do
        echo "calling data reciever service running at ${validator_data_reciever_service_addresses[i]} to verify that test data sent from ligthclient $((j+1)) has been saved for this valdiator"
        data_fill_check_header="$(curl --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" ${validator_data_reciever_service_addresses[i]}/dataFilledConfirm/$lightclient_number)"
        while [[ data_fill_check_header -eq 500 ]] || [[ data_fill_check_header -eq 000 ]]
        do
            data_fill_check_header="$(curl --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" ${validator_data_reciever_service_addresses[i]}/dataFilledConfirm/$lightclient_number)"
        done
    done

    echo "calling all validators for readiness check"
    for ((i=0;i<${#validator_public_addresses[@]};i++))
    do
        validation_run_check_header="$(curl --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" http://${validator_public_addresses[i]}/api/services/ml_service/v1/models/latestmodel)"
        while [[ validation_run_check_header -ne 200 ]]
        do
            validation_run_check_header="$(curl --connect-timeout 5 -o /dev/null -s -w "%{http_code}\n" http://${validator_public_addresses[i]}/api/services/ml_service/v1/models/latestmodel)"
        done
    done

fi



ttab -w npm start -- $port models/MNIST28X28/data.csv $trainer_noise $model_name 
