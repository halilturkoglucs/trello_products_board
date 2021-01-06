import {LOAD_CUSTOMER, LOAD_PRODUCTS, SEARCH_OR_HIGHLIGT_TEXT, SET_SEARCH_MODE} from "../constants/action-types";

export function loadProducts() {
  return function (dispatch) {
    return fetch("http://localhost:9000/products")
      .then(response => response.json())
      .then(json => {
        dispatch({type: LOAD_PRODUCTS, payload: json});
        return json;
      })
      .then(products => {
        // Load the customers for each product
        const CUSTOMER_LOAD_LIMIT = 7;
        products.forEach(product => {
          loadCustomersForProduct(product.id, 0, CUSTOMER_LOAD_LIMIT)(dispatch);
        });
      });
  };
};

export function loadCustomersForProduct(product, offset, limit) {
  return function (dispatch) {
    return fetch("http://localhost:9000/products/" + product + "?offset=" + offset + "&limit=" + limit)
      .then(response => response.json())
      .then(json => {
        dispatch({type: LOAD_CUSTOMER, payload: json, offset: offset, limit: limit});
      });
  };
};

export function searchOrHighlight(text) {
  return {type: SEARCH_OR_HIGHLIGT_TEXT, payload: text};
};

export function setSearchMode(mode) {
  return {type: SET_SEARCH_MODE, payload: mode}
}