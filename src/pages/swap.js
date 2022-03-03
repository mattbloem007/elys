import spooky from "../images/spooky.png"
import {isMobile} from 'react-device-detect';

const SwapPage = (props) => {
    return (<div style={{
        display: 'block',
            width: isMobile?300:600,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 50,
            textAlign: 'center'
    }}>
        <div style={{fontWeight: 'bold'}}>If you wish to buy or sell ELYS you can swap FTM for ELYS at SpookySwap</div>
        <a href="https://spookyswap.finance/swap?inputCurrency=FTM&outputCurrency=0xd89cc0d2a28a769eadef50fff74ebc07405db9fc"
        style={{
            textDecoration: 'none',
            color: '#ffffff',
            display: 'block',
            marginTop: 20,
            fontSize: 20,
            fontWeight: 'bold'

        }}>ZooDEX ELYS-FTM</a>
        <img src={spooky} width={isMobile?300:600} alt="SpookySwap" style={{
            display: 'block',
            width: isMobile?300:600,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 30
        }}/>
    </div>)
}

export default SwapPage
