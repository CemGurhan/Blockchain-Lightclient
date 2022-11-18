rm -rf ModelMetadata
port=9000
number_of_trainers=1

while getopts "p:n:" arg; do
    case $arg in
    p) port=$(($OPTARG)) ;;
    n) number_of_trainers=$(($OPTARG)) ;;
    esac
done


for ((i=1;i<$number_of_trainers;i++))
do
    sh ./scripts/lightclient_copy.sh $i $port
done

source ./scripts/utils/newTab.sh
openTab eval "echo 'Welcome to the DataNET local tester. You are running $number_of_trainers trainers for local testing'"

for ((i=0;i<$number_of_trainers;i++))
do
    source ./scripts/utils/newTab.sh
    newtab eval "cd $PWD; npm start -- $port models/MNIST28X28/data.csv 0.1 MNIST28X28" 
done

# n = 2 doesnt work

