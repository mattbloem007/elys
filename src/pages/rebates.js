
import React from 'react'
import {isMobile} from 'react-device-detect';
import styled from "styled-components"
import { Formik, Field, Form, ErrorMessage } from "formik"
import { Container, Section } from "../global"
import Info from '../components/info'


class Rebates extends React.Component {

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
                  <TableGrid>
                    <TableData>Sceletium.com</TableData>
                    <TableData>50% back</TableData>
                    <TableData>20000 ELYS per buyer<ActionButton>Check my Rebates</ActionButton></TableData>
                    <TableData>50,000 ELYS</TableData>
                    <TableData>50% back</TableData>
                  </TableGrid>

                  <OuterContainer>
                    <BorderedContainer>
                      <Title>Fairy Godmother inc</Title>
                      <GridTitles>
                        <ColTitle>Purchase Date</ColTitle>
                        <ColTitle>Purchase Amount</ColTitle>
                        <ColTitle>Rebate Due</ColTitle>
                      </GridTitles>
                      <GridTitles>
                        <TableData>10 August 2021</TableData>
                        <TableData>500 ELYS</TableData>
                        <TableData>claimed</TableData>
                        <InFormButton>Claim</InFormButton>
                      </GridTitles>
                    </BorderedContainer>
                  </OuterContainer>

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
                      <Flex>
                        <FeaturesGrid>
                        <FeatureItem>
                          <Label >Total Rebate Fund <span style={{position: 'relative', top: -5, left: -5}}>
                          <Info>This is the rate as an annualized percentage.  Your actual rate is: (APR x time locked in days)/365.</Info></span></Label>
                          <Field name="rebate_fund" placeholder="How many ELYS for all rebates?" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "223px", height: "33px", paddingLeft: "10px"}}/>
                        </FeatureItem>
                        </FeaturesGrid>
                      </Flex>
                      <br />
                      <Flex>
                        <FeaturesGrid>
                        <FeatureItem>
                          <Label>Percentage of Purchase <span style={{position: 'relative', top: -5, left: -5}}>
                          <Info>This is the rate as an annualized percentage.  Your actual rate is: (APR x time locked in days)/365.</Info></span></Label>
                          <Field name="percentage" placeholder="Rebate percent" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "400px", height: "33px", paddingLeft: "10px"}}/>
                        </FeatureItem>
                        </FeaturesGrid>
                      </Flex>
                      <br />
                      <Flex style={{display: "flex"}}>
                      <FeaturesGrid>
                      <FeatureItem>
                        <Label >Max per Purchase <span style={{position: 'relative', top: -5, left: -5}}>
                        <Info>This is the rate as an annualized percentage.  Your actual rate is: (APR x time locked in days)/365.</Info></span></Label>
                        <Field name="max_purchase" placeholder="Max Claim" type="text" style={{background: "#FACBAC 0% 0% no-repeat padding-box", border: "2px solid #ED6F1B", borderRadius: "30px", width: "223px", height: "33px", paddingLeft: "10px"}}/>
                      </FeatureItem>
                      </FeaturesGrid>
                      <FeaturesGrid>
                      <FeatureItem>
                        <Label>Max per Person <span style={{position: 'relative', top: -5, left: -5}}>
                        <Info>This is the rate as an annualized percentage.  Your actual rate is: (APR x time locked in days)/365.</Info></span></Label>
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
                        <ActionButton style={{color: "white", float: "right", width: "200px"}}>Fund & Create Rebate</ActionButton>
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
