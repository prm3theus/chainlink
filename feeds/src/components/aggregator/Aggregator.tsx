import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { FeedConfig } from 'config'
import { aggregatorOperations } from 'state/ducks/aggregator'
import { AggregatorVis } from 'components/aggregatorVis'
import { AnswerHistory } from 'components/answerHistory'
import { DeviationHistory } from 'components/deviationHistory'
import { OracleTable } from 'components/oracleTable'

interface OwnProps {
  config: FeedConfig
}

interface DispatchProps {
  initContract: any
  clearState: any
}

interface Props extends OwnProps, DispatchProps {}

const Aggregator: React.FC<Props> = ({ initContract, clearState, config }) => {
  useEffect(() => {
    initContract(config).catch(() => {
      console.error('Could not initiate contract')
    })
    return () => {
      clearState()
    }
  }, [initContract, clearState, config])

  return (
    <>
      <AggregatorVis config={config} />
      {config.history && <AnswerHistory config={config} />}
      {config.history && <DeviationHistory config={config} />}
      <OracleTable />
    </>
  )
}

const mapDispatchToProps = {
  initContract: aggregatorOperations.initContract,
  clearState: aggregatorOperations.clearState,
}

export default connect(null, mapDispatchToProps)(Aggregator)