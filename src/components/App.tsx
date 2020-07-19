import React from 'react';

import InputGroup from "react-bootstrap/InputGroup"
import Container from "react-bootstrap/Container"
import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import './App.scss';
import MolecularInputRow from './MolecularInputRow'


function App() {
  return (
    <Container fluid>
      <Row>
        <Col>
          <h1 className="text-center">Dilution Equilibrium Calculator</h1>
        </Col>
      </Row>
      <Row>
        <Col lg={6} className="mt-2">
          <Card>
            <Card.Body>
              <Card.Title className="text-center">AB ⇌ A + B</Card.Title>
              <Form>
                <MolecularInputRow title="Molecular Weight A" units="g/mol" placeholder="1000"/>
                <MolecularInputRow title="Molecular Weight B" units="g/mol" placeholder="1000"/>
                <MolecularInputRow title={<>K<sub>D</sub></>} units="&mu;M" placeholder="1.0"/>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mt-2">
          <Card>
            <Card.Body>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default App;
