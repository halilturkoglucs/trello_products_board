import * as actions from './index'
import * as types from '../constants/action-types'
import {LOAD_CUSTOMER, LOAD_PRODUCTS} from '../constants/action-types' // You can use any testing library
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'
import expect from 'expect'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('test synchronous actions', () => {
  it('should have an action to set searched or highlighted text', () => {
    const text = 'Searched or Highlighted Text'
    const expectedAction = {
      type: types.SEARCH_OR_HIGHLIGT_TEXT,
      payload: text
    }
    expect(actions.searchOrHighlight(text)).toEqual(expectedAction)
  })

  it('should have an action to set search mode', () => {
    const mode = '1'
    const expectedAction = {
      type: types.SET_SEARCH_MODE,
      payload: mode
    }
    expect(actions.setSearchMode(mode)).toEqual(expectedAction)
  })
})

describe('test async actions', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('dispatches LOAD_CUSTOMER when loading more customers for a product when "Load More" button has been clicked', () => {
    fetchMock.getOnce("http://localhost:9000/products/jira?offset=0&limit=7", {
      body: {customers: [], id: "jira", name: "jira"},
      headers: {'content-type': 'application/json'}
    })

    const expectedActions = [
      {type: LOAD_CUSTOMER, payload: {customers: [], id: "jira", name: "jira"}, offset: 0, limit: 7}
    ]

    const store = mockStore({
        products: [],
        searchedOrHighlightedText: '',
        searchHighlightSwitch: 0
      }
    )

    return store.dispatch(actions.loadCustomersForProduct("jira", 0, 7)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('dispatches LOAD_PRODUCTS and LOAD_CUSTOMER when loading products initially', () => {
    fetchMock.getOnce("http://localhost:9000/products", {
      body: [{id: "jira", self: "http://localhost:9000/products/jira", name: "Jira", customers: 50}],
      headers: {'content-type': 'application/json'}
    })

    fetchMock.getOnce("http://localhost:9000/products/jira?offset=0&limit=7", {
      body: {customers: [], id: "jira", name: "jira"},
      headers: {'content-type': 'application/json'}
    })

    const expectedActions = [
      {type: LOAD_PRODUCTS, payload: [{id: "jira", self: "http://localhost:9000/products/jira", name: "Jira", customers: 50}]}
    ]

    const store = mockStore({
        products: [],
        searchedOrHighlightedText: '',
        searchHighlightSwitch: 0
      }
    )

    return store.dispatch(actions.loadProducts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})