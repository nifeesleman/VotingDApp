import { useState, useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AiFillLock, AiFillUnlock } from 'react-icons/ai'

import Style from './NavBar.module.css'
import { VoterContext } from '../../context/Voter'
import loading from '../../assets/loading.gif'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/allowed-voters', label: 'Allowed Voters' },
  { href: '/candidate-registration', label: 'Candidate Registration' },
  { href: '/voterList', label: 'Voter List' },
]

const NavBar = () => {
  const { connectWallet, currentAccount, error } = useContext(VoterContext)
  const [navOpen, setNavOpen] = useState(false)

  const toggleNav = () => setNavOpen((o) => !o)

  if (!currentAccount) return null

  return (
    <header className={Style.navBar}>
      {error !== '' && error !== 'No Account Found' && (
        <div className={Style.message__box} role="alert">
          <div className={Style.message}>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className={Style.navBar_row}>
        <Link href="/" className={Style.logo} aria-label="Home">
          <Image src={loading} alt="" width={72} height={72} className={Style.logo_img} unoptimized />
        </Link>
        <div className={Style.nav_end}>
          {currentAccount ? (
            <div className={Style.wallet_wrapper}>
              <button
                type="button"
                className={Style.wallet_btn}
                onClick={toggleNav}
                aria-expanded={navOpen}
                aria-haspopup="true"
                aria-label={navOpen ? 'Close menu' : 'Open menu'}
              >
                <span className={Style.wallet_address}>{currentAccount.slice(0, 10)}..</span>
                <span className={Style.lock_icon} aria-hidden>
                  {navOpen ? <AiFillUnlock /> : <AiFillLock />}
                </span>
              </button>
              {navOpen && (
                <nav className={Style.nav_dropdown} aria-label="Navigation">
                  {NAV_LINKS.map(({ href, label }) => (
                    <Link key={href} href={href} className={Style.nav_dropdown_link} onClick={toggleNav}>
                      {label}
                    </Link>
                  ))}
                </nav>
              )}
            </div>
          ) : (
            <button type="button" className={Style.connect_btn} onClick={() => connectWallet()}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default NavBar
