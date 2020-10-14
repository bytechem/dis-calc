import React, {FC} from "react"

import {FormControlProps} from "react-bootstrap/FormControl"
import InputGroup from "react-bootstrap/InputGroup"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"

import "./InputRow.css"

interface MolecularInputRowProps extends FormControlProps {
  title: React.ReactNode
  unitOptions: string[]
  selectedUnitIndex?: number
  onValueChange?: (value: string) => void
  onUnitChange?: (unitIndex: number) => void
}

const MolecularInputRow: FC<MolecularInputRowProps> = ({
  title,
  unitOptions,
  selectedUnitIndex = 0,
  onValueChange = () => {},
  onUnitChange = () => {},
  ...props
}) => {
  if (
    !Number.isInteger(selectedUnitIndex) ||
    selectedUnitIndex < 0 ||
    selectedUnitIndex >= unitOptions.length
  )
    throw Error(`'selectedUnitIndex' must be an integer between 0 and ${unitOptions.length - 1}`)

  return (
    <Form.Row className="mb-1">
      <Form.Label column xs={12} className="input-label">
        {title}
      </Form.Label>
      <Col>
        <InputGroup>
          <Form.Control
            {...props}
            className="value text-right"
            onChange={({target: {value}}) => onValueChange(value)}
          />
          <Form.Control
            as="select"
            className="unit"
            style={{width: "fit-content"}}
            value={selectedUnitIndex}
            onChange={({target: {value}}) => onUnitChange(parseInt(value))}
          >
            {unitOptions.map((u, i) => (
              <option key={i} value={i}>
                {u}
              </option>
            ))}
          </Form.Control>
        </InputGroup>
      </Col>
    </Form.Row>
  )
}

export default MolecularInputRow
