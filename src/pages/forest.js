import cannabis from '../images/cannabis-white-icon.png'
import iboga from '../images/iboga-white-icon.png'
import {isMobile} from 'react-device-detect';
import { Container, Section } from "../global"
import styled from "styled-components"
import { Formik, Field, Form, ErrorMessage } from "formik"


const orange = '#ec7019'

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&")
}

const Forest = (props) => {
    let style={
        padding: 5,
        fontSize: '12px',
        marginLeft: 10
    }
    return (
        <ForestContainer>
        <Column>
          <Formik
            initialValues={{ lock_amount: "", deposit_duration: "", product_id: "", product_name: "", walletAddress: "" }}
            onSubmit={(data, {resetForm, setFieldValue}) => {
                fetch("/", {
                  method: "POST",
                  headers: { "Content-Type": "application/x-www-form-urlencoded" },
                  body: encode({
                    "form-name": "contact-form",
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
              name="contact-form"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
            >
            <img src={props.icon} alt='icon' width={30} />
            <div style={{
                display: 'inline-block',
                color: orange,
                verticalAlign: 'top',
                marginTop: 3,
                marginLeft: 20,
                fontSize: 20,
                marginBottom: 20
            }}>{props.title}</div>
            <div style={style}>Rewards locked ELYS</div>
            <div style={style}>Your rewards are paid in ELYS</div>
            <div style={style}>Buy ELYS at ZooDex</div>



              <Field type="hidden" name="form-name" />
              <Field type="hidden" name="bot-field" />

              <Flex>
                <FeaturesGrid>
                <FeatureItem>
                  <Label htmlFor="lock_amount">Lock Amount</Label>
                  <SubLabel>Balance: 230,000 ELYS</SubLabel>
                  <Field name="lock_amount" placeholder="0.0" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "223px", height: "33px", paddingLeft: "10px"}}/>
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
                  <Submit style={{color: "white", float: "right"}}>Approve</Submit>
                </ButtonContainer>
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
          <ClaimContainer>
            <Titles>20-06-2021</Titles>
            <Titles>10, 000 ELYS</Titles>
            <Titles>539 Days</Titles>
          </ClaimContainer>
          <ButtonContainer>
            <Submit style={{color: "white", float: "right"}}>CLAIM</Submit>
            <Submit style={{color: "white", float: "right"}}>TRANSFER</Submit>
          </ButtonContainer>
          <br/>
        </Column2>
        <BottomText>
          <Header>The Patch is 50% planted</Header>
          <FeaturesGrid>
          <FeatureItem>
            <FeatureText>Once full the patch will be open but no further rewards issued</FeatureText>
          </FeatureItem>
          </FeaturesGrid>
        </BottomText>
        </ForestContainer>
    )
}


const ForestPage = (props) => {
    return (<div style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 40}}>
        <Forest icon={iboga} title={'The Forest'} pair={'FTM-ELYS'} pairType={'Single token Lock'} lockTime={'12, 24, 36 Months'} return={'12%, 32%, 60%'} apr={'12% - 20%'} paidIn={'ELYS'}/>

    </div>)
}

const ForestContainer = styled.div`
  border: solid 2px orange;
  border-radius: 10px;
  display: grid;
  grid-template-columns: repeat(1,25em);
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
  grid-template-columns: repeat(3,8em);
  padding: 10px;
  margin: 20px;
`

const Titles = styled.div`
  padding: 5px,
  font-size: 15px;
`

const Column = styled.div`
  border-right: solid 2px orange;
  padding: 10px;
  font-weight: bold;
  vertical-align: top;
`

const Column2 = styled.div`
  grid-column-start: 2;
  grid-row-start: 1;
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
  grid-template-columns: 100px 100px 100px;
  margin-bottom: 20px;
  @media (max-width: 570px) {
    grid-template-columns: 1fr;
    grid-gap: 64px;
  }
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

export default ForestPage
