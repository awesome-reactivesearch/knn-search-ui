# kNN Search Pipeline

This pipeline will take care of querying the index with vector data by passing the vector representation of the passed `query value`. A few stages are used in this pipeline to get the whole flow working.

The pipeline will listen to `POST` requests for the endpoint `/amazon_reviews/_reactivesearch`.

## Envs

In order for this pipeline to run properly, the OpenAI Embeddings API's API Key will have to be specified in the envs. This can be fetched from the OpenAI dashboard by signing up.

## Stages Used

Following stages are defined in the pipeline:

- **authorized user**: Authorize the user by using a pre-built stage `authorization`.
- **fetch embeddings**: This uses a pre-built stage named `openAIEmbeddings` in order to fetch the embeddings for the passed query. This stage will modify each query in the request body that has the `vectorDataField` set.
- **reactivesearchQuery**: Convert the incoming ReactiveSearch request into it's OpenSearch equivalent by using the pre-built stage `reactivesearchQuery`
- **elasticsearchQuery**: Send the final request body to OpenSearch by using the pre-built stage `elasticsearchQuery`.

### Things to keep in mind

In order for the `openAIEmbeddings` stage to modify the query, the `vectorDataField` will have to be specified in the query. Moreover, the `value` field will be utilized for generating the vector representation. This can be overridden by using a static string and passing it through inputs through the `text` field.
