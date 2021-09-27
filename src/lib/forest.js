import Contract from './contract'
import contractAddress from '../crypto/contractAddress'

const testAddresses = {
    elys: '0x52F1f3D2F38bdBe2377CDa0b0dbEB993DC242B98',
    forestFactory: '0x0625e767c4F36ECAfA577f6C66F0e5aF2AD8813D'
}

const wait = (tm) => new Promise(r=>setTimeout(()=>r(),tm))

const getNetwork = () => (window.ethereum.networkVersion!=='250')?'main':(window.ethereum.networkVersion=='4002')?'test':'unknown'

const getAddress = (nm) => (getNetwork()=='main')?contractAddress[nm]:(getNetwork()=='test')?testAddresses[nm]:null

const getElysContract = async () =>  new Contract('elys',getAddress('elys'))

const getFactoryContract = async () => new Contract('forestFactory',getAddress('forestFactory'))

let _lock = null

const getLock = async () => {
    if(_lock) return _lock
    let factory = await getFactoryContract()
    let lockAddress = await factory.lockNFT()
    _lock = new Contract('lockNFT',lockAddress)
    return _lock
}

const getReward = async (lockDays, amount) => {
    let factory = await getFactoryContract()
    return await factory.getReward([lockDays,amount * 1e5])
}

const approve = async (amount) => {
    let bal = await getElysBalance()
    if(bal<amount) return {error: 'insufficient ELYS'}
    let elys = await getElysContract()
    try{
        await elys.approve([getAddress('forestFactory'),amount*1e5])
    }
    catch(e){
        return {error: e.message}
    }
    await wait(20000)
    return {success: true}
}

const getAccount = async () => {
    let accs = await window.web3.eth.getAccounts();
    let acc = accs[0];
    return acc
}

const getElysBalance = async () => {
    let acc = await getAccount()
    let elys = await getElysContract()
    let bal = await elys.balanceOf([acc])
    return bal
}

const getTokenId = async () => {
    let factory = await getFactoryContract()
    let counter = await factory.tokenIdCounter()
    return counter + 1
}

const lockElys = async (amount, lockDays, donation) => {
    //check if amount is approved
    let acc = await getAccount()
    let elys = await getElysContract()
    let spender = getAddress('forestFactory')
    let approved = await elys.allowance([acc,spender])
    if(approved<amount*1e5) return {error: 'insufficient approval'}
    let tokenId = await getTokenId()
    let factory = await getFactoryContract()
    try{
        factory.lock(amount*1e5, lockDays, donation, tokenId)
    }
    catch(e){
        return {error: e.message}
    }
    await wait(20000)
    return {success: true}
}

const lockTokenIDs = async () => {
    let acc = await getAccount()
    let lock = await getLock()
    let num = await lock.balanceOf([acc])
    if(num===0) return []
    let ar = []
    for(let i=0;i<num;i++){
        let tokenId = await lock.tokenOfOwnerByIndex([acc,i])
        ar.push(tokenId)
    }
    return ar
}

const lockTokenInfo = async (tokenId) => {
    let lock = await getLock()
    let {amount,reward,daysLeft} = await lock.lockInfo([tokenId])
    return {amount,reward,daysLeft} 
}

const lockTokensInfo = async () => {
    let ar = await lockTokenIDs()
    let arInfo = []
    for(var i=0;i<ar.length;i++){
        let info = await lockTokenInfo(ar[i])
        arInfo.push(info)
    }
    return arInfo
}

const release = async (tokenId) => {
    let lock = await getLock()
    try{
        await lock.release([tokenId])
    }
    catch(e){
        return {error: e.message}
    }
    await wait(20000)
    return {success: true}
}

const emergencyRelease = async (tokenId) => {
    let lock = await getLock()
    try{
        await lock.emergencyRelease([tokenId])
    }
    catch(e){
        return {error: e.message}
    }
    await wait(20000)
    return {success: true}
}

const transfer = async (tokenId, to) => {
    let acc = await getAccount()
    let lock = await getLock()
    try{
        await lock.safeTransferFrom([acc,to,tokenId])
    }
    catch(e){
        return {error: e.message}
    }
    await wait(20000)
    return {success: true}
}

let $ = {
    getReward, //get's the reward based on amount and lockDays
    approve, //approve that the lockfactory can move user's Elys into the lock contract
    lockElys, //locks users Elys - amount, and lockdays
    lockTokenIDs, //gets a list of lock toeknId's for a user
    lockTokenInfo, //gets info about lock (amount, reward, days to release)
    lockTokensInfo, //gets info about all user's locks (amount, reward, days to release)
    release, //releases locked ELYS and reward after lock period is up
    emergencyRelease, //releases locked ELYS, but forfeits reward before lock period is up
    transfer //transfers locked ELYS to another user
}

export default $