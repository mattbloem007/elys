
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

const elysAddress = '0x52F1f3D2F38bdBe2377CDa0b0dbEB993DC242B98'


window.forest = forest;


class CreateRebates extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      claimTitle: "Click Check My Rebates to view Claims",
      noClaims: "No Claims for this Rebate Yet.. Make a payment to this vendor",
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
      approving: false,
      funding: false
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

  }

  formatDate = (dt) => {
      let day = dt.getDate()
      let month = (dt.getMonth()+1).toString()
      if(month.length===1)month = '0' + month
      let year = dt.getFullYear().toString().substr(2)
      return day + '-' + month + '-' + year
  }

 approveRebate = async () => {
  this.setState({approving: true})
  await forest.approveRebate(this.state.rebate_fund)
  .then((res) => this.setState({rebateApproved: true, approving: false}))
}

 createRebate = async () => {
   this.setState({funding: true})
       let b = Buffer.alloc(32)
       b.write(this.state.rebate_name)
       let id = '0x' + b.toString('hex')
       console.log(id, this.state.percentage, this.state.max_purchase*1e5, this.state.max_person*1e5, this.state.wallet_address, this.state.rebate_fund*1e5)
       try {
         await this.state.RebateContract.methods
           .createRebate(id, this.state.percentage, this.state.max_purchase*1e5, this.state.max_person*1e5, this.state.wallet_address, this.state.rebate_fund*1e5)
           .send({from: this.state.currentAccount})
           .then((res) => this.setState({rebateApproved: true, funding: false}))
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
      let approveButton = (<ActionButton onClick={() => this.approveRebate()} style={{color: "white", float: "right", width: "200px"}}>Approve</ActionButton>)
      let fundButton = (<ActionButton onClick={() => this.createRebate()} style={{color: "white", float: "right", width: "200px", opacity: '0.5', cursor: 'default'}} disabled={true}>Fund & Create Rebate</ActionButton>)

      if(this.state.approving) {
        approveButton = (
          <ActionButton type="submit" style={{color: "white", float: "right", width: "200px", color: '#000000', backgroundColor: '#facbac'}} disabled={true}>Awaiting Approval</ActionButton>
        )
      }
      else if (!this.state.approving && this.state.rebateApproved) {
        approveButton = (
          <ActionButton style={{color: "white", float: "right", width: "200px", backgroundColor: '#facbac'}} disabled={true}>Approved</ActionButton>
        )
      }


      if (!this.state.funding && this.state.rebateApproved) {
        fundButton = (
          <ActionButton onClick={() => this.createRebate()} style={{color: "white", float: "right", width: "200px"}}>Fund & Create Rebate</ActionButton>
        )
      }
      else if (this.state.funding) {
      fundButton  = (
          <ActionButton type="submit" style={{color: "white", float: "right", width: "200px", color: '#000000', backgroundColor: '#facbac'}} disabled={true}>Awaiting Funding</ActionButton>
        )
      }

        return (
            <div style={{display: 'block', width: (isMobile)?350:800, borderRadius: 20, marginLeft: 'auto', marginRight: 'auto', marginTop: 40, marginBottom: 20}}>
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
                      {approveButton}
                      {fundButton}
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

export default CreateRebates

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
