# Indexing Script

We are not overriding the `/_bulk` endpoint with the pipelines. However, the indexing of these data requires an extra step that adds the vector data.

Since that is the case, we will have to index the data using the `_doc` endpoint. The `index.py` file in this directory can take care of that.

Just pass a JSON file to this script. This JSON should contain an array of objects and the script will take care of writing these to the index using the `_doc` endpoint. The script will also keep track of the written items in case it fails in between so restarting the script will not rewrite the same things over and over again.

## Pre Requisites

To get the script to run a few things need to be done.

- Create a `written.txt` file:

```sh
touch written.txt
```

- Copy the JSON file to the current directory and name it `reviews.json`

```sh
mv your_file.json reviews.json
```

- Install requirements using pip

```sh
pip install -r requirements.txt
```

- (Optional) Update the `UPSTREAM_URL` inside the `index.py` file to point it to your appbase.io upstream URL.

## Usage

Once the requirements are ready, the script can be run in the following way:

```sh
python3 index.py
```

### Using Amazon Reviews DataSet

This data set can be downloaded for free. The downloaded file will be in `.csv` format after which converting it to `JSON` is not an issue since there are a lot of tools to do that.

[Link to the dataset](https://www.kaggle.com/datasets/snap/amazon-fine-food-reviews)
