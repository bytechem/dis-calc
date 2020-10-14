import * as math from "mathjs"
import {computeSingleEquilibrium, computeEquilibrium} from "./logic"
import {zip} from "lodash"

it.each([
  [
    "case A",
    {
      mwExcessComponent: math.unit(50, "kg/mol"),
      mwLimitingComponent: math.unit(150, "kg/mol"),
      KD: math.unit(10, "nmol/L"),
      foldExcess: 1,
      multipleTotalConcWV: [0.05, 0.04, 0.01, 0.004].map((c) => math.unit(c, "mg/mL")),
    },
    [
      {
        percentPossibleAB: 81.9,
        percentParticlesAB: 69.3,
        percentParticlesLimiting: 15.3,
        percentParticlesExcess: 15.3,
      },
      {
        percentPossibleAB: 80,
        percentParticlesAB: 66.7,
        percentParticlesLimiting: 16.7,
        percentParticlesExcess: 16.7,
      },
      {
        percentPossibleAB: 64.2,
        percentParticlesAB: 47.2,
        percentParticlesLimiting: 26.4,
        percentParticlesExcess: 26.4,
      },
      {
        percentPossibleAB: 50.0,
        percentParticlesAB: 33.3,
        percentParticlesLimiting: 33.3,
        percentParticlesExcess: 33.3,
      },
    ],
  ],
])("computes multiple concentration equlibrium for %s", (name, input, expected) => {
  const rvs = computeEquilibrium(input)
  expect(rvs.length).toEqual(expected.length)
  for (const [rv, expectedSingle] of zip(rvs, expected)) {
    expect(rv!.percentPossibleAB).toBeCloseTo(expectedSingle!.percentPossibleAB, 1)
    expect(rv!.percentParticlesAB).toBeCloseTo(expectedSingle!.percentParticlesAB, 1)
    expect(rv!.percentParticlesLimiting).toBeCloseTo(expectedSingle!.percentParticlesLimiting, 1)
    expect(rv!.percentParticlesExcess).toBeCloseTo(expectedSingle!.percentParticlesExcess, 1)
  }
})

it.each([
  [
    "case A",
    {
      mwExcessComponent: math.unit(50, "kg/mol"),
      mwLimitingComponent: math.unit(150, "kg/mol"),
      KD: math.unit(10, "nmol/L"),
      foldExcess: 1,
      totalConcWV: math.unit(0.05, "mg/mL"),
    },
    {
      percentPossibleAB: 81.9,
      percentParticlesAB: 69.3,
      percentParticlesLimiting: 15.3,
      percentParticlesExcess: 15.3,
    },
  ],
  [
    "case B",
    {
      mwExcessComponent: math.unit(50, "kg/mol"),
      mwLimitingComponent: math.unit(150, "kg/mol"),
      KD: math.unit(10, "nmol/L"),
      foldExcess: 2,
      totalConcWV: math.unit(0.05, "mg/mL"),
    },
    {
      percentPossibleAB: 95.4,
      percentParticlesAB: 46.7,
      percentParticlesLimiting: 2.2,
      percentParticlesExcess: 51.1,
    },
  ],
  [
    "case C",
    {
      mwExcessComponent: math.unit(500, "g/mol"),
      mwLimitingComponent: math.unit(150, "kg/mol"),
      KD: math.unit(10, "nmol/L"),
      foldExcess: 11,
      totalConcWV: math.unit(0.05, "mg/mL"),
    },
    {
      percentPossibleAB: 99.7,
      percentParticlesAB: 9.1,
      percentParticlesLimiting: 0,
      percentParticlesExcess: 90.9,
    },
  ],
])("computes single equlibrium for %s", (name, input, expected) => {
  const rv = computeSingleEquilibrium(input)
  expect(rv.percentPossibleAB).toBeCloseTo(expected.percentPossibleAB, 1)
  expect(rv.percentParticlesAB).toBeCloseTo(expected.percentParticlesAB, 1)
  expect(rv.percentParticlesLimiting).toBeCloseTo(expected.percentParticlesLimiting, 1)
  expect(rv.percentParticlesExcess).toBeCloseTo(expected.percentParticlesExcess, 1)
})

it("works", () => {
  const a = math.unit("0.1 m")
  const b = math.unit(45, "cm")
  const c = math.add(a, b) as math.Unit
  expect(c.toNumber("mm")).toEqual(550)
})
