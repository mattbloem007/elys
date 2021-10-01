import cannabis from '../images/cannabis-white-icon.png'
import iboga from '../images/iboga-white-icon.png'
import {isMobile} from 'react-device-detect';
import { Container, Section } from "../global"
import styled from "styled-components"
import { Formik, Field, Form, ErrorMessage } from "formik"
import $ from '../lib/forest'
import React, {useState} from 'react';
import detectEthereumProvider from '@metamask/detect-provider'

const orange = '#ec7019'

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&")
}

let style={
    padding: 5,
    fontSize: '12px',
    marginLeft: 10
}

class Forest extends React.Component {

  constructor(props) {
      super(props);
      var d = new Date(Date.now());
      this.state = {
          amount: "",
          errorMessage: false,
          donations: "",
          lockDays: "",
          canLock: "",
          transferAddress: "",
          balance: 0,
          lockInfo: [{tokenId: "", date: d.toDateString(), amount: "-", daysLeft: "N/A", reward: "-"}]
      };
  }

  // const [amount,setAmount] = useState('');
  // const [errorMessage,setError] = useState(false);
  // const [donations,setDonations] = useState('');
  // const [lockDays,setLockDays] = useState('');
  // const [canLock,setCanLock] = useState(false);

  componentWillMount = async () =>  {
    // CHECK IF METAMASK IS CONNECTED
    // let provider = await detectEthereumProvider()
    // if (provider) {
    //     this.getLockInfo()
    // }
    if (window.web3.eth) {
      this.getLockInfo()
      let bal = await $.getElysBalance()
      this.setState({balance: bal})
    }
  }

  encode = data => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&")
  }

   getLockInfo = async () => {
      let info = await $.lockTokensInfo()
      console.log("LOCK INFO: ", info)
      if (info.length == 0) {
        info.push({tokenId: "", date: Date.now(), amount: "-", daysLeft: "N/A", reward: "-"})
      }
      else {
        info.map(i => {
          i.date = Date.now()
        })
      }
      this.setState({ lockInfo: info })
    }

    claimFunds = (index) => {
      let info = this.state.lockInfo[index]
      console.log("info claim", info)
      if (info.daysLeft == 0) {
        $.release(info.tokenId)
      }
      else if (info.daysLeft > 0) {
        $.emergencyRelease(info.tokenId)
      }
    }

    transferFunds = (index) => {
      let info = this.state.lockInfo[index]
      console.log("info transfer", info, this.state.transferAddress)
      if (this.state.transferAddress != "") {
        $.transfer(info.tokenId, this.state.transferAddress)
      }
    }

   handleChange = (e) => {
      const {name, value} = e.target
      console.log("here", name, value)
      if (name == "lock_amount") {
      //  return setAmount(value)
        this.setState({amount: value})
      }
      if (name == "deposit_duration") {
      //  return setLockDays(value)
        this.setState({lockDays: value})
      }
      if (name == "forest_contribution") {
      //  return setDonations(value)
        this.setState({donations: value})
      }
      if (name == "transfer_address") {
        this.setState({ transferAddress: value})
      }
    }

     approveLock = (amount) => {
      console.log("approve", amount)
      $.approve(amount)
      .then((res) => {
        if (res.error) {
          // return setError(true)
          this.setState({errorMessage: true})
        }
        else {
        //  return setCanLock(true)
          this.setState({canLock: true})
        }
      })
    }

     lockContract = (amount, lockDays, donations) => {
      console.log("approve", amount)
      $.lockElys(amount, lockDays, donations)
      .then((res) => {
        console.log("res1", res)
      })
    }

    render() {
      return (
        <div style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 40}}>
          <ForestContainer>
          <Column>
            <Formik
              initialValues={{ lock_amount: this.state.amount, deposit_duration: "" }}
              onSubmit={(data, {resetForm, setFieldValue}) => {
                console.log("DATA", data)
                let encodedData = this.encode({
                  "form-name": "forest-form",
                  ...data,
                })
                console.log("EDATA",encodedData)
                  fetch("/", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: encodedData,
                  })
                    .then((form) => {
                      console.log(form)
                    })
                    .catch(error => alert(error))

              }}
            >
            {(formik) => (
              <Form
                name="forest-form"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
              >
              <img src={this.props.icon} alt='icon' width={30} />
              <div style={{
                  display: 'inline-block',
                  color: orange,
                  verticalAlign: 'top',
                  marginTop: 3,
                  marginLeft: 20,
                  fontSize: 20,
                  marginBottom: 20
              }}>{this.props.title}</div>
              <div style={style}>Rewards locked ELYS</div>
              <div style={style}>Your rewards are paid in ELYS</div>
              <div style={style}>Buy ELYS at ZooDex</div>



                <Field type="hidden" name="form-name" />
                <Field type="hidden" name="bot-field" />

                <Flex>
                  <FeaturesGrid>
                  <FeatureItem>
                    <Label htmlFor="lock_amount">Lock Amount</Label>
                    <SubLabel>Balance: {this.state.balance} ELYS</SubLabel>
                    <Field onChange={this.handleChange} name="lock_amount" value={this.state.amount} placeholder="0.0" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "223px", height: "33px", paddingLeft: "10px"}}/>
                  </FeatureItem>
                  </FeaturesGrid>
                  <ErrorMessage name="lock_amount" />
                </Flex>
                <br />

                <SacramentSymbolsContainer>
                <Label>Deposit Duration</Label>
                  <Flex role="group" aria-labelledby="my-radio-group">
                    <RadioLabel>
                      <Field style={{marginBottom: "10px"}} type="radio" name="deposit_duration" value="7 Days" />
                      7 Days
                    </RadioLabel>
                    <RadioLabel>
                      <Field style={{marginBottom: "10px"}} type="radio" name="deposit_duration" value="14 Days" />
                      14 Days
                    </RadioLabel>
                    <RadioLabel>
                      <Field style={{marginBottom: "10px"}} type="radio" name="deposit_duration" value="28 Days" />
                      28 Days
                    </RadioLabel>
                    <RadioLabel>
                      <Field style={{marginBottom: "10px"}} type="radio" name="deposit_duration" value="3 Months" />
                      3 Months
                    </RadioLabel>
                    <RadioLabel>
                      <Field style={{marginBottom: "10px"}} type="radio" name="deposit_duration" value="6 Months" />
                      6 Months
                    </RadioLabel>
                    <RadioLabel>
                      <Field style={{marginBottom: "10px"}} type="radio" name="deposit_duration" value="9 Months" />
                      9 Months
                    </RadioLabel>
                    <RadioLabel>
                      <Field style={{marginBottom: "10px"}} type="radio" name="deposit_duration" value="1 Year" />
                      1 Year
                    </RadioLabel>
                    <RadioLabel>
                      <Field style={{marginBottom: "10px"}} type="radio" name="deposit_duration" value="2 Years" />
                      2 Years
                    </RadioLabel>
                    <RadioLabel>
                      <Field style={{marginBottom: "10px"}} type="radio" name="deposit_duration" value="3 Years" />
                      3 Years
                    </RadioLabel>
                  </Flex>
                  <ButtonContainer>
                    <Header>12% APR</Header>
                    <SubLabel style={{float: "right"}}>Reward Amount: 3,000 ELYS</SubLabel>
                  </ButtonContainer>
                </SacramentSymbolsContainer>
                <br />

                <SacramentSymbolsContainer>
                <Label>Forest Fund Contribution</Label>
                  <Flex role="group" aria-labelledby="my-radio-group">
                    <RadioLabel>
                      <Field style={{marginBottom: "10px"}} type="radio" name="forest_contribution" value="1" />
                        1% of rewards
                    </RadioLabel>
                    <RadioLabel>
                      <Field style={{marginBottom: "10px"}} type="radio" name="forest_contribution" value="3" />
                      3% of rewards
                    </RadioLabel>
                    <RadioLabel>
                      <Field style={{marginBottom: "10px"}} type="radio" name="forest_contribution" value="5" />
                      5% of rewards
                    </RadioLabel>
                  </Flex>
                  <ButtonContainer>
                    {
                      this.state.canLock ?
                      <Submit onClick={() => {this.lockContract(this.state.amount, this.state.lockDays, this.state.donations) }} style={{color: "white", float: "right"}}>Lock</Submit>
                      :
                      <Submit onClick={() => {this.approveLock(this.state.amount) }} style={{color: "white", float: "right"}}>Approve</Submit>

                    }
                  </ButtonContainer>
                  {
                    this.state.errorMessage ?
                    <FeatureText style={{color: "red", fontWeight: "italic"}}>
                      There are insufficient funds. This transction is not approved
                    </FeatureText>
                    :
                    null
                  }
                </SacramentSymbolsContainer>
                <br />

              </Form>
              )}
            </Formik>
          </Column>
          <Column2>

            <Label>Claim</Label>
            <ClaimContainer>
              <Titles>DATE</Titles>
              <Titles>ELYS VALUE</Titles>
              <Titles>UNLOCKS IN</Titles>
            </ClaimContainer>
            {
              this.state.lockInfo.map((info, i) => {
                return (
                  <ClaimContainer>
                    <Titles>{info.date}</Titles>
                    <Titles>{info.amount} ELYS</Titles>
                    <Titles>{info.daysLeft} Days</Titles>
                    <ButtonContainer>
                      <Submit onClick={() => {this.claimFunds(i) }} style={{color: "white", float: "right", marginRight: "10px"}}>CLAIM</Submit>
                      <Submit onClick={() => {this.transferFunds(i) }} style={{color: "white", float: "right"}}>TRANSFER</Submit>
                    </ButtonContainer>
                  </ClaimContainer>
                )
              })
            }
            {/**<ButtonContainer>
              <Submit style={{color: "white", float: "right"}}>CLAIM</Submit>
              <Submit style={{color: "white", float: "right"}}>TRANSFER</Submit>
            </ButtonContainer>*/}
            <br/>

            <Label>Transfer</Label>
            <ClaimContainer>
              <Titles>DATE</Titles>
              <Titles>ELYS VALUE</Titles>
              <Titles>UNLOCKS IN</Titles>
            </ClaimContainer>
            {
              this.state.lockInfo.map((info, i) => {
                return (
                  <ClaimContainer>
                    <Titles>{info.date}</Titles>
                    <Titles>{info.amount} ELYS</Titles>
                    <Titles>{info.daysLeft} Days</Titles>
                    <ButtonContainer>
                      <Submit onClick={() => {this.claimFunds(i) }} style={{color: "white", float: "right", marginRight: "10px"}}>CLAIM</Submit>
                      <Submit onClick={() => {this.transferFunds(i) }} style={{color: "white", float: "right"}}>TRANSFER</Submit>
                    </ButtonContainer>
                  </ClaimContainer>
                )
              })
            }

            <Formik
              initialValues={{ transfer_address: "" }}
              onSubmit={(data, {resetForm, setFieldValue}) => {
                  fetch("/", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: encode({
                      "form-name": "transfer-form",
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
                name="transfer-form"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
              >
              <Flex2>
                <FeaturesGrid>
                <FeatureItem>
                  <FeatureText>Address to transfer to:</FeatureText>
                  <Field onChange={this.handleChange} name="transfer_address" type="text" value={this.state.transferAddress} style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "223px", height: "33px", paddingLeft: "10px"}}/>
                </FeatureItem>
                </FeaturesGrid>
                <ErrorMessage name="transfer_address" />
              </Flex2>
              <ButtonContainer>
                <Submit onClick={() => {this.transferFunds(0) }} style={{color: "white"}}>TRANSFER</Submit>
              </ButtonContainer>
              <br/>

              </Form>
              )}
            </Formik>

          </Column2>
          <Row>
            <div style={{width: "100%", alignItems: "center", display: "flex", justifyContent: "center"}}>
              <a href="#" style={{color: "white", fontWeight: "bold"}}>Emergency unlock ? click here</a>
            </div>
          </Row>
          <BottomText>
            <Header>The Patch is 50% planted</Header>
            <FeaturesGrid2>
            <FeatureItem>
              <FeatureText>Once full the patch will be open but no further rewards issued</FeatureText>
            </FeatureItem>
            </FeaturesGrid2>
          </BottomText>
          </ForestContainer>
        </div>
      )
    }
}

export default Forest


// const ForestPage = (props) => {
//     return (<div style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 40}}>
//         <Forest icon={iboga} title={'The Forest'} pair={'FTM-ELYS'} pairType={'Single token Lock'} lockTime={'12, 24, 36 Months'} return={'12%, 32%, 60%'} apr={'12% - 20%'} paidIn={'ELYS'}/>
//
//     </div>)
// }

const ForestContainer = styled.div`
  border: solid 2px #ec7019;
  border-radius: 10px;
  display: grid;
  padding: 10px;
  margin: 20px;
  vertical-align: top;
`

const Submit = styled.button`
width: 167px;
height: 32px;
float: right;
background: #ED6F1B 0% 0% no-repeat padding-box;
border-radius: 45px;
`

const ButtonContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: row;
`

const ClaimContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4,8em);
  padding: 10px;
  margin: 20px;
`

const Titles = styled.div`
  padding: 5px,
  font-size: 15px;
`

const Column = styled.div`
  border-right: solid 2px #ec7019;
  padding: 10px;
  font-weight: bold;
  vertical-align: top;
`

const Column2 = styled.div`
  grid-column-start: 2;
  grid-row-start: 1;
  padding: 10px;
`
const Row = styled.div`
  grid-column-start: 2;
  grid-row-start: 2;
  padding: 10px;
`

const BottomText = styled.div`
  text-align: center;
  grid-row: 3;
  grid-column: 1 / 4;
`

const FeatureItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`


const ActionButton = styled.button`
  display: block;
  background-color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 15px;
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
  margi-top: 10px;
  font-size: 18px;
  font-weight: 500px
  color: #ed6f1b;
  width: 150px;
  height: 40px;
`

const Flex = styled.div`
  display: grid;
  justify-content: space-between;
  align-content: center;
  grid-template-columns: 150px 150px 150px;
  margin-bottom: 20px;
  @media (max-width: 570px) {
    grid-template-columns: 1fr;
    grid-gap: 64px;
  }
`

const Flex2 = styled.div`
  margin-bottom: 20px;

`

const Header = styled.label`
width: 100%;
text-align: center;
letter-spacing: 0px;
color: #FFFFFF;
display: flex;
flex-direction: column;
align-items: center;
font-size: large;
color: #ED6F1B;
margin-bottom: 5px;
`

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

const SubLabel = styled.label`
width: 100%;
text-align: left;
letter-spacing: 0px;
color: #FFFFFF;
font-size: medium;
color: #ffffff;
margin-bottom: 5px;
`

const RadioLabel = styled.label`
width: 100%;
text-align: left;
letter-spacing: 0px;
color: #FFFFFF;
display: flex;
flex-direction: column;
align-items: center;

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

const SacramentSymbolsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 570px) {
    padding-right: 5px;
  }
`

//export default ForestPage
