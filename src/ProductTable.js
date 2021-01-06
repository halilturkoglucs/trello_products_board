import React, {Component} from "react";
import {connect} from "react-redux";
import {loadCustomersForProduct, loadProducts, searchOrHighlight, setSearchMode} from "./actions/index";
import './styles/_productGrid.scss';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';

export class ProductTable extends Component {

  // Default Constructor

  componentDidMount() {
    // Load products from the backend
    // For each product, load initially only the first 3 customers since the user can request more later
    // This is to reduce load on the page
    this.props.loadProducts();

    // Schedule load for every 30 seconds
    const POLLING_INTERVAL = 30000
    setInterval(() => {
      this.props.loadProducts();
    }, POLLING_INTERVAL)
  }

  hasCustomer(product) {
    return product.customerList !== undefined && product.customerList.length > 0;
  }

  loadMoreCustomers(product) {
    // Check edge case
    let offset;

    if (product.customerOffset + product.customerLimit < product.customers) {
      offset = product.customerOffset + product.customerLimit;
    } else {
      offset = product.customers;
    }

    this.props.loadCustomersForProduct(product.id, offset, product.customerLimit);
  }

  renderCustomerList(product) {
    let customerList = product.customerList.map(customer => (
      <div className="customer" key={customer.id}>
        <div>
          <Image className="customer--avatar"
                 src={customer.avatar}
                 alt={customer.name} rounded/>
        </div>
        <div>
          <h3 className="customer--name">{this.highlight(customer.name)}</h3>
        </div>
        {
          customer.job && (
            <div>
              <small className="customer--position">{this.highlight(customer.job.title)}</small>
              <br/>
              <small className="customer--company">{this.highlight(customer.job.company)}</small>
            </div>
          )
        }
        {
          customer.quote && (
            <div>
              <blockquote className="customer--quote">
                {this.highlight(customer.quote)}
              </blockquote>
            </div>
          )
        }
      </div>
    ))

    // Add Load More buttons if there are any left
    if (product.customerOffset + product.customerLimit < product.customers) {
      customerList.push(
        <Button variant="primary"
                onClick={() => this.loadMoreCustomers(product)}
                key={product.id}>
          Load More
        </Button>
      )
    }

    return customerList
  }

  searchOrHighlight(e) {
    this.props.searchOrHighlight(e.target.value)
  }

  setSearchMode(e) {
    this.props.setSearchMode(e.target.value)
  }

  highlight(text) {
    // If the search mode is highlight and if the searched text is inside the given text parameter
    // Then surround the searched text with a css class to highlight it, then return a DOM element
    if (this.props.searchHighlightSwitch === "1" || this.props.searchHighlightSwitch === "3") {
      if (this.props.searchedOrHighlightedText) {
        let indexOfSearchedText = text.toLowerCase().indexOf(this.props.searchedOrHighlightedText.toLowerCase());
        if (indexOfSearchedText >= 0) {
          let highlightedMarkup = "";
          let startIndex = 0;
          while (indexOfSearchedText >= 0) {
            let preHighlightedText = text.substring(startIndex, indexOfSearchedText);
            let highlightedText = "<span class='highlight'>" + this.props.searchedOrHighlightedText + "</span>";
            let postHighlightedText = text.substring(indexOfSearchedText + this.props.searchedOrHighlightedText.length);

            highlightedMarkup += preHighlightedText + highlightedText;

            // Search for other occurrences
            startIndex = indexOfSearchedText + this.props.searchedOrHighlightedText.length;
            indexOfSearchedText = text.toLowerCase().indexOf(this.props.searchedOrHighlightedText.toLowerCase(), startIndex);

            if (indexOfSearchedText < 0) {
              // Then there are no other occurrences, so we should append the postHighlightedText
              highlightedMarkup += postHighlightedText;
            }
          }

          // WARNING: normally this highlightedMarkup should be sanitized to prevent XSS
          return (
            <p dangerouslySetInnerHTML={{__html: highlightedMarkup}}/>
          );
        } else {
          return text;
        }
      } else {
        return text;
      }
    } else {
      return text;
    }
  }

  search(product) {
    // If the search mode is Search or both, then try to find a match in product name or customer info
    if (this.props.searchHighlightSwitch === "2" || this.props.searchHighlightSwitch === "3") {
      let searchedText = this.props.searchedOrHighlightedText;

      if (!searchedText) return true;

      //

      return product.name.toLowerCase().includes(searchedText.toLowerCase()) ||
        (product.customerList && product.customerList.find(customer => {
        return customer.name.toLowerCase().includes(searchedText.toLowerCase()) ||
          (customer.job &&
            (customer.job.title.toLowerCase().includes(searchedText.toLowerCase()) ||
              customer.job.company.toLowerCase().includes(searchedText.toLowerCase()))
          ) ||
          (customer.quote && customer.quote.toLowerCase().includes(searchedText.toLowerCase()));

      }));
    } else {
      return true
    }
  }

  render() {
    return (
      <div>
        <Form className="align-left">
          <Form.Group controlId="searchOrHighlight">
            <Form.Label>Choose Search Mode</Form.Label>
            <Form.Control as="select" custom onChange={(e) => this.setSearchMode(e)}>
              <option value="0">--</option>
              <option value="1">Highlight</option>
              <option value="2">Search</option>
              <option value="3">Both</option>
            </Form.Control>
          </Form.Group>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search or Highlight"
              aria-label="Search or Highlight"
              aria-describedby="search-or-highlight"
              onChange={(e) => this.searchOrHighlight(e)}
            />
          </InputGroup>
        </Form>
        <div className="product-list">
          {this.props.products.map(product => (
            this.search(product) &&
            <div key={product.id} className="product">
              <h2>{this.highlight(product.name)}</h2>
              {
                this.hasCustomer(product) &&
                this.renderCustomerList(product)
              }
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.products,
    searchedOrHighlightedText: state.searchedOrHighlightedText,
    searchHighlightSwitch: state.searchHighlightSwitch
  };
};

export default connect(
  mapStateToProps,
  {loadProducts, loadCustomersForProduct, searchOrHighlight, setSearchMode}
)(ProductTable);