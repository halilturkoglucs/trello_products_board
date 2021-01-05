import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductTable from './ProductTable';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './styles/_app.scss';

function App() {
  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col>
            <h2 className="header">Products</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <ProductTable/>
          </Col>
        </Row>
      </Container>


    </div>
  );
}

export default App;
