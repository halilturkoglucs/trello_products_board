import {LOAD_PRODUCTS, LOAD_CUSTOMER, SEARCH_OR_HIGHLIGT_TEXT} from "../constants/action-types";

const initialState = {
  products: [],
  searchedOrHighlightedText: ''
};

function rootReducer(state = initialState, action) {
  if (action.type === LOAD_PRODUCTS) {
    // For each action load only some part of the customers defined by customerInitialLimit.
    return Object.assign({}, state, {
      products: action.payload
    });
  }

  if (action.type === LOAD_CUSTOMER) {
    // For each action load only some part of the customers defined by customerInitialLimit.
    // For this, deep copy the products first and find the product whose customers have been fetched
    let productsWithoutCustomers = JSON.parse(JSON.stringify(state.products));

    let productToBeFilled = productsWithoutCustomers.find(product => {
      return product.id === action.payload.id;
    });

    // Fill in customer details
    if (action.offset === 0) {
      // This means we are requesting for the first time or refreshing the current list
      productToBeFilled.customerList = action.payload.customers;
    } else {
      productToBeFilled.customerList = productToBeFilled.customerList.concat(action.payload.customers);
    }

    productToBeFilled.customerOffset = action.offset;
    productToBeFilled.customerLimit = action.limit;

    let productsWithCustomers = productsWithoutCustomers.map(product => {
      if (product.id === action.payload.id) {
        return productToBeFilled;
      } else {
        return product;
      }
    });

    return {...state, products: productsWithCustomers};
  }

  if (action.type === SEARCH_OR_HIGHLIGT_TEXT) {
    // If the selected mode is s
    return Object.assign({}, state, {
      searchedOrHighlightedText: action.payload
    });
  }

  return state;
}

export default rootReducer;