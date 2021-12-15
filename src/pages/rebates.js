
import React from 'react'
import {isMobile} from 'react-device-detect';
import styled from "styled-components"
import { Formik, Field, Form, ErrorMessage } from "formik"
import * as Yup from "yup";
import { Container, Section } from "../global"
import Info from '../components/info'
import axios from 'axios'
import Web3 from "web3";
import addresses from '../crypto/contractAddress'
import detectEthereumProvider from '@metamask/detect-provider'
import abi from '../crypto/abi'
import forest from '../lib/forest'
import _ from 'lodash'

const APIKey = 'P4TFDSVTPA75K86MTCQXTGXGN2Z7H7H9BU'
const elysAddress = '0x52F1f3D2F38bdBe2377CDa0b0dbEB993DC242B98'


window.forest = forest;


class Rebates extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      rebateData: [],
      claimData: [],
      specificClaimData: [],
      vendorList: [],
      rebateIDs: [],
      claimTitle: "Click Check My Rebates to view Claims",
      rebate_name: "",
      rebate_fund: "",
      percentage: "",
      max_purchase: "",
      max_person: "",
      wallet_address: "",
      spender: "",
      rebate_fund_Error: false,
      percentage_Error: false,
      max_purchase_Error: false,
      max_person_Error: false,
      unformattedClaimAmount: 0,
      loading: true,
      hasMetamask: false,
      isConnected: false,
      ElysContract: null,
      RebateContract: null,
      currentAccount: "",
      dataFeedback: "Loading...",
      rebateApproved: false,
      approving: false
    }
  }

  checkMetamask = async () => {
      let provider = await detectEthereumProvider({mustBeMetaMask:true})
      if (provider) {
          window.ethereum = provider
          return true //window.ethereum.isMetaMask
      }
      return false
  }

  componentWillMount = async () =>{
    let hasMetamask = await this.checkMetamask()
    if(hasMetamask){
        window.web3 = new Web3(window.ethereum);
        if(!window.ethereum.isConnected){
            this.setState({loading: false,hasMetamask: true, isConnected: false})
            return
        }
        let accounts = await window.web3.eth.getAccounts();
        let connected = accounts.length>0
        let RebateContract = new window.web3.eth.Contract(abi.rebate, addresses.rebate);
        let ElysContract = new window.web3.eth.Contract(abi.elys, elysAddress)
        this.setState({loading: true,hasMetamask: true, isConnected: connected, RebateContract, ElysContract, currentAccount: accounts[0]})
    }

    this.getData(this.state.currentAccount)
    .then(() => {
      if (this.state.rebateData.length == 0) {
        this.setState({dataFeedback: "No Rebates Created Yet"})
      }
      else {
        this.setState({loading: false})
      }
      console.log(this.state)
    })

  }

  formatDate = (dt) => {
      let day = dt.getDate()
      let month = (dt.getMonth()+1).toString()
      if(month.length===1)month = '0' + month
      let year = dt.getFullYear().toString().substr(2)
      return day + '-' + month + '-' + year
  }

  checkMyRebates = async (idx, spender, vendor) => {
    console.log("REBATE DATA:", idx, spender, vendor)
    let rebate = await this.state.RebateContract.methods
      .getRebateByIdx(vendor, idx)
      .call()

    let b = Buffer.alloc(32)
    b.write(rebate.substr(2),'hex')
    let name = b.toString().split('\x00').join('')
    console.log("Rebate ID:", rebate, name)
    let newClaimArr = []
    for (let i = 0; i < this.state.claimData.length; i++) {
      if (this.state.claimData[i].rebate == rebate) {
        newClaimArr.push(this.state.claimData[i])
      }
    }
    console.log(newClaimArr)
    this.setState({specificClaimData: newClaimArr, claimTitle: name})
  }

  getData = async (spender) => {

   let numClaims = await this.state.RebateContract.methods
     .getNumClaims(spender)
     .call()
    console.log("numClaims", numClaims)
    let claimArr = [];
    let rebateArr = [];
    let rebateIdsArr = [];
    let vendors = [];
    let j = 0;
    for (let i = 0; i < numClaims; i++) {

      let claim = await this.state.RebateContract.methods
        .getClaim(spender, i)
        .call()
        let purchaseDate = new Date(parseInt(claim.ts)*1000)
        purchaseDate = this.formatDate(purchaseDate)
        this.setState({unformattedClaimAmount: claim[1]})
          vendors.push(claim.vendor)
          claimArr.push({...claim, date: purchaseDate, value: claim[1]/1e5, spender, idx: i})

    }

    vendors = _.uniq(vendors)
      for (let l = 0; l < vendors.length; l++) {

      let numRebates = await this.state.RebateContract.methods
        .getNumRebates(vendors[l])
        .call()
        j = 0;
        while (j < numRebates) {
          console.log("Num:", vendors[l], j)
         let rebate = await this.state.RebateContract.methods
           .getRebateByIdx(vendors[l], j)
           .call()
         let b = Buffer.alloc(32)
         b.write(rebate.substr(2),'hex')
         let name = b.toString().split('\x00').join('')

         let rebateData = await this.state.RebateContract.methods
           .getRebate(rebate)
           .call()

           for (let k = 0; k < claimArr.length; k++) {
             if (!claimArr[k].rebate) {
               if (claimArr[k].vendor == vendors[l]) {
                 let amountToClaim = await this.state.RebateContract.methods
                   .amountCanClaimTotal(spender, rebate, k)
                   .call()
                 claimArr[k] = {...claimArr[k], rebate, amountCanClaim: amountToClaim/1e5}
               }
             }

           }


         rebateIdsArr.push({vendor: vendors[l], id: rebate, idx: l, spender})
         rebateArr.push({...rebateData, name, idx: j, spender})
         j++;
       }
    }

    this.setState({claimData: claimArr, vendorList: vendors, spender, rebateData: rebateArr, rebateIDs: rebateIdsArr})
 }

 getRebates = async (vendors, spender, claims) => {
   let j = 0;
   let rebateArr = [];
   let rebateIdsArr = [];
   let claimArr = [];

   vendors.map(async (vendor, i) => {
     let numRebates = await this.state.RebateContract.methods
       .getNumRebates(vendor)
       .call()
       while (j < numRebates) {
        let rebate = await this.state.RebateContract.methods
          .getRebateByIdx(vendor, j)
          .call()
        let b = Buffer.alloc(32)
        b.write(rebate.substr(2),'hex')
        let name = b.toString().split('\x00').join('')

        let rebateData = await this.state.RebateContract.methods
          .getRebate(rebate)
          .call()

          for (let k = 0; k < claims.length; k++) {
            if (claims[k].vendor == vendor) {
              claimArr.push({...claims[k], rebate})
            }
          }


        rebateIdsArr.push({vendor, id: rebate, idx: i, spender})
        rebateArr.push({...rebateData, name, idx: j, spender})
        j++;
      }
   })


   this.setState({rebateData: rebateArr, rebateIDs: rebateIdsArr})

 }

 claim = async (spender, rebate, claimIdx) => {
   let amountToClaim = await this.state.RebateContract.methods
     .amountCanClaimTotal(spender, rebate, claimIdx)
     .call()

   console.log("Claim Data: ", spender, rebate, claimIdx, amountToClaim)
   await this.state.RebateContract.methods
     .claimRebate(spender, rebate, claimIdx, amountToClaim)
     .send({from: this.state.currentAccount})
 }

 validateForm = () => {

 }

 approveRebate = async () => {
  this.setState({approving: true})
  await forest.approveRebate(this.state.rebate_fund)
  .then((res) => this.setState({rebateApproved: true, approving: false}))
}

 createRebate = async () => {
       let b = Buffer.alloc(32)
       b.write(this.state.rebate_name)
       let id = '0x' + b.toString('hex')
       console.log(id, this.state.percentage, this.state.max_purchase*1e5, this.state.max_person*1e5, this.state.wallet_address, this.state.rebate_fund*1e5)
       try {
         await this.state.RebateContract.methods
           .createRebate(id, this.state.percentage, this.state.max_purchase*1e5, this.state.max_person*1e5, this.state.wallet_address, this.state.rebate_fund*1e5)
           .send({from: this.state.currentAccount})
           .then((res) => console.log(res))
       }
       catch(e) {
         console.log("ERROR: ", e)
       }


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
                    <ColTitle>Vendor  <Triangle /><span style={{position: 'relative', top: -5, left: -5}}>
                    <Info>This is the rate as an annualized percentage.  Your actual rate is: (APR x time locked in days)/365.</Info></span></ColTitle>
                    <ColTitle>Rebate %  <Triangle /></ColTitle>
                    <ColTitle>Max Rebate  <Triangle /></ColTitle>
                    <ColTitle>Rebate Fund  <Triangle /></ColTitle>
                    <ColTitle>Filled  <Triangle /></ColTitle>
                  </TableGrid>
                  {
                    this.state.loading ? <Title>{this.state.dataFeedback}</Title>
                    :
                    this.state.rebateData.map((rebate, i) => {
                      return (
                        <TableGrid key={i}>
                          <TableData>{rebate.name}</TableData>
                          <TableData>{rebate.percOfPurchase}% back</TableData>
                          <TableData>{rebate.maxPerPerson/1e5} ELYS per buyer<ActionButton onClick={() => this.checkMyRebates(rebate.idx, rebate.spender, rebate.vendor)}>Check my Rebates</ActionButton></TableData>
                          <TableData>{rebate.elysBalance/1e5} ELYS</TableData>
                          <TableData>50% back</TableData>
                        </TableGrid>
                      )
                    })


                  }

                  <OuterContainer>
                    <BorderedContainer>
                      <Title>{this.state.claimTitle}</Title>
                      <GridTitles>
                        <ColTitle>Purchase Date</ColTitle>
                        <ColTitle>Purchase Amount</ColTitle>
                        <ColTitle>Rebate Due</ColTitle>
                      </GridTitles>
                      {
                        this.state.specificClaimData.map((claim) => {
                          let claimAmount = claim.amountCanClaim.toString() + " ELYS"
                          if (claim.claimed) {
                            claimAmount = "claimed"
                          }
                          return (
                            <GridTitles>
                              <TableData>{claim.date}</TableData>
                              <TableData>{claim.value} ELYS</TableData>
                              <TableData>{claimAmount}</TableData>
                              {
                                claim.claimed ? null
                                :
                                <InFormButton onClick={() => this.claim(claim.spender, claim.rebate, claim.idx)}>Claim</InFormButton>
                              }
                            </GridTitles>
                          )
                        })
                      }
                    </BorderedContainer>
                  </OuterContainer>

                  <Title>Don't See a Rebate - Check Vendor Wallet</Title>
                  <div style={{marginTop: 5}}>
                      <Input defaultValue={0.0} type={'text'} />
                  </div>
                  <Title>Create Rebates</Title>
                  <TextContainer>
                    You may create a rebate here. There is a fee of 100 ELYS to create a rebate.
                  </TextContainer>
                  <BorderedContainer>
                  <Formik
                    initialValues={{ rebate_name: "", rebate_fund: "", percentage: "", max_purchase: "", max_person: "", wallet_address: "" }}
                    validationSchema={Yup.object().shape({
                      rebate_fund: Yup.number()
                        .required("Please enter a valid value"),
                      percentage: Yup.number()
                        .required("Please enter a valid value"),
                      max_purchase: Yup.number()
                        .required("Please enter a valid value"),
                      max_person: Yup.number()
                        .required("Please enter a valid value"),
                    })}
                    onSubmit={() => {
                      this.approveRebate()
                    }}
                  >
                  {({
                      values,
                      errors,
                      touched,
                      handleSubmit,
                      isSubmitting,
                      validating,
                      valid,
                    }) => (
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
                          <Field name="rebate_name" onKeyUp={(value) => this.setState({rebate_name: value.target.value})} placeholder="The Name of the offer" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "223px", height: "33px", paddingLeft: "10px"}}/>
                        </FeatureItem>
                        </FeaturesGrid>
                      </Flex>
                      <br />
                      <Flex>
                        <FeaturesGrid>
                        <FeatureItem>
                          <Label >Total Rebate Fund <span style={{position: 'relative', top: -5, left: -5}}>
                          <Info>This is the rate as an annualized percentage.  Your actual rate is: (APR x time locked in days)/365.</Info></span></Label>
                          <Field valid={touched.rebate_fund && !errors.rebate_fund} error={touched.rebate_fund && errors.rebate_fund} name="rebate_fund" onKeyUp={(value) => this.setState({rebate_fund: value.target.value})} placeholder="How many ELYS for all rebates?" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "223px", height: "33px", paddingLeft: "10px"}}/>
                          <ErrorMessage name="rebate_fund">
                            {(msg) => (
                              <StyledInlineErrorMessage>{msg}</StyledInlineErrorMessage>
                            )}
                          </ErrorMessage>
                        </FeatureItem>
                        </FeaturesGrid>
                      </Flex>
                      <br />
                      <Flex>
                        <FeaturesGrid>
                        <FeatureItem>
                          <Label>Percentage of Purchase <span style={{position: 'relative', top: -5, left: -5}}>
                          <Info>This is the rate as an annualized percentage.  Your actual rate is: (APR x time locked in days)/365.</Info></span></Label>
                          <Field valid={touched.percentage && !errors.percentage} error={touched.percentage && errors.percentage} name="percentage" onKeyUp={(value) => this.setState({percentage: value.target.value})} placeholder="Rebate percent" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "400px", height: "33px", paddingLeft: "10px"}}/>
                          <ErrorMessage name="percentage">
                            {(msg) => (
                              <StyledInlineErrorMessage>{msg}</StyledInlineErrorMessage>
                            )}
                          </ErrorMessage>
                        </FeatureItem>
                        </FeaturesGrid>
                      </Flex>
                      <br />
                      <Flex style={{display: "flex"}}>
                      <FeaturesGrid>
                      <FeatureItem>
                        <Label >Max per Purchase <span style={{position: 'relative', top: -5, left: -5}}>
                        <Info>This is the rate as an annualized percentage.  Your actual rate is: (APR x time locked in days)/365.</Info></span></Label>
                        <Field valid={touched.max_purchase && !errors.max_purchase} error={touched.max_purchase && errors.max_purchase} name="max_purchase" onKeyUp={(value) => this.setState({max_purchase: value.target.value})} placeholder="Max Claim" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "223px", height: "33px", paddingLeft: "10px"}}/>
                        <ErrorMessage name="max_purchase">
                          {(msg) => (
                            <StyledInlineErrorMessage>{msg}</StyledInlineErrorMessage>
                          )}
                        </ErrorMessage>
                      </FeatureItem>
                      </FeaturesGrid>
                      <FeaturesGrid>
                      <FeatureItem>
                        <Label>Max per Person <span style={{position: 'relative', top: -5, left: -5}}>
                        <Info>This is the rate as an annualized percentage.  Your actual rate is: (APR x time locked in days)/365.</Info></span></Label>
                        <Field valid={touched.max_person && !errors.max_person} error={touched.max_person && errors.max_person} name="max_person" onKeyUp={(value) => this.setState({max_person: value.target.value})} placeholder="Max Claim" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "223px", height: "33px", paddingLeft: "10px"}}/>
                        <ErrorMessage name="max_person">
                          {(msg) => (
                            <StyledInlineErrorMessage>{msg}</StyledInlineErrorMessage>
                          )}
                        </ErrorMessage>
                      </FeatureItem>
                      </FeaturesGrid>
                      </Flex>
                      <br/>
                      <Flex>
                      <FeaturesGrid>
                        <FeatureItem>
                          <Label style={{width: "700px"}}>Payment Wallet</Label>
                          <Field name="wallet_address" onKeyUp={(value) => this.setState({wallet_address: value.target.value})} placeholder="If people have paid this wallet they will be eligible to claim rebates" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "400px", height: "33px", paddingLeft: "10px"}}/>
                        </FeatureItem>
                      </FeaturesGrid>
                      </Flex>
                      <br/>
                      <ButtonContainer>
                      {
                        this.state.approving ? <ActionButton type="submit" style={{color: "white", float: "right", width: "200px", color: '#000000', backgroundColor: '#facbac'}}>Awaiting Approval</ActionButton>
                        :
                        <ActionButton type="submit" style={{color: "white", float: "right", width: "200px"}}>Approve</ActionButton>

                      }
                      {
                        this.state.rebateApproved ? <ActionButton onClick={() => this.createRebate()} style={{color: "white", float: "right", width: "200px"}}>Fund & Create Rebate</ActionButton>

                        :
                        <ActionButton onClick={() => this.createRebate()} style={{color: "white", float: "right", width: "200px", opacity: '0.5', cursor: 'default'}} disabled={true}>Fund & Create Rebate</ActionButton>

                      }
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
  flex-direction: row;
  align-items: flex-start;
  font-size: x-large;
  color: #ED6F1B;
  font-weight: bold;
  margin-bottom: 5px;
`

const Flex = styled.div`
  display: grid;
  justify-content: space-between;
  align-content: center;
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
  font-size: 20px;
`
const Title = styled.div`
  color: #ec7019;
  font-weight: bold;
  font-size: 25px;
  margin-top: 20px;
  margin-bottom: 20px;
`

const TableGrid = styled.div`
  max-width: 670px;
  display: grid;
  grid-template-columns: repeat(5,1fr);
  grid-column-gap: 9px;
  grid-row-gap: 9px;
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

const ActionButton = styled.button`
  width: 150px;
  border: none;
  text-align: center;
  border-radius: 20px;
  margin-top: 10px;
  height: 40px;
  color: #ffffff;
  font-weight: bold;
  font-size: 15px;
  margin-right: 20px;
  background-color: #ec7019;
  &:hover {
    cursor: pointer;
  }

`

const InFormButton = styled.button`
  width: 100px;
  border: none;
  text-align: center;
  border-radius: 20px;
  margin-top: 10px;
  height: 40px;
  color: #ffffff;
  font-weight: bold;
  font-size: 15px;
  margin-right: 20px;
  background-color: #ec7019;
  &:hover {
    cursor: pointer;
  }
`
const OuterContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
`

const BorderedContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 50px 40px;
  border: solid 2px #ED6F1B;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 20px;

`

const GridTitles = styled.div`
  max-width: 670px;
  display: grid;
  grid-template-columns: repeat(4, 180px);
  margin: 0px auto;
  grid-column-gap: 20px;
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

const FeaturesGrid2 = styled.div`
  max-width: 670px;
  display: flex;
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

const StyledInlineErrorMessage = styled.div`
  background-color: rgb(255, 245, 245);
  color: rgb(120, 27, 0);
  display: block;

  padding: 0.5rem 0.75rem;
  margin-top: 0.5rem;
  white-space: pre-line;
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
