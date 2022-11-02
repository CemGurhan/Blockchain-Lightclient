i=$(($1))
curl `${HOST}/api/services/ml_service/v1/models/getmodel?version=$((i))`