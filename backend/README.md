# Backend for kNN Search with OpenAI

This repo contains pipelines that can be used in ReactiveSearch in order to create a functional setup of kNN search (indexing + querying) using OpenAI's Embeddings API.

## How?

Two pipelines are created here. One to index the data (with vectorization). One to search the vectored data. In both cases we are using OpenAI's Embeddings AI in order to get vector representation of passed text.

### DataSet

The [Amazon Reviews](https://www.kaggle.com/datasets/snap/amazon-fine-food-reviews) data set is used for this example that includes food reviews across Amazon. Two important fields from the dataset are `Text` and `Summary` which indicate the complete review and the summary of the review. We will index these two values as vector data and then run the query on top of them.

These fields can be changed according to the functionality of the app, this will be explained in the [indexing pipeline](./index/README.md).

### Index Pipeline

Index pipeline is just an usual indexing pipeline that indexes data to ElasticSearch with an extra step that captures vectors of the following fields:

- Summary
- Text

Above fields are stored as `knn_vector` so that it can be utilized for kNN searching during the querying phase.

**[Read More](./index/README.md)**

### Search Pipeline

Search Pipeline adds an extra step that generates the vector representation of the passed query and accordingly passes it to OpenSearch.

**[Read More](./search/README.md)**

### Requirements

- OpenSearch only. ElasticSearch will not work since ElasticSearch has a limitation on the dimensions (length) of the vector array. This limits ElasticSearch vector arrays to be not more than `1024` in dimension but OpenAI's Embeddings API returns vectors of dimension `1536` which is supported by OpenSearch.
- [opensearch-knn](https://opensearch.org/docs/latest/search-plugins/knn/index/) plugin should be installed in OpenSearch. This is installed by default in all complete versions of OpenSearch but are not part of the minimal distributions of OpenSearch.
