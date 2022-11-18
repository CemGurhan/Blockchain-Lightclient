""" README
This script sorts the data, per node, to simulate the non-iid training scenario.
This should only be used when there ate 10 lighclients involved int raining,
otherwise, certain digits will be missing from training set and impair model accuracy.
(NOTE: A similar file could be implemented in the Validator repo to sync the digits present in the
training set with those present in the test set.)

This script should be executed from the lightclient<node_number - 1> directory.
therefore, cd into the correct directory before executing the script.

This script can be run with the following command:
`python scripts/sort_data.py -n <node_number>`
where `node_number` is between 1 and 10.
"""

import argparse

parser = argparse.ArgumentParser(description='Sort the training data by lightclient node numebr')
parser.add_argument('-n', '--node_number', help='The lightclient node number (1-10)', required=True)
args = vars(parser.parse_args())
sort_no = int(args["node_number"]) - 1

print(f"Trying to filter data for the node {args['node_number']} by sort number: {sort_no}.")

with open(f"./models/MNIST28X28/data.csv", "r") as read_file:
    data = read_file.readlines()

    with open(f"./models/MNIST28X28/data_old.csv", "w") as wf:
        wf.writelines(data)

    count = 1
    with open(f"./models/MNIST28X28/data.csv", "w") as write_file:
        write_file.writelines(data[0])
        for i in range(1, len(data)):
            if data[i][0] == str(sort_no) and count <= 892:
                write_file.writelines(data[i])
                count += 1

print(f"The file '/lightclient{'' if sort_no == 0 else sort_no}/models/MNIST28X28/data.csv' has been successfully filtered.")
print(f"This file now only includes data pertaining to the number: {sort_no}")
print(f"The original data file now exists at '/lightclient{'' if sort_no == 0 else sort_no}/models/MNIST28X28/data_old.csv'.")