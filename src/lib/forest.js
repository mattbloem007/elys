import Contract from './contract'
import contractAddress from '../crypto/contractAddress'

/*
Some notes:

- I've tried to abstract most of the functonality with these functions

Possible Flow:
Releasing existing locks:
- check to see if the user has any locks:  lockTokensInfo()
    This returns a list of locks each with tokenId,amount,reward,daysLeft  (tokenId is an identifier for a specific lock - you will use that later)
    (I've converted to decimals by dividing by 1e5 fow amount and reward)
- if daysLeft==0 then the user is alowed to release their funds: release(tokenId)
- if daysLeft>0 then the user is allowed to emergency release: emergencyReleace(tokenId)
- A user can also transfer their lock to another user: transfer(tokenId, to)

Creating new locks:

- First you need to call approve to allow the lock factory contract to move ELYS on the user's behalf:
        approve(amount)     (I'm multiplying by 1e5 so you can just put the amount in wothout worrying about decimals)
- Once approved you can call lockElys(amount, lockDays, donation)      (donation is a percentage of the reward - so putting in 10 would mean 10% of the reward)
*/

const testAddresses = {
    elys: '0x52F1f3D2F38bdBe2377CDa0b0dbEB993DC242B98',
    forestFactory: '0xb052B700f6FAe29AeafcB893983269830c153c0d'
}

const wait = (tm) => new Promise(r=>setTimeout(()=>r(),tm))

const getNetwork = () => (window.ethereum.networkVersion === '250')?'main':(window.ethereum.networkVersion === '4002')?'test':'unknown'

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
    bal = bal/1e5
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
    console.log("account", getNetwork())
    console.log("Network ", window.ethereum.networkVersion)
    let bal = await elys.balanceOf([acc])
    return bal
}

const getTokenId = async () => {
    let factory = await getFactoryContract()
    let counter = await factory.tokenIdCounter()
    return parseInt(counter) + 1
}

const lockElys = async (amount, lockDays, donation) => {
    //check if amount is approved
    donation = donation || 0
    console.log("donation", donation)
    console.log("amount", amount)
    let acc = await getAccount()
    console.log("acc", acc)
    let elys = await getElysContract()
    console.log("elys", elys)
    let spender = getAddress('forestFactory')
    console.log("spender", spender)
    let approved = await elys.allowance([acc,spender])
    console.log("approved", approved)
    if(approved<amount*1e5) return {error: 'insufficient approval'}
    let tokenId = await getTokenId()
    console.log("tokenId", tokenId)
    let factory = await getFactoryContract()
    console.log("factory", factory, (amount*1e5), lockDays, donation, tokenId)
    try{
        await factory.lock([amount*1e5, lockDays, donation, tokenId])
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
    let info = await lock.lockInfo([tokenId])
    console.log("ii", info)
    let amount = info[0]
    let reward = info[1]
    let daysLeft = info[2]
  //I  let {amount,reward,daysLeft} = await lock.lockInfo([tokenId])

    return {tokenId,amount:amount/1e5,reward:reward/1e5,daysLeft}
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


//This function increases the number of days so you can test the lock release. For testnet only
const _inc = async (days) => {
    if(getNetwork()!=test){
        alert("This function is for testnet only")
        return
    }
    let lock = await getLock()
    try{
        await lock._inc([days])
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
    transfer, //transfers locked ELYS to another user
    _inc, //increases number of days to test release. For testnet only
    getElysBalance,
    getFactoryContract,
    getElysContract,
    getTokenId
};



export default $
