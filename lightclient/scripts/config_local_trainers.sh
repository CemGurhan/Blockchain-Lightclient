rm -rf model_metadata
port=9000
number_of_trainers=1

while getopts "p:n:" arg; do
    case $arg in
    p) port=$(($OPTARG)) ;;
    n) number_of_trainers=$(($OPTARG)) ;;
    esac
done

npm start -- $port models/MNIST28X28/data.csv 0.1 MNIST28X28

for ((i=1;i<$number_of_trainers;i++))
do
    source ./scripts/utils/newTab.sh
    newtab eval "cd $PWD; sh ./scripts/lightclient_copy_run.sh $i $port" 
done

# n = 2 doesnt work

