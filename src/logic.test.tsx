import * as math from 'mathjs'
import { computeSingleEquilibrium, computeEquilibrium } from './logic'
import { zip } from 'lodash'

it.each(
  [
    [
      "case A",
      {
        mwExcessComponent: math.unit(150, 'kg/mol'),
        mwLimitingComponent: math.unit(50, 'kg/mol'),
        KD: math.unit(10, 'nmol/L'),
        foldExcess: 1,
        multipleTotalConcWV: [math.unit(0.05, 'mg/mL')],
      },
      [
        {
          percentPossibleAB: 81.9,
          percentParticlesAB: 69.3,
          percentParticlesA: 15.3,
          percentParticlesB: 15.3,
        }
      ]
    ]
  ]
)('computes multiple concentration equlibrium for %s', (name, input, expected) => {
  const rvs = computeEquilibrium(input)
  expect(rvs.length).toEqual(expected.length)
  for (const [rv, expectedSingle] of zip(rvs, expected)) {
    expect(rv!.percentPossibleAB).toBeCloseTo(expectedSingle!.percentPossibleAB, 1)
    expect(rv!.percentParticlesAB).toBeCloseTo(expectedSingle!.percentParticlesAB, 1)
    expect(rv!.percentParticlesA).toBeCloseTo(expectedSingle!.percentParticlesA, 1)
    expect(rv!.percentParticlesB).toBeCloseTo(expectedSingle!.percentParticlesB, 1)
  }
})

it.each(
  [
    [
      "case A",
      {
        mwExcessComponent: math.unit(150, 'kg/mol'),
        mwLimitingComponent: math.unit(50, 'kg/mol'),
        KD: math.unit(10, 'nmol/L'),
        foldExcess: 1,
        totalConcWV: math.unit(0.05, 'mg/mL'),
      },
      {
        percentPossibleAB: 81.9,
        percentParticlesAB: 69.3,
        percentParticlesA: 15.3,
        percentParticlesB: 15.3,
      }
    ]
  ]
)('computes single equlibrium for %s', (name, input, expected) => {
  const rv = computeSingleEquilibrium(input)
  expect(rv.percentPossibleAB).toBeCloseTo(expected.percentPossibleAB, 1)
  expect(rv.percentParticlesAB).toBeCloseTo(expected.percentParticlesAB, 1)
  expect(rv.percentParticlesA).toBeCloseTo(expected.percentParticlesA, 1)
  expect(rv.percentParticlesB).toBeCloseTo(expected.percentParticlesB, 1)
})

it('computes with units here', () => {
  const inputs = {
    mwExcessComponent: math.unit(200, 'kg/mol'),
    mwLimitingComponent: math.unit(100, 'kg/mol'),
    KD: math.unit(1, 'nmol/L'),
    foldExcess: 1,
    totalConcWV: math.unit(100, 'mg/mL'),
  }
  const i1: Unit = math.multiply(inputs.foldExcess, inputs.totalConcWV)
  const i2: Unit = math.multiply(i1, inputs.mwExcessComponent)
  const i3: Unit = math.multiply(inputs.foldExcess, inputs.mwExcessComponent)
  const i4: Unit = math.add(inputs.mwLimitingComponent, i3)
  const concExcessComponentWV: Unit = math.divide(i2, i4)
  const concLimitingComponentWV: Unit = math.subtract(inputs.totalConcWV, concExcessComponentWV)
  expect(concExcessComponentWV.toNumber('mg/mL')).toBeCloseTo(66.67, 2)
  expect(concLimitingComponentWV.toNumber('mg/mL')).toBeCloseTo(33.33, 2)
})

it('works', () => {
  const a = math.unit('0.1 m')
  const b = math.unit(45, 'cm')
  const c = math.add(a, b)
  expect(c.toNumber('mm')).toEqual(550)
})