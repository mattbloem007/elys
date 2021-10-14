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
    let locks = (props.stats.totalLocked==1)?props.stats.totalLocked + 'locks created':'1 lock created'
    let statStyle={
        color: orange,
        textAlign: 'center',
        fontSize: 15,
        marginTop: 10
    }
    let infoStyle = Object.assign({},statStyle)
    infoStyle.fontSize = 10
    return (
        <div style={{border: 'solid 2px ' + orange, borderRadius: 20, marginTop: 20,display: 'block', width: '98%', verticalAlign: 'top', paddingBottom: 30, marginBottom: 20, position: 'relative'}}>
            <div style={{color: orange, fontWeight: 'bold', fontSize: 20, marginTop: 20, marginBottom: 20, textAlign: 'center'}}>
                <img src={iboga} alt="" width={40} />
                <div style={{display: 'inline-block', marginLeft: 15, marginRight: 15, position: 'relative', top: -11}}>Forest Stats</div>
                <img src={iboga} alt="" width={40} />
            </div>
            <div style={statStyle}>{locks}</div>
            <div style={statStyle}>{formatElys(trimDec(props.stats.totalLocked/1e5,3))} locked in the Forest</div>
            <div style={statStyle}>{formatElys(trimDec(props.stats.totalRewards/1e5,3))} earned as rewards</div>
            <div style={statStyle}>{formatElys(trimDec(props.stats.toClaim/1e5,3))} available to be claimed</div>
            <div style={infoStyle}>If no rewards are available to be claimed the forest will still be open for staking</div>
        </div>
    )
}

export default Stats