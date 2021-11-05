
import abi from '../crypto/abi';

class Contract {
    _getAcc = async () => {
        //let accs = await this.w3.eth.getAccounts()
        await window.ethereum.enable()
        const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
        let acc = accs[0];
        return acc;
    }

    _getBal = async () => {
        let address = await this._getAcc();
        return await this.w3.eth.getBalance(address);
    }

    constructor(contractName, address, w3) {
        this.w3 = w3 || window.web3;
        this.abi = abi[contractName];
        this.address = address;
        this._contract = new this.w3.eth.Contract(this.abi,this.address);
        this.methods = [];
            console.log("ADDRESS: ", this.address, this._contract)
        this.abi.forEach(async method => {
            if(method.name===undefined) return;
            this[method.name] = async (params,value) => {
                let _method = method.name;
                let _acc = await this._getAcc();
                if(params===undefined) params=[];
                if( params.length!==method.inputs.length) throw new Error("Incorrect number of parameters");
                let func = await this._contract.methods[_method](...params);
                let options = {from:_acc}; 
                if(method.stateMutability==="payable"){
                    if(value===undefined || value===0) throw new Error("value needs to be set for payable methods");
                    options.value = value;
                }
                if(method.stateMutability==="view"){
                    let res = await func.call(options);
                    return res;
                } else {
                    options.gasPrice = await this.w3.eth.getGasPrice();
                    let gasEstOptions = {from: options.from, gasPrice: options.gasPrice}
                    if(value>0) gasEstOptions.value = value
                    try{
                        options.gas =  await func.estimateGas(gasEstOptions)
                    }
                    catch(e){
                        console.log(e)
                        options.gas = 2000000
                    }
                    console.log(options)
                    let res = await func.send(options);
                    return res;
                }
            }
        });
    }
}

export default Contract;
