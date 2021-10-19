
import forest from '../lib/forest'
import React from 'react'
import ForestClaim from '../components/forestclaim'
import ForestLock from '../components/forestlock'
import ForestStats from '../components/foreststats'
import {isMobile} from 'react-device-detect';

const initialAmount = 1000000

const orange = '#ec7019'

window.forest = forest;



/*
let Locked = (props) => {
    let style={textAlign: 'center', color: orange, fontWeight: 'bold', fontSize: 18, margin: 15}
    if(props.amountLeft===-1) return (<div style={style}>loading..</div>)
    let amnt = formatElys(trimDec((initialAmount*1e5-props.amountLeft)/1e5,3))
    return (<div style={style}>{amnt} locked in the Forest</div>)
}
*/

class Forest extends React.Component {
    state = {
        amountLeft: -1,
        balance: -1,
        lockAmount: 0.0,
        duration: '6 months',
        apr: 0,
        reward: 0,
        donation: '1% of rewards',
        donationAmount: 1,
        approval: 0,
        lockDays: 0,
        lockInfo: {
            amount: 0,
            lockDays: 0,
            donation: 0
        },
        lockTokensInfo: null,
        stats: {
            totalLocked: 0,
            totalRewards: 0,
            avgTimeLocked: 0,
            toClaim: 0,
            locksCreated: 0
        },
        loadingLockTokens: true
    }
   
    getInfo = async () => {
        let amountLeft = await forest.getLeft()
        let balance = await forest.getElysBalance()
        let stats = await forest.getStats()
        this.setState({stats,amountLeft,balance,lockAmount:0,approval: 0, reward: 0, apr: 0})
        let lockTokensInfo = await forest.lockTokensInfo()
        console.log(lockTokensInfo)
        this.setState({stats,amountLeft,balance,lockAmount:0,approval: 0, reward: 0, apr: 0,lockTokensInfo,loadingLockTokens:false})
    }

    calculateAPR = async (duration,amount) => {
        let balance = await forest.getElysBalance()
        duration = duration || this.state.duration
        amount = amount || this.state.lockAmount
        let lockDays = 0
        let perc = 0
        switch(duration){
            case '7 days':
                perc = 4
                lockDays = 7
                break
            case '14 days':
                perc = 5
                lockDays = 14
                break
            case  '28 days':
                perc = 6
                lockDays = 28
                break
            case '3 months':
                perc = 9
                lockDays = 3*28
                break
            case '6 months':
                perc = 12
                lockDays = 6*28
                break
            case '9 months':
                perc = 15
                lockDays = 9*28
                break
            case '1 year':
                perc = 20
                lockDays = 365
                break
            case '2 years':
                perc = 23
                lockDays = 2 * 365
                break
            case '3 years':
                perc = 26
                lockDays = 3 * 365
                break
            default:
                perc = 12
                lockDays = 6*28
                break
        }
        let reward =  amount*perc*lockDays/36500
        if(reward>this.state.amountLeft/1e5)reward=this.state.amountLeft/1e5
        this.setState({duration: duration, apr: perc, reward, lockAmount: amount, lockDays, balance: balance - amount})
    }
    componentDidMount = async () => {
        this.calculateAPR()
        await this.getInfo()
    }

    lockAmountChanged = (e) => {
        console.log('val:' + e.target.value)
        let val = e.target.value.split(/[^0-9,.]/g).join('')
        if(this.state.approval===0){
            if(val==='0'){
                return this.setState({lockAmount: val})
            }
            if(e.target.value===''){
                return this.setState({lockAmount: val})
            }
            if(e.target.value.endsWith('.')){
                return this.setState({lockAmount: val})
            }
            this.calculateAPR(this.state.duration,parseFloat(val))
        } 
    }

    durationChanged = (duration) => {
        if(this.state.approval===0){
            this.calculateAPR(duration)
        } 
    }

    donationChange = (donation) => {
        donation = donation || this.state.donation
        let donationAmount = 0
        switch(donation){
            case '1% of rewards':
                donationAmount = 1
            break
            case '3% od rewards':
                donationAmount = 3
            break
            case '5% of rewards':
                donationAmount = 5
            break
            default: 
                donationAmount = 1
            break
        }
        if(this.state.approval===0){
            this.setState({donation,donationAmount})
        }
    }

    approve = async () => {
        
        let lock = {
            amount: this.state.lockAmount,
            lockDays: this.state.lockDays,
            donation: this.state.donationAmount
        }
        this.setState({
            lockInfo: lock,
            approval: 1
        })
        try{
            await forest.approve(this.state.lockAmount)
            this.setState({approval: 2})
        }
        catch(e){
            this.setState({approval: 0})
        }
        
    }

    lock = async () => {
        let lock = this.state.lockInfo
        try{
            this.setState({approval: 3})
            await forest.lockElys(lock.amount,lock.lockDays,lock.donation)
            await this.getInfo()
        }
        catch(e){
            console.log(e)
            this.setState({approval: 0})
        }
    }

    claimUpdate = async () => {
        console.log('getting lock tokens')
        let lockTokensInfo = await forest.lockTokensInfo()
        console.log(lockTokensInfo)
        this.setState({lockTokensInfo})
        let amountLeft = await forest.getLeft()
        let balance = await forest.getElysBalance()
        let stats = await forest.getStats()
        this.setState({stats,amountLeft,balance})
    }
    
    render = () => {
        //<Locked amountLeft={this.state.amountLeft}/>
        return (
            <div style={{display: 'block', width: (isMobile)?350:550, borderRadius: 20, marginLeft: 'auto', marginRight: 'auto', marginTop: 40, marginBottom: 20}}>
                <ForestStats stats={this.state.stats} />
                <ForestLock  
                balance={this.state.balance} 
                lockAmountChange={this.lockAmountChanged} 
                lockAmount={this.state.lockAmount} 
                current={this.state.duration}
                selectDuration={this.durationChanged}
                duration={this.state.duration}
                apr={this.state.apr}
                reward={this.state.reward}
                donation={this.state.donation}
                donationChange={this.donationChange}
                approval={this.state.approval}
                approve={this.approve}
                lock={this.lock}
                />
                <ForestClaim loadingLockTokens={this.state.loadingLockTokens} lockTokensInfo={this.state.lockTokensInfo} claimUpdate={this.claimUpdate}/>
            </div>
        )
    }
}

export default Forest