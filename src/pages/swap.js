import spooky from "../images/beethoven.png"
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
        <div style={{fontWeight: 'bold'}}>If you wish to buy or sell ELYS you can swap FTM for ELYS at Beethoven-X</div>
        <a href="https://beets.fi/"
        style={{
            textDecoration: 'underline',
            color: '#ffffff',
            display: 'block',
            marginTop: 20,
            fontSize: 20,
            fontWeight: 'bold'

        }}>Beethoven-X ELYS-FTM</a>
        <a target="_blank" href="https://beets.fi/">
          <img src={spooky}  width={isMobile?300:600} alt="Beethoven-X" style={{
              display: 'block',
              width: isMobile?300:600,
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 30,
              cursor: 'pointer'
          }}/>
        </a>
    </div>)
}

export default SwapPage
