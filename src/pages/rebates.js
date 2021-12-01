
import React from 'react'
import {isMobile} from 'react-device-detect';
import styled from "styled-components"
import { Formik, Field, Form, ErrorMessage } from "formik"
import { Container, Section } from "../global"
import Web3 from "web3";
import addresses from '../crypto/contractAddress'
import abi from '../crypto/abi'
import axios from 'axios'

const rpcEndpoint = 'https://xapi.testnet.fantom.network/lachesis' //'https://rpc.ftm.tools/'
const api = 'https://api-testnet.ftmscan.com/api'

const web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint));
const RebateContract = new web3.eth.Contract(abi.rebate, addresses.rebate);
const APIKey = 'P4TFDSVTPA75K86MTCQXTGXGN2Z7H7H9BU'
const elysAddress = '0x52F1f3D2F38bdBe2377CDa0b0dbEB993DC242B98'

web3.eth.defaultAccount = web3.eth.accounts[0];

class Rebates extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      rebateData: [],
      claimData: []
    }
  }

  componentWillMount = async () =>{
    let accs = await web3.eth.getAccounts();
    let acc = accs[0];
    //console.log(acc)
    this.getData("0xaA11a1ee6a4076a06B9753742F86f831aB6B107C")
    .then(() => console.log(this.state))
  }

  formatDate = (dt) => {
      let day = dt.getDate()
      let month = (dt.getMonth()+1).toString()
      if(month.length===1)month = '0' + month
      let year = dt.getFullYear().toString().substr(2)
      return day + '-' + month + '-' + year
  }

  getData = async (spender) => {
   let url = api + '?module=account&action=tokentx&contractaddress=' + elysAddress +  '&offset=1&page=1&sort=desc&apikey=' + APIKey
   let result = await axios.get(url)
   let data = result.data
   console.log(data)
   let purchaseDate = new Date(parseInt(data.result[0].timeStamp)*1000)
   purchaseDate = this.formatDate(purchaseDate)


   let numClaims = await RebateContract.methods
     .getNumClaims(spender)
     .call()

    let claimArr = [];
    let rebateArr = [];
    for (let i = 0; i < numClaims; i++) {
      let claim = await RebateContract.methods
        .getClaim(spender, i)
        .call()
        let claimed = parseInt(claim[1])/1e5
        if (claim[1] == "0") {
          claimed = "claimed"
        }


        if (!claim.claimed) {
        let numRebates = await RebateContract.methods
          .getNumRebates(claim.vendor)
          .call()

          for (let j = 0; j < numRebates; j++) {
            let rebate = await RebateContract.methods
              .getRebateByIdx(claim.vendor, j)
              .call()
            let b = Buffer.alloc(32)
            b.write(rebate.substr(2),'hex')
            let name = b.toString().split('\x00').join('')

            let rebateData = await RebateContract.methods
              .getRebate(rebate)
              .call()
              let amountToClaim = await RebateContract.methods
                .amountCanClaimTotal(spender, rebate, i)
                .call()
            claimArr.push({...claim, date: purchaseDate, value: data.result[0].value/1e5, claimed, idx: j, rebate, spender})
            rebateArr.push({...rebateData, name, amountToClaim})
          }



        }

    }
    this.setState({claimData: claimArr, rebateData: rebateArr})

 }

 claim = async (spender, rebateID, claimIdx, value) => {
   RebateContract.methods
     .claimRebate(spender, rebateID, claimIdx, value)
     .send({from: "0x135AE14990c2a57fFEA13E6970632B2CcF3757b0"})
 }


  encode = (data) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&")
  }

    render = () => {
        return (
            <div style={{display: 'block', width: (isMobile)?350:800, borderRadius: 20, marginLeft: 'auto', marginRight: 'auto', marginTop: 40, marginBottom: 20}}>
                  <Title>Current Rebates</Title>
                  <TextContainer>
                    You may claim your rebates in ELYS here.
                    <p>
                      If you made a purchase from a Vendor who is part
                      of the rebate program connect to elys.money with the wallet via which you made your
                      purchase and you will be able to claim your rebate for buying in ELYS.
                    </p>
                  </TextContainer>
                  <TableGrid>
                    <ColTitle>Vendor  <Triangle /></ColTitle>
                    <ColTitle>Rebate %  <Triangle /></ColTitle>
                    <ColTitle>Max Rebate  <Triangle /></ColTitle>
                    <ColTitle>Rebate Fund  <Triangle /></ColTitle>
                    <ColTitle>Filled  <Triangle /></ColTitle>
                  </TableGrid>
                  {
                    this.state.rebateData ? this.state.rebateData.map((rebate) => {
                      return (
                        <TableGrid>
                          <TableData>{rebate.name}</TableData>
                          <TableData>{rebate.percOfPurchase}% back</TableData>
                          <TableData>{rebate.maxPerPerson/1e5} ELYS per buyer<ActionButton>Check my Rebates</ActionButton></TableData>
                          <TableData>{rebate.elysBalance/1e5} ELYS</TableData>
                          <TableData>50% back</TableData>
                        </TableGrid>
                      )
                    })
                    :
                    null
                  }
                  <TableGrid>
                    <TableData>Sceletium.com</TableData>
                    <TableData>50% back</TableData>
                    <TableData>20000 ELYS per buyer<ActionButton>Check my Rebates</ActionButton></TableData>
                    <TableData>50,000 ELYS</TableData>
                    <TableData>50% back</TableData>
                  </TableGrid>

                  <BorderedContainer>
                    <Title>Fairy Godmother inc</Title>
                    <GridTitles>
                      <ColTitle>Purchase Date</ColTitle>
                      <ColTitle>Purchase Amount</ColTitle>
                      <ColTitle>Rebate Due</ColTitle>
                    </GridTitles>
                    {
                      this.state.claimData ? this.state.claimData.map((claim) => {
                        return (
                          <GridTitles>
                            <TableData>{claim.date}</TableData>
                            <TableData>{claim.value} ELYS</TableData>
                            <TableData>{claim.claimed} ELYS</TableData>
                            <ActionButton onClick={() => this.claim(claim.spender, claim.rebate, claim.idx, claim.claimed)}>Claim</ActionButton>
                          </GridTitles>
                        )
                      })
                      :
                      null
                    }
                    <GridTitles>
                      <TableData>10 August 2021</TableData>
                      <TableData>500 ELYS</TableData>
                      <TableData>claimed</TableData>
                      <ActionButton>Claim</ActionButton>
                    </GridTitles>
                  </BorderedContainer>

                  <Title>Don't See a Rebate - Check Vendor Wallet</Title>
                  {/**<div style={{marginTop: 5}}>
                      <Input onChange={props.lockAmountChange} value={props.lockAmount} defaultValue={0.0} type={'text'} />
                  </div>*/}
                  <Title>Create Rebates</Title>
                  <TextContainer>
                    You may create a rebate here. There is a fee of 100 ELYS to create a rebate.
                  </TextContainer>
                  <BorderedContainer>
                  <Formik
                    initialValues={{ rebate_name: "", rebate_fund: "", percentage: "", max_purchase: "", max_person: "", wallet_address: "" }}
                    onSubmit={(data, {resetForm, setFieldValue}) => {
                        fetch("/", {
                          method: "POST",
                          headers: { "Content-Type": "application/x-www-form-urlencoded" },
                          body: this.encode({
                            "form-name": "rebates-form",
                            ...data,
                          }),
                        })
                          .then((form) => {
                            console.log(form)
                          })
                          .catch(error => alert(error))

                    }}
                  >
                  {(formik) => (
                    <Form
                      name="rebates-form"
                      data-netlify="true"
                      data-netlify-honeypot="bot-field"
                    >

                      <Field type="hidden" name="form-name" />
                      <Field type="hidden" name="bot-field" />

                      <Flex>
                        <FeaturesGrid>
                        <FeatureItem>
                          <Label >Rebate Name</Label>
                          <Field name="rebate_name" placeholder="The Name of the offer" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "223px", height: "33px", paddingLeft: "10px"}}/>
                        </FeatureItem>
                        </FeaturesGrid>
                      </Flex>
                      <br />
                      <Flex style={{marginBottom: "50px"}}>
                        <FeaturesGrid>
                        <FeatureItem>
                          <Label >Total Rebate Fund </Label>
                          <Field name="rebate_fund" placeholder="How many ELYS for all rebates?" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "223px", height: "33px", paddingLeft: "10px"}}/>
                        </FeatureItem>
                        </FeaturesGrid>
                      </Flex>
                      <br />
                      <Flex style={{marginBottom: "50px"}}>
                        <FeaturesGrid>
                        <FeatureItem>
                          <Label>Percentage of Purchase</Label>
                          <Field name="percentage" placeholder="Rebate percent" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "400px", height: "33px", paddingLeft: "10px"}}/>
                        </FeatureItem>
                        </FeaturesGrid>
                      </Flex>
                      <br />
                      <Flex>
                      <FeaturesGrid>
                      <FeatureItem>
                        <Label >Max per Purchase</Label>
                        <Field name="max_purchase" placeholder="Max Claim" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "223px", height: "33px", paddingLeft: "10px"}}/>
                      </FeatureItem>
                      </FeaturesGrid>
                      <FeaturesGrid>
                      <FeatureItem>
                        <Label>Max per Person</Label>
                        <Field name="max_person" placeholder="Max Claim" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "223px", height: "33px", paddingLeft: "10px"}}/>
                      </FeatureItem>
                      </FeaturesGrid>
                      </Flex>
                      <br/>
                      <Flex>
                      <FeaturesGrid>
                        <FeatureItem>
                          <Label style={{width: "700px"}}>Payment Wallet</Label>
                          <Field name="wallet_address" placeholder="If people have paid this wallet they will be eligible to claim rebates" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "400px", height: "33px", paddingLeft: "10px"}}/>
                        </FeatureItem>
                      </FeaturesGrid>
                      </Flex>
                      <br/>
                      <ButtonContainer>
                        <Submit style={{color: "white", float: "right"}}>Fund & Create Rebate</Submit>
                      </ButtonContainer>
                      <br/>
                    </Form>
                    )}
                  </Formik>
                  </BorderedContainer>
            </div>
        )
    }
}

export default Rebates

const Label = styled.label`
  width: 100%;
  text-align: left;
  letter-spacing: 0px;
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: xx-large;
  color: #ED6F1B;
  font-weight: bold;
  margin-bottom: 5px;
`

const Flex = styled.div`
  display: grid;
  justify-content: space-between;
  align-content: center;
  grid-template-columns: 300px 300px 200px;
  margin-bottom: 20px;
  @media (max-width: 570px) {
    grid-template-columns: 1fr;
    grid-gap: 64px;
  }
`

const TextContainer = styled.div`
    display: block;
    width: 600px;
    margin-top: 30px;
    margin-bottom: 30px;
`
const Input = styled.input`
  border: solid 1px #ED6F1B;
  background-color: #facbac;
  border-radius: 10px;
  height: 20px;
  padding: 3px;
  width: 150px;
  padding-left: 10;
  outline: transparent;
`

const Triangle = styled.div`
  width: 0px;
  height: 0px;
  display: inline-block;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;

  border-top: 13px solid #ffffff;
`

const ColTitle = styled.div`
  width: 171px;
  height: 47px;
  font-size: 25px;
`
const Title = styled.div`
  color: #ec7019;
  font-weight: bold;
  font-size: 18px;
  margin-top: 20px;
  margin-bottom: 20px;
`

const TableGrid = styled.div`
  max-width: 670px;
  display: grid;
  grid-template-columns: repeat(5,1fr);
  grid-column-gap: 40px;
  grid-row-gap: 20px;
  margin-bottom: 10px;
  @media (max-width: 570px) {
    grid-template-columns: 1fr;
    padding: 0 64px;
  }
`

const TableData = styled.p`
  color: #ec7019;
  font-weight: bold;
  width: 171px;
  height: 47px;
  font-size: 15px;
`

const ActionButton = styled.div`
  width: 115px;
  background-color: #ec7019;
  border: none;
  border-radius: 20px;
  height: 25px;
  color: #ffffff;
  font-weight: bold;
  font-size: 12px;
  margin-top:5px;
  margin-right: 20px;
  text-align: center;
`

const BorderedContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 50px 40px;
  border: solid 2px #ED6F1B;
  padding-top: 20px;
  border-radius: 20px;
  width: 98%;
  position: relative;
`

const GridTitles = styled.div`
  max-width: 670px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0px auto;
  grid-column-gap: 40px;
  grid-row-gap: 20px;
  margin-bottom: 10px;
  @media (max-width: 570px) {
    grid-template-columns: 1fr;
    padding: 0 64px;
  }
`

const FeaturesGrid = styled.div`
  max-width: 670px;
  display: grid;
  grid-column-gap: 40px;
  grid-row-gap: 35px;
  @media (max-width: 570px) {
    grid-template-columns: 1fr;
    padding: 0 64px;
  }
`

const FeatureText = styled.p`
  text-align: center;
  @media (max-width: 570px) {
    display: none
  }
  @media (max-width: 570px) {
    display: none
  }
`
const Submit = styled.button`
  width: 167px;
  height: 32px;
  float: right;
  background: #ED6F1B 0% 0% no-repeat padding-box;
  border-radius: 45px;
`
const FeatureItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
`

const ButtonContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: row;
`
