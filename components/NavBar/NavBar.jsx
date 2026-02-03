import {useState, useEffect, useContext} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AiFillLock, AiFillUnlock } from 'react-icons/ai'

//-----INTERNAL IMPORT
import Style from './NavBar.module.css'
import images from '../../assets'
import {VoterContext} from '../../context/Voter'
import {Button} from '../Button/Button'
import {Input} from '../Input/Input'
import loading from '../../assets/loading.gif'

const NavBar = () => {
    const {connectWallet, currentAccount, error} = useContext(VoterContext)
    const [openNav, setOpenNav] = useState(true)
    const openNavigation = () => {
        if (openNav) {
            setOpenNav(false)
        } else {
            setOpenNav(true)
        }
    }

    return (
        <div className={Style.navBar}>
            {error === "" ? (
                ""
            ) : (
                <div className={Style.message__box}>
                    <div className={Style.message}>
                        <p>{error}</p>
                    </div>
                </div>
            )}
            <div className={Style.navbar_box}>
                <div className={Style.tittle}>
                    <Link href={{ pathname: "/" }}>
                        <Image src={loading} alt="logo" width={80} height={80} />
                    </Link>
                </div>
            </div>
            <div className={Style.connect}>
                {currentAccount ? (
                    <div>
                        <div className={Style.connect_left}>
                            <button onClick={() => openNavigation()}>
                                {currentAccount.slice(0, 10)}..
                            </button>
                            {currentAccount && (
                                <span>
                                    {openNav ? (
                                        <AiFillUnlock onClick={() => openNavigation()} />
                                    ) : (
                                        <AiFillLock onClick={() => openNavigation()} />
                                    )}
                                </span>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default NavBar;