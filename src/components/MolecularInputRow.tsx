import React from 'react'

import InputGroup from "react-bootstrap/InputGroup"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"

interface IMolecularInputRowProps {
  title: string | JSX.Element
  units: string
  placeholder?: string
}

function MolecularInputRow({title, units, placeholder}: IMolecularInputRowProps): JSX.Element {
  return (
    <Form.Row className="mb-1">
      <Form.Label column xs={12} className="input-label">{title}</Form.Label>
      <Col>
        <InputGroup>
          <Form.Control placeholder={placeholder ? placeholder : ""} className="text-right"/>
          <InputGroup.Append>
            <InputGroup.Text>{units}</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </Col>
    </Form.Row>
  )
}

export default MolecularInputRow