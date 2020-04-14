import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { connect, MapStateToProps } from 'react-redux'
import { FeedConfig } from 'config'
import { Header } from 'components/header'
import { Aggregator } from 'components/aggregator'
import { AppState } from 'state'
import { Networks } from '../utils'

interface OwnProps {
  match: {
    params: {
      pair: string
      network?: string
    }
  }
}

interface StateProps {
  config?: FeedConfig
}

interface DispatchProps {}

interface Props extends StateProps, DispatchProps, OwnProps {}

const Page: React.FC<Props> = ({ config }) => {
  const [loaded, setLoaded] = useState<boolean>(false)
  let content

  useEffect(() => {
    setLoaded(true)
  }, [loaded, setLoaded])

  if (config) {
    content = <Aggregator config={config} />
  } else if (loaded) {
    content = <Redirect to="/" />
  } else {
    content = <>Loading Feed...</>
  }

  return (
    <>
      <div className="page-container-full-width">
        <Header />
      </div>
      <div className="page-wrapper network-page">{content}</div>
    </>
  )
}

function selectFeedConfig(
  { feeds }: AppState,
  pair: string,
  networkId: Networks,
): FeedConfig | undefined {
  const pairNetwork = feeds.pairPaths.find(
    ([p, n, _c]) => p === pair && n === networkId,
  )
  const contractAddress: FeedConfig['contractAddress'] | undefined =
    pairNetwork && pairNetwork[2]

  if (contractAddress) {
    return feeds.items[contractAddress]
  }

  return undefined
}

const NetworkPaths: Record<string, Networks> = {
  ropsten: Networks.ROPSTEN,
}

function networkFromPath(network?: string): Networks {
  return (network && NetworkPaths[network]) || Networks.MAINNET
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (
  state,
  ownProps,
) => {
  const pair = ownProps.match.params.pair
  const networkId = networkFromPath(ownProps.match.params.network)
  const config = selectFeedConfig(state, pair, networkId)

  return {
    config,
  }
}

export default connect(mapStateToProps)(Page)