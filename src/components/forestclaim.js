import forest from '../lib/forest'
import React , { useState } from 'react'
import iboga from '../images/iboga-white-icon.png'
import {isMobile} from 'react-device-detect';

const orange = '#ec7019'
const cream = '#facbac'




let trimDec = (n,dec) => {
    let ar = n.toString().split('.')
    if(ar.length===1) return ar[0]
    if(dec===0) return ar[0]
    ar[1] = ar[1].substr(0,dec)
    return ar.join('.')
}

let formatElys = (s) => {
    let splitDec = s.split('.')
    console.log('left: ' + splitDec[0])
    let ar = []
    let cnt = 0
    splitDec[0].split('').reverse().forEach(s=>{
        if(ar[cnt] && ar[cnt].length===3)cnt++
        if(!ar[cnt])ar[cnt] = ''
        ar[cnt] = s + ar[cnt]
    })
    console.log(ar)
    let front = ar.reverse().join(',')
    let back = (splitDec.length>1)?'.' + splitDec[1]:''
    return front + back + ' ELYS'

   //return s + ' ELYS'
}

let formatDate = (dt) => {
    //let monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    let day = dt.getDate()
    let month = (dt.getMonth()+1).toString()
    if(month.length===1)month = '0' + month
    let year = dt.getFullYear().toString().substr(2)
    return day + '-' + month + '-' + year
}

let Lock = (props) => {
    /*
    amount: 10000
    daysLeft: "7"
    reward: 6.90411
    tokenId: "1"
    atsrtDate:
    */
   let created = new Date(parseInt(props.startDate)*1000)
   let style={
       display: 'inline-block',
       width: 70,
       color: '#ffffff',
       fontWeight: 'bold',
       marginLeft: 20
    }
    let styleAmount = Object.assign({},style)
    styleAmount.width = 125

    let styleButton = Object.assign({},style)
    if(isMobile){
        styleButton.display = 'block'
        styleButton.marginLeft = 'auto'
        styleButton.marginRight = 'auto'
        styleButton.marginTop = 10
        styleButton.marginBottom = 20
    } else {
        styleButton.marginLeft = 40
    }

    let styleLeft = Object.assign({},style)
    styleLeft.width = 65

    let daysLeft = (props.daysLeft>0)?props.daysLeft.toString():'Now'
    if(daysLeft!=='Now') daysLeft += ' day'
    if(props.daysLeft>1) daysLeft += 's'

    let button = (props.daysLeft>0)?(
        <button style={{
            width: 115,
            backgroundColor: cream,
            border: 'none',
            borderRadius: 20,
            height: 25,
            color: '#000000',
            fontWeight: 'bold',
            fontSize: 19,
            marginRight: 20
        }} onClick={()=>props.transfer(props.tokenId)}>{(props.tokenId===props.transferring)?'TRANSFERRING..':'TRANSFER'}</button>
    ):(
        <button style={{
            width: 115,
            backgroundColor: orange,
            border: 'none',
            borderRadius: 20,
            height: 25,
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: 12,
            marginRight: 20
        }} onClick={async ()=>{
            if(props.claiming>-1) return
            await props.claim(props.tokenId)
        }}>{(props.tokenId===props.claiming)?'CLAIMING..':'CLAIM'}</button>
    )
    /*
        {formatElys(trimDec(parseFloat(props.amount) + parseFloat(props.reward),3))}
    */
    return (
            <div style={{marginTop: 10}}>
                <div style={style}>{formatDate(created)}</div>
                <div style={styleAmount}>{formatElys(trimDec(parseFloat(props.amount) + parseFloat(props.reward),1))}</div>
                <div style={styleLeft}>{daysLeft}</div>
                <div style={styleButton}>{button}</div>
            </div>
    )
}

let Transfer = (props) => {
    let [address, setAddress] = useState(null);
    let [transferring, setTransferring] = useState(false)
    let [err,setErr] = useState(false)
    let monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    let lock = props.locks.find(l=>l.tokenId===props.tokenId)
    let dt = new Date(parseInt(lock.startDate)*1000)
    let month = monthNames[dt.getMonth()]
    let year = dt.getFullYear().toString()
    let lockedOn = 'Locked on ' + dt.getDate() + ' ' + month + ' ' + year
    let disabled = (!address||transferring)
    let showErr=(err)?<div style={{color:'#ff0000',fontSize:13, textAlign: 'center'}}>You can't transfer to your own address</div>:null
    return (<div style={{
        display: 'block', width: 250, marginLeft: 'auto', marginRight: 'auto', marginTop: 20
    }}>
        <div style={{color: orange, fontWeight: 'bold', fontSize: 22, marginTop: 20, marginBottom: 20, textAlign: 'center'}}>
            <img src={iboga} alt="" width={40} />
            <div style={{display: 'inline-block', marginLeft: 15, marginRight: 15, position: 'relative', top: -11}}>Transfer</div>
            <img src={iboga} alt="" width={40} />
        </div>
        <div style={{textAlign: 'center'}}>{formatElys(trimDec(parseFloat(lock.amount) + parseFloat(lock.reward),1))}</div>
        <div style={{textAlign: 'center', marginTop: 7}}>{lockedOn}</div>
        <div style={{color: orange, textAlign: 'center', marginTop: 10}}>Address to transfer to:</div>
        <div style={{textAlign: 'center'}}>
            <input type={'text'} onChange={async (e)=>{
                let acc = await forest.getAccount()
                if(acc===e.target.value){
                    setErr(true)
                    return
                }
                setErr(false)
                if(window.web3.utils.isAddress(e.target.value))setAddress(e.target.value)
            }} style={{
                border: 'solid 1px ' + orange,
                backgroundColor: cream,
                borderRadius: 10,
                height: 20,
                padding: 3,
                width: 245,
                paddingLeft: 10,
                outline: 'transparent',
                marginTop: 5,
                fontSize: 10
            }}  spellCheck="false"/>
        </div>
        {showErr}
        <div style={{textAlign: 'center'}}><button disabled={disabled} style={{
            width: 115,
            backgroundColor: cream,
            border: 'none',
            borderRadius: 20,
            height: 25,
            color: '#000000',
            fontWeight: 'bold',
            fontSize: 12,
            opacity: disabled?0.5:1,
            marginTop: 10,
            marginBottom: 30
        }} onClick={()=>{
            setTransferring(true)
            props.transfer(address,props.tokenId)
        }}>{transferring?'TRANSFERRING..':'TRANSFER'}</button></div>
    </div>)
}

class ForestClaim extends React.Component {
    state = {
        transferring: -1,
        claiming: -1,
        transferTo: null
    }
    transferSelect = async (tokenId) => {
        if(this.state.transferring>-1)return
        this.setState({transferring:tokenId})
    }
    claim = async (tokenId) => {
        this.setState({claiming: tokenId})
        try{
            await forest.release(tokenId)
            this.setState({transferring:-1})
            await this.props.claimUpdate()
        }
        catch(e){
            console.log(e)
            this.setState({claiming:-1})
        }
    }
    transfer = async (to, tokenId) => {

        try{
            await forest.transfer(tokenId,to)
            this.setState({transferring:-1})
            await this.props.claimUpdate()
        }
        catch(e){
            console.log(e)
            this.setState({transferring:-1})
        }

    }
    render = () => {

        let arClaims = (this.props.lockTokensInfo)?this.props.lockTokensInfo.map(lock=>(
            <Lock key={lock.tokenId} {...lock} claim={this.claim} transfer={this.transferSelect} claiming={this.state.claiming} transferring={this.state.transferring}/>
        )):[]

       let claims = (this.props.loadingLockTokens)?(<div style={{textAlign: 'center', marginTp: 20, marginBottom: 20}}>loading...</div>):(arClaims.length>0)?(
        <div style={{ maxWidth: 500, overflow: 'scroll', marginBottom: 20, marginLeft: (isMobile)?0:20 }}>
            <div style={{color: orange, fontSize: 21}}>
                <div style={{display: 'inline-block', width: 60, color: orange, fontWeight: 'bold', marginLeft: 20}}>Created</div>
                <div style={{display: 'inline-block', width: 120, color: orange, fontWeight: 'bold', marginLeft: 33}}>Amount</div>
                <div style={{display: 'inline-block', width: 95, color: orange, fontWeight: 'bold', marginLeft: 20}}>Claim in</div>
            </div>
            {arClaims}
        </div>
       ):(<div style={{marginTop: 20, textAlign: 'center', marginBottom: 35}}>You have no locked ELYS</div>)

       let transfer = (this.state.transferring>-1)?(
           <Transfer tokenId={this.state.transferring} locks={this.props.lockTokensInfo} transfer={this.transfer} to={this.state.transferTo}/>
       ):null
        return (
        <div style={{border: 'solid 2px ' + orange, borderRadius: 20, marginTop: 20,display: 'block', width: '98%', verticalAlign: 'top', position: 'relative'}}>
            <div style={{color: orange, fontWeight: 'bold', fontSize: 22, marginTop: 20, marginBottom: 20, textAlign: 'center'}}>
                <img src={iboga} alt="" width={40} />
                <div style={{display: 'inline-block', marginLeft: 15, marginRight: 15, position: 'relative', top: -11}}>My Staked ELYS</div>
                <img src={iboga} alt="" width={40} />
            </div>

            {claims}
            {transfer}
        </div>)
    }
}

export default ForestClaim
