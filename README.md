# kNN Search with OpenAI

This repo contains files that can be used to setup a functional kNN search (indexing + querying) setup with ReactiveSearch and OpenSearch.

### \[[What are Pipelines](#what-are-pipelines)] \[[Auto Deployments](#auto-deployments)] \[[Index Pipeline](#index-pipeline)] \[[Search Pipeline](#search-pipeline)] \[[Frontend](#frontend)]

## What are Pipelines?

Pipelines lets users define flows that are invoked based on paths. These flows can have custom stages (defined using JavaScript) or they can utilize pre built stages to _override_ the default behaviour of a route.

In this example, we are utilizing pipelines to override the `index` and `search` endpoints to add an extra step that adds vector data based on a few fields and saves it to OpenSearch.

## Auto Deployments

The pipelines are automatically deployed from this repository by using the [pipelines-action](https://github.com/appbaseio/pipelines-action) which uses GitHub Actions to auto deploy the pipelines and does a lot more. [Read here](https://github.com/appbaseio/pipelines-action#usage).

## Index Pipeline

As explained above, an indexing pipeline is defined that automatically adds vector data for the `Name` and `Description` fields and saves them as `dense_vector` in ElasticSearch. These vectors are calculated using the [bert-as-service](https://github.com/hanxiao/bert-as-service) API.

[Read more about this pipeline in the index directory](./backend/index/)

## Search Pipeline

The search pipeline is just an usual search pipeline with an extra step to inject the vector data.

[Read more about this pipeline in the search directory](./backend/search/)

## Frontend

The frontend of this app is built using [ReactiveSearch](https://github.com/appbaseio/reactivesearch) components. These components are used with VueJS in this example.

[Read more about the frontend in the frontend directory](./frontend/)
