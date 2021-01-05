import React, {Component} from "react";
import {connect} from "react-redux";
import {loadCustomersForProduct, loadProducts, searchOrHighlight} from "./actions/index";
import './styles/_productGrid.scss';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

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
                 alt={customer.name} rounded />
        </div>
        <div>
          <h3 className="customer--name">{customer.name}</h3>
        </div>
        {
          customer.job && (
            <div>
              <small className="customer--position">{customer.job.title}</small>
              <br/>
              <small className="customer--company">{customer.job.company}</small>
            </div>
          )
        }
        {
          customer.quote && (
            <div>
              <blockquote className="customer--quote">
                {customer.quote}
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

  render() {
    return (
      <div>
        <div>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search or Highlight"
              aria-label="Search or Highlight"
              aria-describedby="search-or-highlight"
              onChange={(e) => this.searchOrHighlight(e)}
            />
          </InputGroup>
        </div>
        <div className="product-list">
          {this.props.products.map(product => (
            <div key={product.id} className="product">
              <h2>{product.name}</h2>
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
    products: state.products
  };
};

export default connect(
  mapStateToProps,
  {loadProducts, loadCustomersForProduct, searchOrHighlight}
)(ProductTable);