import React from "react";
import { Button, Card, Container, Navbar, Spinner } from "react-bootstrap";
import {
  ReactiveBase,
  ReactiveList,
  SearchBox,
} from "@appbaseio/reactivesearch";

import "bootstrap/dist/css/bootstrap.min.css";
import sanitize from "sanitize-html";

import styles from "./App.module.css";

const DEBOUNCE_DELAY = 1000;

const sampleQueries = [
  {
    label: "Food for a young pup that doesn't eat dry food",
    value: "Food for a young pup that doesn't eat dry food",
    id: 1,
  },
  {
    label: "Decaf coffee that's vegan friendly",
    value: "Decaf coffee that's vegan friendly",
    id: 2,
  },
];

function Main() {
  return (
    <ReactiveBase
      endpoint={{
        url: "https://824f623279eb:692cfeef-621b-4495-872f-ad3e01757909@opensearch-demo-knn-1-drhnehb-arc.searchbase.io/amazon_reviews/_reactivesearch",
        method: "POST",
      }}
      reactivesearchAPIConfig={{
        recordAnalytics: false,
        userId: "jon",
      }}
      transformRequest={(req) => {
        const body = JSON.parse(req.body);
        body.query = body.query
          .map((q) => {
            if (q.id === "SearchComponent") {
              if (q.type === "suggestion") {
                return {
                  ...q,
                  vectorDataField: "vector_data",
                  type: "search",
                  id: "SearchResult",
                };
              } else if (q.type === "search") {
                return { ...q, vectorDataField: "vector_data" };
              }
            }
            return q;
          })
          .filter((q) => q);
        body.settings = {
          recordAnalytics: false,
          backend: "opensearch",
        };
        const newReq = { ...req, body: JSON.stringify(body) };
        return newReq;
      }}
    >
      <Navbar
        style={{
          background:
            "linear-gradient(30deg, rgba(59,130,246,1) 0%, rgba(59,130,246,1) 0%, rgba(255,42,111,1) 100%)",
        }}
        bg="primary"
        expand="lg"
      >
        <Container>
          <Navbar.Brand className="text-white">
            Reactivesearch | KNN Search
          </Navbar.Brand>
        </Container>
      </Navbar>

      <div className="m-5">
        <h1 className="h4">KNN search with ReactiveSearch</h1>
        <p className="w-75">
          This demo search UI shows the use of kNN to find the most related
          items. The dataset used is of ~40,000 product reviews on Amazon. Try
          it below or see how this is built
        </p>
      </div>

      <SearchBox
        dataField={["Text"]}
        componentId="SearchComponent"
        className="m-5"
        size={5}
        showClear
        renderNoSuggestion={() => "No suggestions found."}
        debounce={DEBOUNCE_DELAY}
        highlight={false}
        render={({ value, downshiftProps: { getItemProps } }) =>
          !value ? (
            <div className="mt-3">
              <p className="lead">Sample queries to try:</p>
              <div>
                {sampleQueries.map((sampleQuery) => (
                  <Button
                    {...getItemProps({
                      item: sampleQuery,
                    })}
                    variant="outline-primary"
                    className="me-2"
                    key={sampleQuery.id}
                  >
                    {sampleQuery.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : null
        }
      />

      <ReactiveList
        componentId="SearchResult"
        dataField="Text"
        size={12}
        className="m-5 position-relative"
        pagination
        react={{
          and: "SearchComponent",
        }}
        loader={
          <div className={styles.spinner}>
            <Spinner animation="border" variant="primary" />
          </div>
        }
        render={({ data }) => {
          return (
            <div className="row row-cols-1 row-cols-sm-3 row-cols-md-5">
              {data.map((item) => (
                <Card className="col m-1" key={item._id}>
                  <Card.Body>
                    <Card.Title>{item["Summary"]}</Card.Title>
                    <Card.Text
                      className={styles.description}
                      dangerouslySetInnerHTML={{
                        __html: sanitize(item["Text"]),
                      }}
                    />
                  </Card.Body>
                </Card>
              ))}
            </div>
          );
        }}
      />
    </ReactiveBase>
  );
}

const App = () => <Main />;

export default App;
