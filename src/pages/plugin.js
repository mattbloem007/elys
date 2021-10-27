import React, { useState, useEffect } from "react"
import { Formik, Field, Form, ErrorMessage } from "formik"
import styled from "styled-components"
import elysBrown from '../images/pay-with-elys-brown.png'
import elysOrange from '../images/pay-with-elys-orange.png'
import elysWhite from '../images/pay-with-elys-white.png'
import { Container, Section } from "../global"

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&")
}

const generateButton = (data, setField, currency) => {
  console.log(data)
  let code = '<div class="elysPaymentGateway" currency="' + currency + '" data-price="' + data.price + '" product-title="' + data.product_name + '" merchant-wallet="' + data.walletAddress + '" button-color="' + data.elysButton +  '"instructions="' + data.instructions +  '" ></div>\n<link href="https://cdn.jsdelivr.net/gh/mattbloem007/elys-payment-widget@main/elys/index.css" rel="stylesheet" />\n<script src="https://cdn.jsdelivr.net/gh/mattbloem007/elys-payment-widget@main/elys/index.js"></script>'
  console.log(code)
  localStorage.setItem("ButtonCode", code)
  setField("code", code)


}

const copyToClipboard = () => {
  //navigator.clipboard.writeText(copyText.value);
  let code = localStorage.getItem('ButtonCode')
  //console.log("CODDE" , code)
  navigator.clipboard.writeText(code);
}


function PluginPage() {
  const [token, setToken] = useState(null)
  const [currency, setCurrency] = useState(null)

  return (
    <Section id="features">
      <StyledSection>
        <SectionTitle style={{color: "#ED6F1B"}}>“Pay With ELYS” Website button</SectionTitle>
          <FeatureText style={{color: "white"}}>This tool produces code that you can plug-in to any website, it allows:</FeatureText>
          <FeatureText>- Payments in ELYS</FeatureText>
          <FeatureText>- Pricing in ELYS</FeatureText>
          <FeatureText>Once people have paid you - you will be able to unlock and read their fulfilment instructions</FeatureText>
        <GetStartedContainer>
            <Formik
              initialValues={{ instructions: "", price: "", product_id: "", product_name: "", walletAddress: "" }}
              onSubmit={(data, {resetForm, setFieldValue}) => {
                generateButton(data, setFieldValue, currency)
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
                <h2 style={{fontSize: '16px', color: 'rgb(237, 111, 27)',
                letterSpacing: '0px', textAlign: 'center',
                marginTop: '10px',
                marginBottom: '20px',
                fontStyle: 'italic'}}>Choose a Button Type</h2>

                <Field type="hidden" name="form-name" />
                <Field type="hidden" name="bot-field" />

                <SacramentSymbolsContainer>
                  <Flex role="group" aria-labelledby="my-radio-group">
                    <RadioLabel>
                      <SacramentSymbol src={elysWhite} />
                      <Field style={{marginBottom: "10px"}} type="radio" name="elysButton" value="White" />
                      White
                    </RadioLabel>
                    <RadioLabel>
                      <SacramentSymbol src={elysOrange} />
                      <Field style={{marginBottom: "10px"}} type="radio" name="elysButton" value="Orange" />
                      Orange
                    </RadioLabel>
                    <RadioLabel>
                      <SacramentSymbol src={elysBrown} />
                      <Field style={{marginBottom: "10px"}} type="radio" name="elysButton" value="Brown" />
                      Brown
                    </RadioLabel>
                  </Flex>
                </SacramentSymbolsContainer>
                <br />

                <Flex>
                  <FeaturesGrid>
                  <FeatureItem>
                    <Label htmlFor="product_name">Item Name</Label>
                    <Field name="product_name" placeholder="The Name of Item" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "223px", height: "33px", paddingLeft: "10px"}}/>
                  </FeatureItem>
                  </FeaturesGrid>
                  <FeaturesGrid>
                  <FeatureItem>
                    <Label htmlFor="product_id">Item ID</Label>
                    <Field name="product_id" placeholder="The ID of Item" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "223px", height: "33px", paddingLeft: "10px"}}/>
                  </FeatureItem>
                  </FeaturesGrid>
                  <ErrorMessage name="address" />
                </Flex>
                <br />
                <Flex style={{marginBottom: "50px"}}>
                  <FeaturesGrid>
                  <Label>Choose currency</Label>
                  <FeatureRadio>
                  <StyledRadioLabel>
              			<Input type="radio" name="currency" value="USD" onClick={() => setCurrency("USD")} />
              			<Span>USD</Span>
              		</StyledRadioLabel>
                  <StyledRadioLabel>
              			<Input type="radio" name="currency" value="ELYS" onClick={() => setCurrency("ELYS")} />
              			<Span>ELYS</Span>
              		</StyledRadioLabel>
                  </FeatureRadio>
                  <FeatureItem>
                    <Label htmlFor="price">Price in {currency}</Label>
                    <Field name="price" placeholder="Cost of product" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "223px", height: "33px", paddingLeft: "10px"}}/>
                    <ErrorMessage name="telegram" />
                  </FeatureItem>
                  </FeaturesGrid>
                </Flex>
                <br />
                <Flex style={{marginBottom: "50px"}}>
                  <FeaturesGrid>
                  <FeatureItem>
                    <Label style={{width: "700px"}} htmlFor="walletAddress">Wallet Address to Receive Payments</Label>
                    <Field name="walletAddress" placeholder="This wallet will also be the one to read buyer instructions" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "400px", height: "33px", paddingLeft: "10px"}}/>
                    <ErrorMessage name="walletAddress" />
                  </FeatureItem>
                  </FeaturesGrid>
                </Flex>
                <br />
                <Flex>
                  <FeaturesGrid>
                  <FeatureItem>
                    <Label htmlFor="instructions">Fulfillment Instructions</Label>
                    <Field as="textarea" name="instructions" placeholder="Tell your buyer what you need from them in order to fulfill     e.g. physical address, email address, telegram account, waist size, etc." type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "600px", height: "70px", paddingLeft: "10px", paddingTop: "10px"}}/>
                    <ErrorMessage name="currency" />
                  </FeatureItem>
                  </FeaturesGrid>
                </Flex>
                <br/>
                <Flex>
                  <Submit style={{color: "white"}} type="submit">Create Button</Submit>
                </Flex>
                <br/>
                <Flex>
                  <FeaturesGrid>
                  <FeatureItem>
                    <Label htmlFor="code" style={{paddingRight: "50px"}}>Website Code</Label>
                    <Field as="textarea" name="code" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "600px", height: "70px", paddingLeft: "10px", paddingTop: "10px"}}/>
                    <ErrorMessage name="code" />
                  </FeatureItem>
                  </FeaturesGrid>
                </Flex>
                <br/>
                <ButtonContainer>
                  <Submit onClick={() => copyToClipboard()} style={{color: "white", float: "right"}}>Copy to Clipboard</Submit>
                </ButtonContainer>
                <br/>
              </Form>
              )}
            </Formik>
        </GetStartedContainer>
      </StyledSection>
    </Section>

  )
}

export default PluginPage

const StyledContainer = styled(Container)``

const StyledSection = styled(Section)`
  background-color: #231B17;
`

const SectionTitle = styled.h3`
  color: #231B17;
  display: flex;
  justify-content: center;
  text-align: center;
  margin-bottom: 0px;
`

const Subtitle = styled.h5`
  font-size: 16px;
  color: "#ED6F1B";
  letter-spacing: 0px;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
  font-style: italic;
`

const HeaderInput = styled.input`
  width: 262px;
  height: 30px;
  background: #FACBAC 0% 0% no-repeat padding-box;
  border: 2px solid #ED6F1B;
  border-radius: 30px;
  opacity: 1;
  @media (max-width: 570px) {
    margin-bottom: 8px;
  }
  @media (max-width: 570px) {
    display: block;
    width: 100%;
  }
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

const RadioLabel = styled.label`
width: 100%;
text-align: left;
letter-spacing: 0px;
color: #FFFFFF;
display: flex;
flex-direction: column;
align-items: center;

`

const Styled = styled.div`
  display: inline-block;
  > input {
    opacity: 0;
  }
  > input + label {
    position: relative; /* permet de positionner les pseudo-éléments */
    padding-left: 25px; /* fait un peu d'espace pour notre case à venir */
    cursor: pointer;    /* affiche un curseur adapté */
    &:before {
      content: '';
      position: absolute;
      left:0; top: 1px;
      width: 17px; height: 17px; /* dim. de la case */
      border: 1px solid #aaa;
      background: #f8f8f8;
      border-radius: 3px; /* angles arrondis */
      box-shadow: inset 0 1px 3px rgba(0,0,0,.3) /* légère ombre interne */
    }
    &:after {
      content: '✔';
      position: absolute;
      top: -1px; left: 2px;
      font-size: 16px;
      color: #09ad7e;
      transition: all .2s; /* on prévoit une animation */
    }
  }
  > input:not(:checked) + label {
      &:after {
        opacity: 0; /* coche invisible */
        transform: scale(0); /* mise à l'échelle à 0 */
      }
  }
  > input:disabled:not(:checked) + label {
      &:before {
        box-shadow: none;
        border-color: #bbb;
        background-color: #ddd;
      }
  }
  > input:checked + label {
    &:after {
      opacity: 1; /* coche opaque */
      transform: scale(1); /* mise à l'échelle 1:1 */
    }
  }
  > input:disabled:checked + label {
    &:after {
      color: #999;
    }
  }
  > input:disabled + label {
    color: #aaa;
  }
  > input:checked:focus + label, input:not(:checked):focus + label {
    &:before {
      border: 1px dotted blue;
    }
  }
`

const CheckLabel = styled.label`
  background: #FACBAC;
  text-align: left;
  letter-spacing: 0px;
  color: "black";
`;

const CheckInput = styled.input`
&:checked + ${CheckLabel} {
    background: #FACBAC;
  }
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

const GetStartedContainer = styled(Container)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  gap: 100px;
  padding: 0px 0 40px;
  width: 900px;
  margin-left: 50px;
  margin-bottom: 300px;
  background: #ED6F1B00 0% 0% no-repeat padding-box;
  border: 1px solid #ED6F1B;
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

const FeatureRadio = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
`

const ButtonContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  flex-direction: row;
`

const SacramentSymbolsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 570px) {
    padding-right: 5px;
  }
`

const SacramentSymbol = styled.img`
  height: 40px;
  margin-bottom: 10px;
  margin-top: 20px;

  @media (max-width: 570px) {
    padding-right: 5px;
  }
`

const StyledRadioLabel = styled.label`
  display: flex;
  cursor: pointer;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.375em;
`

const Input = styled.input`
position: absolute;
		left: -9999px;
		&:checked + span {
			background-color: #facbac;
      opacity: 0.9;
			&:before {
				box-shadow: inset 0 0 0 0.4375em #ec7019;
			}
		}
`

const Span = styled.span`
display: flex;
		align-items: center;
		padding: 0.375em 0.75em 0.375em 0.375em;
		border-radius: 99em;
		transition: 0.25s ease;
    font-weight: bold;
    font-size: 20px;
		&:hover {
			background-color: #facbac;
      opacity: 0.9;
		}
		&:before {
			display: flex;
			flex-shrink: 0;
			content: "";
			background-color: #251D14;
			width: 1.5em;
			height: 1.5em;
			border-radius: 50%;
			margin-right: 0.375em;
			transition: 0.25s ease;
			box-shadow: inset 0 0 0 0.125em #ec7019;
		}
`
