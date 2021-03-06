import iboga from '../images/iboga-white-icon.png'

const orange = '#ec7019'
const cream = '#facbac'

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

let trimDec = (n,dec) => {
    let ar = n.toString().split('.')
    if(ar.length===1) return ar[0]
    if(dec===0) return ar[0]
    ar[1] = ar[1].substr(0,dec)
    return ar.join('.')
}

const Stats = (props) => {
    /*
            totalLocked: 0,
            totalRewards: 0,
            avgTimeLocked: 0,
            toClaim: 0,
            locksCreated: 0
    */
    let locks = (props.stats.totalLocked>1)?props.stats.locksCreated + ' locks currently active':'1 lock currently active'
    let statStyle={
        color: orange,
        textAlign: 'center',
        fontSize: 20,
        marginTop: 10
    }
    let infoStyle = Object.assign({},statStyle)
    infoStyle.fontSize = 13
    return (
        <div style={{border: 'solid 2px ' + orange, borderRadius: 20, marginTop: 20,display: 'block', width: '98%', verticalAlign: 'top', paddingBottom: 30, marginBottom: 20, position: 'relative'}}>
            <div style={{color: orange, fontWeight: 'bold', fontSize: 22, marginTop: 20, marginBottom: 20, textAlign: 'center'}}>
                <img src={iboga} alt="" width={40} />
                <div style={{display: 'inline-block', marginLeft: 15, marginRight: 15, position: 'relative', top: -11}}>Forest Stats</div>
                <img src={iboga} alt="" width={40} />
            </div>
            {
              props.statsUpdated ?
              <div>
                <div style={statStyle}>{locks}</div>
                <div style={statStyle}>{formatElys(trimDec(props.stats.totalLocked/1e5,1))} locked</div>
                <div style={statStyle}>{formatElys(trimDec(props.stats.totalRewards/1e5,1))} rewards pending</div>
                <div style={statStyle}>{formatElys(trimDec(props.stats.toClaim/1e5,1))} available to be earned</div>
                <div style={infoStyle}>If no rewards are available to be earned the forest will still be open for staking</div>
              </div>
              :
              <div>
                <div style={statStyle}>{locks}</div>
                <div style={statStyle}>Loading... locked</div>
                <div style={statStyle}>Loading... rewards pending</div>
                <div style={statStyle}>Loading... available to be earned</div>
                <div style={infoStyle}>If no rewards are available to be earned the forest will still be open for staking</div>
              </div>
            }

        </div>
    )
}

export default Stats
