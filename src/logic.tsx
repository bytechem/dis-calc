import * as math from "mathjs"

interface IInputParamsSingle {
  mwExcessComponent: math.Unit
  mwLimitingComponent: math.Unit
  KD: math.Unit
  foldExcess: number
  totalConcWV: math.Unit
}

interface IInputParams {
  mwExcessComponent: math.Unit
  mwLimitingComponent: math.Unit
  KD: math.Unit
  foldExcess: number
  multipleTotalConcWV: math.Unit[]
}

interface IOutput {
  percentPossibleAB: number
  percentParticlesAB: number
  percentParticlesLimiting: number
  percentParticlesExcess: number
}

export function computeEquilibrium({multipleTotalConcWV, ...addtl}: IInputParams): IOutput[] {
  return multipleTotalConcWV.map((singleTotalConcWV) =>
    computeSingleEquilibrium({...addtl, totalConcWV: singleTotalConcWV}),
  )
}

export function computeSingleEquilibrium({
  mwExcessComponent,
  mwLimitingComponent,
  KD,
  foldExcess,
  totalConcWV,
}: IInputParamsSingle): IOutput {
  const concExcessComponentWV: math.Unit = math
    .chain(foldExcess)
    .multiply(totalConcWV)
    .multiply(mwExcessComponent)
    .divide(math.add(mwLimitingComponent, math.multiply(foldExcess, mwExcessComponent)))
    .done()
  const concLimitingComponentWV: math.Unit = math.subtract(
    totalConcWV,
    concExcessComponentWV,
  ) as math.Unit
  const concABInitialMolar: math.Unit = math.divide(concLimitingComponentWV, mwLimitingComponent)
  const concExcessInitialMolar: math.Unit = math.subtract(
    math.divide(concExcessComponentWV, mwExcessComponent),
    concABInitialMolar,
  ) as math.Unit

  const a = 1
  const b: math.Unit = math.add(concExcessInitialMolar, KD) as math.Unit
  const c = math.unaryMinus(math.multiply(concABInitialMolar, KD))

  const four_ac: math.Unit = math.chain(4).multiply(a).multiply(c).done()
  const square: math.Unit = math.subtract(math.square(b), four_ac) as math.Unit
  const numer: math.Unit = math.add(math.unaryMinus(b), math.sqrt(square)) as math.Unit
  const denom = math.multiply(2, a)

  const concLimitingFinalMolar: math.Unit = math.divide(numer, denom) as math.Unit

  const concABFinalMolar: math.Unit = math.subtract(
    concABInitialMolar,
    concLimitingFinalMolar,
  ) as math.Unit

  const concExcessFinalMolar: math.Unit = math.add(
    concExcessInitialMolar,
    concLimitingFinalMolar,
  ) as math.Unit

  const fractionPossibleAB: number = (math.divide(
    concABFinalMolar,
    concABInitialMolar,
  ) as unknown) as number

  const concAllParticles: math.Unit = math
    .chain(concABFinalMolar)
    .add(concLimitingFinalMolar)
    .add(concExcessFinalMolar)
    .done()
  const fractionParticlesAB: number = (math.divide(
    concABFinalMolar,
    concAllParticles,
  ) as unknown) as number
  const fractionParticlesLimiting: number = (math.divide(
    concLimitingFinalMolar,
    concAllParticles,
  ) as unknown) as number
  const fractionParticlesExcess: number = (math.divide(
    concExcessFinalMolar,
    concAllParticles,
  ) as unknown) as number

  return {
    percentPossibleAB: fractionPossibleAB * 100,
    percentParticlesAB: fractionParticlesAB * 100,
    percentParticlesLimiting: fractionParticlesLimiting * 100,
    percentParticlesExcess: fractionParticlesExcess * 100,
  }
}
