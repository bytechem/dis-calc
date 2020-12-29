import React, {useReducer} from "react"

import InputGroup from "react-bootstrap/InputGroup"
import Container from "react-bootstrap/Container"
import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import BootstrapTable from "react-bootstrap-table-next"
// @ts-ignore
import cellEditFactory from "react-bootstrap-table2-editor"

import * as math from "mathjs"

import MolecularInputRow from "./MolecularInputRow"
import {computeEquilibrium} from "../logic"

import "./App.scss"

const mwUnitOptions = [
  {value: "g/mol", display: "g/mol"},
  {
    value: "g/mol",
    display: "Da",
  },
  {value: "kg/mol", display: "kDa"},
]
const kDUnitOptions = [
  {v: ""},
  {v: "m"},
  {
    v: "u",
    d: "μ",
  },
  {v: "n"},
  {v: "p"},
  {v: "f"},
].map((e) => ({value: `${e.v}mol/L`, display: `${e.d || e.v}M`}))

interface State {
  mwA: string
  mwUnitIndexA: number
  mwB: string
  mwUnitIndexB: number
  kD: string
  kDUnitIndex: number
  partsA: string
  partsB: string
  concentrations: string[]
}

type ChangeAction<S> = (s: S) => S

function stateReducer(state: State, action: ChangeAction<State>): State {
  return action(state)
}

const initialState = {
  mwA: "50",
  mwUnitIndexA: 2,
  mwB: "150",
  mwUnitIndexB: 2,
  kD: "10",
  kDUnitIndex: 3,
  partsA: "1",
  partsB: "1",
  concentrations: ["0.05", "0.04", "0.01", "0.004"],
} as State

const tableColumns = [
  {dataField: "conc", text: "Total Concentration (mg/mL)"},
  {dataField: "percentPossibleAB", text: "Percent resulting AB vs. possible AB", editable: false},
  {
    dataField: "percentParticlesAB",
    text: "Percent of the particles corresponding to AB",
    editable: false,
  },
  {
    dataField: "percentParticlesA",
    text: "Percent of the particles corresponding to A",
    editable: false,
  },
  {
    dataField: "percentParticlesB",
    text: "Percent of the particles corresponding to B",
    editable: false,
  },
]

interface TableRow {
  id: number
  conc: string
  percentPossibleAB: string | number
  percentParticlesAB: string | number
  percentParticlesA: string | number
  percentParticlesB: string | number
}

function compute(s: State) {
  const mwUnitA = math.unit(`${parseFloat(s.mwA)} ${mwUnitOptions[s.mwUnitIndexA].value}`)
  const mwUnitB = math.unit(`${parseFloat(s.mwB)} ${mwUnitOptions[s.mwUnitIndexB].value}`)
  const [mwExcess, mwLimiting, partsExcess, partsLimiting] =
    s.partsA > s.partsB
      ? [mwUnitA, mwUnitB, s.partsA, s.partsB]
      : [mwUnitB, mwUnitA, s.partsB, s.partsA]
  return computeEquilibrium({
    mwExcessComponent: mwExcess,
    mwLimitingComponent: mwLimiting,
    KD: math.unit(`${parseFloat(s.kD)} ${kDUnitOptions[s.kDUnitIndex].value}`),
    foldExcess: parseFloat(partsExcess) / parseFloat(partsLimiting),
    multipleTotalConcWV: s.concentrations.map((e) => math.unit(`${parseFloat(e)} mg/mL`)),
  }).map(({percentParticlesExcess, percentParticlesLimiting, ...o}) => {
    const [A, B] =
      s.partsA > s.partsB
        ? [percentParticlesExcess, percentParticlesLimiting]
        : [percentParticlesLimiting, percentParticlesExcess]
    return {percentParticlesA: A, percentParticlesB: B, ...o}
  })
}

function formatPercent(value: number) {
  return isNaN(value)
    ? "-- %"
    : value.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      }) + " %"
}

function App() {
  const [state, dispatchStateReducer] = useReducer(stateReducer, initialState)

  let output = state.concentrations.map(() => ({
    percentPossibleAB: NaN,
    percentParticlesAB: NaN,
    percentParticlesA: NaN,
    percentParticlesB: NaN,
  }))

  try {
    output = compute(state)
  } catch (e) {}

  const tableRows = state.concentrations.map(
    (c, i): TableRow => {
      return {
        id: i,
        conc: c,
        percentPossibleAB: formatPercent(output[i].percentPossibleAB),
        percentParticlesAB: formatPercent(output[i].percentParticlesAB),
        percentParticlesA: formatPercent(output[i].percentParticlesA),
        percentParticlesB: formatPercent(output[i].percentParticlesB),
      }
    },
  )

  return (
    <Container fluid>
      <Row>
        <Col>
          <h1 className="text-center">Dilution Equilibrium Calculator</h1>
        </Col>
      </Row>
      <Row>
        <Col md={3} className="mt-2">
          <Card>
            <Card.Body>
              <Card.Title className="text-center">AB ⇌ A + B</Card.Title>
              <Form>
                <MolecularInputRow
                  title="Molecular Weight A"
                  unitOptions={mwUnitOptions.map((e) => e.display)}
                  selectedUnitIndex={state.mwUnitIndexA}
                  value={state.mwA}
                  onValueChange={(value) => {
                    dispatchStateReducer((s) => ({...s, mwA: value}))
                  }}
                  onUnitChange={(unit) => {
                    dispatchStateReducer((s) => ({...s, mwUnitIndexA: unit}))
                  }}
                />
                <MolecularInputRow
                  title="Molecular Weight B"
                  unitOptions={mwUnitOptions.map((e) => e.display)}
                  selectedUnitIndex={state.mwUnitIndexB}
                  value={state.mwB}
                  onValueChange={(value) => {
                    dispatchStateReducer((s) => ({...s, mwB: value}))
                  }}
                  onUnitChange={(unit) => {
                    dispatchStateReducer((s) => ({...s, mwUnitIndexB: unit}))
                  }}
                />
                <MolecularInputRow
                  title={
                    <>
                      K<sub>D</sub>
                    </>
                  }
                  unitOptions={kDUnitOptions.map((e) => e.display || e.value)}
                  selectedUnitIndex={state.kDUnitIndex}
                  value={state.kD}
                  onValueChange={(value) => {
                    dispatchStateReducer((s) => ({...s, kD: value}))
                  }}
                  onUnitChange={(unit) => {
                    dispatchStateReducer((s) => ({...s, kDUnitIndex: unit}))
                  }}
                />
                <Form.Row className="mb-1">
                  <Form.Label column xs={12} className="text-center">
                    Molecular Parts A:B
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      value={state.partsA}
                      className="text-right"
                      onChange={({target: {value}}) =>
                        dispatchStateReducer((s) => ({
                          ...s,
                          partsA: value,
                        }))
                      }
                    />
                    <div className="input-group-append input-group-prepend">
                      <InputGroup.Text>:</InputGroup.Text>
                    </div>
                    <Form.Control
                      value={state.partsB}
                      onChange={({target: {value}}) =>
                        dispatchStateReducer((s) => ({
                          ...s,
                          partsB: value,
                        }))
                      }
                    />
                  </InputGroup>
                </Form.Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9} className="mt-2">
          <Card>
            <Card.Body>
              <BootstrapTable
                bootstrap4
                keyField="id"
                data={tableRows}
                columns={tableColumns}
                cellEdit={cellEditFactory({
                  mode: "click",
                  blurToSave: true,
                  afterSaveCell: (oldVal: string, newVal: string, {id}: {id: number}) => {
                    dispatchStateReducer((s) => {
                      const newConc = [...s.concentrations]
                      newConc[id] = newVal
                      return {...s, concentrations: newConc}
                    })
                  },
                })}
                wrapperClasses="table-responsive"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default App
