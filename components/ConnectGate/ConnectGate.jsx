import { useContext } from 'react'
import { VoterContext } from '../../context/Voter'
import Style from './ConnectGate.module.css'

export default function ConnectGate({ children }) {
  const { currentAccount, connectWallet } = useContext(VoterContext)

  if (currentAccount) {
    return children
  }

  return (
    <div className={Style.page}>
      <div className={Style.card}>
        <h1 className={Style.title}>Connect your wallet</h1>
        <p className={Style.message}>
          Please install MetaMask and connect. The page will reload after connecting.
        </p>
        <button type="button" className={Style.connect_btn} onClick={() => connectWallet()}>
          Connect Wallet
        </button>
      </div>
    </div>
  )
}
