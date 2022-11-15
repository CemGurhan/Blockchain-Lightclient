rm -rf model_metadata
port=9000
number_of_trainers=1

while getopts "p:n:" arg; do
    case $arg in
    p) port=$(($OPTARG)) ;;
    n) number_of_trainers=$(($OPTARG)) ;;
    esac
done

for i in $(seq 0 $(($number_of_trainers - 1))); do 
    echo "starting lightlicent $((i+1))"
    source ./scripts/utils/newTab.sh
    newtab eval "cd $PWD; npm start -- $port models/MNIST28X28/data.csv 0.1 MNIST28X28"
done
