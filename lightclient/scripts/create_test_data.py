import random

all_data = []

with open(f"./models/MNIST28X28/data.csv", "r") as training_data:
    data = list(training_data.readlines())
    header, data = data[0], data[1:]

    random.shuffle(data)

    all_data.append(header)
    all_data.append(data[:10])

with open(f"./test_data/test_data.csv", 'w') as write_file:
    for line in all_data:
        write_file.writelines(line)


# line = '0,0,0,0,0...,n'