import React, { useState } from "react";
import { Container, ListGroup, Navbar, Spinner } from "react-bootstrap";
import {
  ReactiveBase,
  ReactiveList,
  SearchBox,
} from "@appbaseio/reactivesearch";

import "bootstrap/dist/css/bootstrap.min.css";
import sanitize from "sanitize-html";

import styles from "./App.module.css";

import "./App.css";

const SUGGESTION_DEBOUNCE_DELAY = 50;

const sampleQueries = [
  {
    label: "Soft food recommendation for a young pup with high quality ingredients",
    value: "soft food recommendation for a young pup with high quality ingredients",
    id: 1,
  },
  {
    label: "Delicious decaf coffee that's value for money",
    value: "delicious decaf coffee that's value for money",
    id: 2,
  },
];

function Main() {
  const [searchValue, setSearchValue] = useState("");

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
            const searchValue = searchQuery && searchQuery.value;
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
        <p className="w-75 hide-xs">
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
        render={({
          data,
          downshiftProps: {
            isOpen,
            getItemProps,
            highlightedIndex,
            selectedItem,
          },
        }) => {
          return isOpen ? (
            <div className={`${styles.suggestions}`}>
              <div>
                <p className="lead mx-2 mt-3">Sample queries to try:</p>
                <div>
                  {sampleQueries.map((item, index) => (
                    <div
                      /* eslint-disable-next-line react/no-array-index-key */
                      key={item.id + index}
                      {...getItemProps({
                        item,
                        style: {
                          backgroundColor:
                            highlightedIndex === index
                              ? "var(--bs-primary)"
                              : "white",
                          color:
                            highlightedIndex === index
                              ? "var(--bs-white)"
                              : "var(--bs-black)",
                          fontWeight: selectedItem === item ? "bold" : "normal",
                          padding: "5px 15px",
                        },
                      })}
                      className="listItem"
                    >
                      <span className="clipText">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              {data && data.length ? (
                <p className="lead mx-2 mt-3">Suggestions:</p>
              ) : null}
              {data.map((item, index) => (
                <div
                  /* eslint-disable-next-line react/no-array-index-key */
                  key={item._id + index}
                  {...getItemProps({
                    item,
                    style: {
                      backgroundColor:
                        highlightedIndex === index + sampleQueries.length
                          ? "var(--bs-primary)"
                          : "white",
                      color:
                        highlightedIndex === index + sampleQueries.length
                          ? "var(--bs-white)"
                          : "var(--bs-black)",
                      fontWeight: selectedItem === item ? "bold" : "normal",
                      padding: "5px 15px",
                    },
                  })}
                  className="listItem"
                >
                  <span className="clipText">{item.value}</span>
                </div>
              ))}
            </div>
          ) : null;
        }}
      />

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
                <ListGroup className={styles.list} variant="flush">
                  {data.map((item) => (
                    <ListGroup.Item key={item["Summary"]} className="py-4 px-2">
                      <h1 className="h3">{item["Summary"]}</h1>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: sanitize(item["Text"]),
                        }}
                      />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
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
