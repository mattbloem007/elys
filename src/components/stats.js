import React, { Component } from 'react'
import Contract from '../lib/contract'
import contractAddress from '../crypto/contractAddress';
import TokenInfoBox from './tokeninfobox'
import Web3 from 'web3';
import forest from '../lib/forest'

window.forest = forest;
//const orange = '#ec7019'

const rpcEndpoint = 'https://rpc.ftm.tools/'


let trimDec = (n,dec) => {
    let ar = n.toString().split('.')
    if(ar.length===1) return ar[0]
    if(dec===0) return ar[0]
    ar[1] = ar[1].substr(0,dec)
    return ar.join('.')
}

let addCommas = (amnt) => {
    let ar = amnt.toString().split('').reverse()
    let cnt = 0
    let rslt = ''
    for(var i in ar){
        if(cnt===3){
            cnt=0
            rslt = ',' + rslt
        }
        rslt = ar[i] + rslt
        cnt++
    }
    return rslt
}

class Stats extends Component {
    state = {
        totalSupply: 0,
        totalLocked: 0,
        w3: null
    }
    loading = () => this.state.totalSupply===0 || this.props.price.loading
    wait = (tm) => {
        return new Promise(r=>{
            setTimeout(()=>r(),tm)
        })
    }
    getTotalElys = async () => {
        let provider = new Web3.providers.HttpProvider(rpcEndpoint)
        let w3 = new Web3(provider)
        this.setState({w3})
        let Token = new Contract('elys',contractAddress['elys'],w3)
        try{
            let totalSupply = await Token['totalSupply']()
            return totalSupply
        }
        catch(e){
            this.wait(200)
            return await this.getTotalElys()
        }
    }
    getLocked = async () => {
        let startDate = new Date('22 Aug 2021')
        let now = Date.now()
        let daysPassed = parseInt((now - startDate.getTime())/(24*3600*1000))

        let getLocked = (orig,days) => {
          let lcked = orig-(orig/days)*daysPassed
          if (lcked < 0) {
            return 0
          }
          else {
            return (orig-(orig/days)*daysPassed)
          }
        }

        let seedLocked = getLocked(1736266/100000,20)  //20 days
        let teamLocked = getLocked(700000/100000,100)  //100 days
        let foundationLocked = getLocked(10000000/100000,100)  //100 days


        console.log(seedLocked, teamLocked, foundationLocked)

        let land = (daysPassed<365)?10000000:0 //365 days

        return parseInt(seedLocked + teamLocked + foundationLocked + land)
    }
    componentDidMount = async () => {
        let totalSupply = await this.getTotalElys()
        let locked = null //await this.getLocked()
        let stats = null
        let totalLockedUSD = 0;
        if(this.state.w3) {
           stats = await forest.getStats(this.state.w3)
           totalLockedUSD = this.valueLocked(stats)
        }
        console.log("Supply, locked ", totalSupply,locked, totalLockedUSD)
        this.setState({totalSupply,locked, totalLocked: totalLockedUSD})
    }
    marketCap = () => {
        return addCommas(trimDec((this.state.totalSupply/100000)*this.props.price.usd,0))
    }
    valueLocked = (stats) => {
        return addCommas(trimDec(stats.totalLocked/1e5 * this.props.price.usd,0))

    }
    inCirculation = () => {
        return addCommas(this.state.totalSupply/100000 - this.state.locked)
    }
    render = () => {
      console.log("PROPS", this.props)
       if(this.loading())return null
        return (
            <div style={{maxWidth: 800, marginTop: 30, marginBottom: 30}}>
                <TokenInfoBox text={'$ ' +  this.state.totalLocked} label={'Total Value Locked'} />
                <TokenInfoBox text={'$ ' + this.marketCap()} label={'Market Cap'} />
                <TokenInfoBox text={this.inCirculation()} label={'Circulating ELYS'} />
            </div>
        )
    }

}

export default Stats
