with open(f"./models/MNIST28X28/data.csv") as training_data:
    data = training_data.readlines()

    with open(f"./test_data/test_data.csv", 'w') as write_file:
        for row in range(100): # first 10 only
            write_file.writelines(data[row])

