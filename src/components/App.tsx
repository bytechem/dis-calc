import React, {useReducer} from "react"

import Container from "react-bootstrap/Container"
import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import BootstrapTable from "react-bootstrap-table-next"

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
  concentrations: ["0.05", "0.04", "0.01", "0.004"],
} as State

const tableColumns = [
  {dataField: "conc", text: "Total Concentration (mg/mL)"},
  {dataField: "percentPossibleAB", text: "Percent resulting AB vs. possible AB"},
  {dataField: "percentParticlesAB", text: "Percent of the particles corresponding to AB"},
  {dataField: "percentParticlesA", text: "Percent of the particles corresponding to A"},
  {dataField: "percentParticlesB", text: "Percent of the particles corresponding to B"},
]

interface TableRow {
  id: number
  conc: string
  percentPossibleAB: string | number
  percentParticlesAB: string | number
  percentParticlesA: string | number
  percentParticlesB: string | number
}

function compute(i: State) {
  return computeEquilibrium({
    mwExcessComponent: math.unit(`${i.mwA} ${mwUnitOptions[i.mwUnitIndexA].value}`),
    mwLimitingComponent: math.unit(`${i.mwB} ${mwUnitOptions[i.mwUnitIndexB].value}`),
    KD: math.unit(`${i.kD} ${kDUnitOptions[i.kDUnitIndex].value}`),
    foldExcess: 1,
    multipleTotalConcWV: i.concentrations.map((e) => math.unit(`${e} mg/mL`)),
  })
}

function App() {
  const [state, dispatchStateReducer] = useReducer(stateReducer, initialState)

  const output = compute(state)

  const tableRows = initialState.concentrations.map(
    (c, i): TableRow => {
      return {
        id: i,
        conc: c,
        percentPossibleAB: output[i].percentPossibleAB.toLocaleString(undefined, {
          maximumSignificantDigits: 4,
        }),
        percentParticlesAB: output[i].percentParticlesAB.toLocaleString(undefined, {
          maximumSignificantDigits: 4,
        }),
        percentParticlesA: output[i].percentParticlesA.toLocaleString(undefined, {
          maximumSignificantDigits: 4,
        }),
        percentParticlesB: output[i].percentParticlesB.toLocaleString(undefined, {
          maximumSignificantDigits: 4,
        }),
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
        <Col lg={6} className="mt-2">
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
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mt-2">
          <Card>
            <Card.Body>
              <BootstrapTable bootstrap4 keyField="id" data={tableRows} columns={tableColumns} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default App
