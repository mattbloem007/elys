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

window.forest = $;


class Forest extends React.Component {

  constructor(props) {
      super(props);

      var d = new Date(Date.now());
      this.state = {
          amount: "",
          errorMessage: false,
          loading: false,
          donations: "",
          lockDays: "",
          canLock: false,
          transferAddress: "",
          rewards: "0",
          balance: 0,
          done: false,
          showTransfer: false,
          apr: "0",
          factoryBalance: 0,
          lockedBal: 0,
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
      let facBal = await $.getLeft()
      bal = Math.trunc(bal/1e5) + ",000"
      facBal = Math.trunc(facBal/1e5) + ",000"
      let lockBal = 1000000 - parseInt(facBal)
      lockBal = lockBal + ",000"
      this.setState({balance: bal, factoryBalance: facBal, lockedBal: lockBal})
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
        var d = new Date();
      if (info.length == 0) {
        info.push({tokenId: "", date: Date.now(), amount: "-", daysLeft: "N/A", reward: "-"})
      }
      else {
        info.map(i => {
          console.log(i.daysLeft)
          d.setDate(d.getDate() - i.daysLeft)
          i.date = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear()
          d = new Date()
        })
      }
      this.setState({ lockInfo: info })
    }

    claimFunds = (index) => {
      let info = this.state.lockInfo[index]
      console.log("info claim", info)
      if (info.daysLeft == 0) {
        $.release(info.tokenId)
        .then((res) => {
          if (res.error) {
            console.log(res.error)
          }
          else {
          //  return setCanLock(true)
            console.log("SUCCESS", res)
            this.setState({done: !this.state.done})
          }
        })
      }
      else if (info.daysLeft > 0) {
        $.emergencyRelease(info.tokenId)
        .then((res) => {
          if (res.error) {
            console.log(res.error)
          }
          else {
          //  return setCanLock(true)
            console.log("SUCCESS", res)
            this.setState({done: !this.state.done})
          }
        })
      }
    }

    transferFunds = (index) => {
      let info = this.state.lockInfo[index]
      console.log("info transfer", info, this.state.transferAddress)
      if (this.state.transferAddress != "") {
        $.transfer(info.tokenId, this.state.transferAddress)
        .then((res) => {
          if (res.error) {
            console.log(res.error)
          }
          else {
          //  return setCanLock(true)
            console.log("SUCCESS", res)
            this.setState({done: !this.state.done})
          }
        })
      }
    }

    includeTransfer = () => {
      this.setState({showTransfer: !this.state.showTransfer})
    }

   handleChange = async (e) => {
      const {name, value} = e.target
      console.log("here", name, value)
      if (name == "lock_amount") {
      //  return setAmount(value)
        this.setState({amount: value})
        if (this.state.lockDays != "") {
          let rewards = await $.getReward(this.state.lockDays, value)
          rewards = Math.trunc(rewards/1e5) + ",000"
          this.setState({rewards: rewards})
        }
      }
      if (name == "deposit_duration") {
      //  return setLockDays(value)
        let apr = "0";
        this.setState({lockDays: value})
        switch(value) {
          case "6":
            apr = "4"
          break;

          case "14":
          apr = "5"
          break;

          case "28":
          apr = "6"
          break;

          case "91":
          apr = "9"
          break;

          case "183":
          apr = "12"
          break;

          case "274":
          apr = "15"
          break;

          case "365":
          apr = "20"
          break;

          case "731":
          apr = "23"
          break;

          case "1096":
          apr = "26"
          break;

        }
        if (this.state.amount != "") {
          let rewards = await $.getReward(value, this.state.amount)
          rewards = rewards + ",000"
          this.setState({rewards: rewards, apr: apr})
        }
        else {
          this.setState({apr: apr})
        }
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
      this.setState({loading: true})
      $.approve(amount)
      .then((res) => {
        if (res.error) {
          // return setError(true)
          this.setState({errorMessage: true, loading: false})
        }
        else {
        //  return setCanLock(true)
          this.setState({canLock: true, loading: false})
        }
      })
    }

     lockContract = (amount, lockDays, donations) => {
      console.log("approve", amount, lockDays, donations)
      $.lockElys(parseInt(amount), parseInt(lockDays), parseInt(donations))
      .then((res) => {
        console.log("res1", res)
        this.setState({done: !this.state.done})
      })
    }

    render() {
      return (
        <div style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 40}}>
          <ForestContainer>
          <TopText>
            <Label style={{textAlign: "center", alignItems:"center", marginBottom: "20px"}}>{this.state.lockedBal} ELYS Locked in the Forest</Label>
          </TopText>
          <Column>
            <Formik
              initialValues={{ lock_amount: this.state.amount, deposit_duration: 0,  }}
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
              <ImageandTitle>
                <SacramentSymbol src={this.props.icon} />
                <FeatureTitle>{this.props.title}</FeatureTitle>
              </ImageandTitle>

              <div style={style}>Rewards locked ELYS</div>
              <div style={style}>Your rewards are paid in ELYS</div>
              <a href="https://dex.zoocoin.cash/orders/market?inputCurrency=FTM&outputCurrency=0xd89cc0d2A28a769eADeF50fFf74EBC07405DB9Fc" style={{color: "white", fontWeight: "bold", padding: '5px', fontSize: '12px',marginLeft: '10px'}}>Buy ELYS here</a>



                <Field type="hidden" name="form-name" />
                <Field type="hidden" name="bot-field" />

                <Flex>
                  <FeaturesGrid>
                  <FeatureItem>
                    <Label style={{marginTop: "20px"}} htmlFor="lock_amount">Lock Amount</Label>
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
                      <Field onClick={this.handleChange} style={{marginBottom: "10px"}} type="radio" name="deposit_duration" value="6" />
                      7 Days
                    </RadioLabel>
                    <RadioLabel>
                      <Field onClick={this.handleChange} style={{marginBottom: "10px"}} type="radio" name="deposit_duration" value="14" />
                      14 Days
                    </RadioLabel>
                    <RadioLabel>
                      <Field onClick={this.handleChange} style={{marginBottom: "10px"}} type="radio" name="deposit_duration" value="28" />
                      28 Days
                    </RadioLabel>
                    <RadioLabel>
                      <Field onClick={this.handleChange} style={{marginBottom: "10px"}} type="radio" name="deposit_duration" value="91" />
                      3 Months
                    </RadioLabel>
                    <RadioLabel>
                      <Field onClick={this.handleChange} style={{marginBottom: "10px"}} type="radio" name="deposit_duration" value="183" />
                      6 Months
                    </RadioLabel>
                    <RadioLabel>
                      <Field onClick={this.handleChange} style={{marginBottom: "10px"}} type="radio" name="deposit_duration" value="274" />
                      9 Months
                    </RadioLabel>
                    <RadioLabel>
                      <Field onClick={this.handleChange} style={{marginBottom: "10px"}} type="radio" name="deposit_duration" value="365" />
                      1 Year
                    </RadioLabel>
                    <RadioLabel>
                      <Field onClick={this.handleChange} style={{marginBottom: "10px"}} type="radio" name="deposit_duration" value="731" />
                      2 Years
                    </RadioLabel>
                    <RadioLabel>
                      <Field onClick={this.handleChange} style={{marginBottom: "10px"}} type="radio" name="deposit_duration" value="1096" />
                      3 Years
                    </RadioLabel>
                  </Flex>
                  <ButtonContainer>
                    <Header>{this.state.apr}% APR</Header>
                    <SubLabel style={{float: "right"}}>Reward Amount: {this.state.rewards} ELYS</SubLabel>
                  </ButtonContainer>
                </SacramentSymbolsContainer>
                <br />

                <SacramentSymbolsContainer>
                <Label>Forest Fund Contribution</Label>
                  <Flex role="group" aria-labelledby="my-radio-group">
                    <RadioLabel>
                      <Field style={{marginBottom: "10px"}} onClick={this.handleChange} type="radio" name="forest_contribution" value="1" />
                        1% of rewards
                    </RadioLabel>
                    <RadioLabel>
                      <Field style={{marginBottom: "10px"}} onClick={this.handleChange} type="radio" name="forest_contribution" value="3" />
                      3% of rewards
                    </RadioLabel>
                    <RadioLabel>
                      <Field style={{marginBottom: "10px"}} onClick={this.handleChange} type="radio" name="forest_contribution" value="5" />
                      5% of rewards
                    </RadioLabel>
                  </Flex>
                  <ButtonContainer>
                    {
                      this.state.loading ? <Submit style={{color: "white", float: "right"}}>...Processing...</Submit>
                      :
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
                let button = <Submit onClick={() => {this.claimFunds(i) }} style={{color: "white", float: "right", marginRight: "10px"}}>CLAIM</Submit>

                if (info.daysLeft > 0) {
                  button = <Submit onClick={() => {this.transferFunds(i) }} style={{color: "white", float: "right", marginRight: "10px"}}>TRANSFER</Submit>
                }
                return (
                  <ClaimContainer>
                    <Titles>{info.date}</Titles>
                    <Titles>{info.amount} ELYS</Titles>
                    <Titles>{info.daysLeft} Days</Titles>
                    <ButtonContainer>
                      {button}
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
            <LabelCenter onClick={() => this.includeTransfer()}>Transfer</LabelCenter>
            {
              this.state.showTransfer ?
              <div>
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
              {/**<ButtonContainer>
                <Submit onClick={() => {this.transferFunds(0) }} style={{color: "white"}}>TRANSFER</Submit>
              </ButtonContainer>*/}
              <br/>

              </Form>
              )}
            </Formik>

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
                      <Submit onClick={() => {this.transferFunds(i) }} style={{color: "white", float: "right"}}>TRANSFER</Submit>
                    </ButtonContainer>
                  </ClaimContainer>
                )
              })
            }
          </div>
          :
          null
        }
        </Column2>
          <Row>
            <div style={{width: "100%", alignItems: "center", display: "flex", justifyContent: "center"}}>
              <a href="#" style={{color: "white", fontWeight: "bold"}}>Emergency unlock ? click here</a>
            </div>
          </Row>
          <BottomText>
            <Label style={{textAlign: "center", alignItems:"center", marginTop: "20px"}}>{this.state.rewards} ELYS earned as rewards</Label>
            <FeaturesGrid2>
            <FeatureItem>
              <Label style={{textAlign: "center", alignItems:"center"}}>{this.state.factoryBalance} ELYS available to be claimed</Label>
            </FeatureItem>
            </FeaturesGrid2>
          </BottomText>
          </ForestContainer>
        </div>
      )
    }
}

export default Forest


const ForestContainer = styled.div`
  border: solid 2px #ec7019;
  border-radius: 10px;
  display: grid;
  padding: 10px;
  margin: 20px;
  vertical-align: top;
`

const SacramentSymbol = styled.img`
  height: 40px;
  margin-bottom: 10px;
  padding-right: 30px;
`

const ImageandTitle = styled.div`
  display: flex;
  justify-content: left;
  align-items: flex-end;
  flex-direction: row;
  height: 60px;
`

//Position relative is a bit of a hack to align
const FeatureTitle = styled.h5`
  color: #ec7019;
  letter-spacing: 0px;
  line-height: 30px;
  margin-bottom: 10px;
  font-size: 25px;
  position: relative;
  top: -5px;
`

const Submit = styled.button`
width: 167px;
height: 32px;
float: right;
background: #ED6F1B;
border-radius: 45px;
`

const ButtonContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: row;
  width: 100%;
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
  padding: 50px;
  font-weight: bold;
  vertical-align: top;
`

const Column2 = styled.div`
  grid-column-start: 2;
  grid-row-start: 2;
  padding: 10px;
`
const Row = styled.div`
  grid-column-start: 2;
  grid-row-start: 3;
  padding: 10px;
`

const BottomText = styled.div`
  text-align: center;
  grid-row: 4;
  grid-column: 1 / 4;
`

const TopText = styled.div`
  text-align: center;
  grid-row: 1;
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
line-height: 30px;
margin-bottom: 10px;
font-size: 25px;
color: #ED6F1B;
font-weight: bold;
margin-bottom: 5px;
`

const LabelCenter = styled.label`
width: 100%;
text-align: left;
letter-spacing: 0px;
color: #FFFFFF;
display: flex;
flex-direction: column;
align-items: center;
line-height: 30px;
margin-bottom: 10px;
font-size: 25px;
color: #ED6F1B;
font-weight: bold;
margin-bottom: 5px;
`

const SubLabel = styled.label`
width: 100%;
text-align: left;
letter-spacing: 0px;
color: #FFFFFF;
font-size: 12px;
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
