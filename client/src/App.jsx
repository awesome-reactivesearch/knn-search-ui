import React, { useRef, useState } from "react";
import { Button, Card, Container, Navbar, Spinner } from "react-bootstrap";
import {
  ReactiveBase,
  ReactiveList,
  SearchBox,
} from "@appbaseio/reactivesearch";

import "bootstrap/dist/css/bootstrap.min.css";
import sanitize from "sanitize-html";

import styles from "./App.module.css";

const SUGGESTION_DEBOUNCE_DELAY = 500;
const QUERY_DEBOUNCE_DELAY = 1000;

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
  const [searchValue, setSearchValue] = useState("");
  const timerRef = useRef();

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
        body.query = body.query.map((componentQuery) => {
          if (
            componentQuery.id === "SearchComponent" &&
            componentQuery.type === "search"
          ) {
            return { ...componentQuery, vectorDataField: "vector_data" };
          }
          if (
            componentQuery.id === "SearchResult" &&
            componentQuery.type === "search"
          ) {
            const searchQuery = body.query.find(
              (q) => q.id === "SearchComponent" && q.type === "search"
            );
            const searchValue = searchQuery.value;
            delete componentQuery.react;

            return {
              ...componentQuery,
              vectorDataField: "vector_data",
              value: searchValue,
            };
          }
          return componentQuery;
        });
        body.settings = {
          recordAnalytics: false,
          backend: "opensearch",
        };
        const newReq = { ...req, body: JSON.stringify(body) };
        return newReq;
      }}
    >
      <Navbar bg="white" className="shadow" expand="lg">
        <Container>
          <Navbar.Brand>Reactivesearch</Navbar.Brand>
          <span className={`text-white ${styles.headingTag}`}>KNN Search</span>
          <a href="">How this is built</a>
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
        dataField={["Summary"]}
        componentId="SearchComponent"
        className="mx-5"
        size={5}
        showClear
        value={searchValue}
        debounce={SUGGESTION_DEBOUNCE_DELAY}
        onChange={(value) => {
          setSearchValue(value);
        }}
      />
      {!searchValue ? (
        <div className="mx-5 mt-3 mb-5">
          <p className="lead">Sample queries to try:</p>
          <div>
            {sampleQueries.map((sampleQuery) => (
              <Button
                variant="outline-primary"
                className="me-2"
                key={sampleQuery.id}
                onClick={() => {
                  const inputEl = document.getElementById(
                    `SearchComponent-downshift-input`
                  );
                  setSearchValue(sampleQuery.label);
                  setTimeout(() => inputEl.focus());
                }}
              >
                {sampleQuery.label}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      <ReactiveList
        componentId="SearchResult"
        dataField="Summary"
        size={6}
        className="position-relative"
        pagination
        react={{ and: "SearchComponent" }}
        loader={
          <div className={styles.spinner}>
            <Spinner animation="border" variant="primary" />
          </div>
        }
        renderResultStats={(stats) => {
          return stats ? (
            <div className="mx-5">
              {stats.numberOfResults} results found in {stats.time}ms
            </div>
          ) : null;
        }}
        render={({ data }) => {
          return (
            <div className="mx-5 my-2">
              <div className="row">
                {data.map((item) => (
                  <Card
                    className={`col-md-3 col-sm-5 col-xs-12 m-1`}
                    key={item._id}
                  >
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
            </div>
          );
        }}
      />
    </ReactiveBase>
  );
}

const App = () => <Main />;

export default App;
