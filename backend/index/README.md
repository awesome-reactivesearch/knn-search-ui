# kNN Indexing Pipeline

This pipeline lets users index data into the `amazon_reviews` index with an extra step that takes care of injecting the incoming request body with vector data so that it can be indexed for later query'ing.

## Index

The index needs to be created with a few settings in order for it to accept the vector data and accordingly treat it similarly for search. This can be done by the following request:

```sh
curl --location --request PUT 'https://{{host}}:{{port}}/amazon_reviews' \
--header 'Content-Type: application/json' \
--data-raw '{
    "settings": {
        "knn": true,
        "knn.algo_param.ef_search": 100
    },
    "mappings": {
        "properties": {
            "vector_data": {
                "type": "knn_vector",
                "dimension": 1536,
                "method": {
                    "name": "hnsw",
                    "space_type": "cosinesimil",
                    "engine": "nmslib"
                }
            }
        }
    }
}'
```

> In the above, change the host with the host and the port with the port where OpenSearch is listening to.

## Envs

In order for this pipeline to run properly, the OpenAI Embeddings API's API Key will have to be specified in the envs. This can be fetched from the OpenAI dashboard by signing up.

## Stages Used

The pipeline is defined with the following stages:

- **authorize user**: Use the pre-built stage `authorization` to authorize the user
- **fetch embeddings**: Use the pre-built stage `openAIEmbeddingsIndex` to fetch the embeddings for the passed body. Here the fields that are vectorized are passed in the `inputKeys` value. This array can contain any valid field name that will be vectorized by reading from the body. The fields passed in this should be of type `string`.
- **index data**: This stage uses the pre-built stage `elasticsearchQuery` to index the data into ElasticSearch by making a `/_doc` call.

## Helper Script

After the indexing pipeline is setup, it might be a chore to index the data into the index. Keeping this in mind, we have provided an utility script that can be used to index the data by just running it once. [Read more about it here](./util/README.md)
