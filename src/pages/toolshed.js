
import React from 'react'
import {isMobile} from 'react-device-detect';
import styled from "styled-components"
import { Container, Section } from "../global"
import woo from "../images/woo.png"

class ToolShed extends React.Component {

    constructor(props){
      super(props);
    }

    render = () => {
        return (
            <div style={{display: 'block', width: (isMobile)?350:550, borderRadius: 20, marginLeft: 'auto', marginRight: 'auto', marginTop: 40, marginBottom: 20}}>
                This is a list of various plug-ins and tools available for ELYS. We will release more as we build the ecosystem of vendors and buyers.
                <Line/>
                <br/>
                <br/>
                <TextContainer>
                  <Title>Woo-Commerce Plugin</Title>
                  This is a plug-in for Wordpress’ Woo-commerce shopping cart, it allows:
                  <br/>
                  <br/>
                  - Payments in ELYS
                  <br/>
                  <br/>
                  - Automated pricing linked to USD
                </TextContainer>
                <TextContainer>
                  <a target="_blank" href="https://wordpress.org/plugins/wc-elys-payment-gateway"><img style={{width: '80%'}} src={woo} /></a>
                </TextContainer>
                <Line/>
                <br/>
                <br/>
                <TextContainer>
                  <Title onClick={()=>this.props.gotoPage("pay")} style={{cursor: "pointer"}}>"Pay With ELYS” Website Button</Title>
                  This tool produces code that you can paste in to a website, it creates a button that enables:
                  <br/>
                  <br/>
                  - Payments or Donations in ELYS
                  <br/>
                  <br/>
                  - Pricing in ELYS or USD (USD prices will be converted to ELYS when payment happens)
                  <br/>
                  <br/>
                  - Sending of instructions to the donor/buyer for next steps.  We suggest you give them
                    an email or instant message account (e.g. telegram) that they can contact you via.
                    Get the details you need from them for fulfilment such as email address, physical
                    address, contact number. We also suggest you ask them to send you the transaction ID so you
                    can cross-check their payment.
                    <br/>
                    <br/>
                    - If you wish to place more than one button on the same webpage the code needs a
                      slight tweak. Please contact us in our Discord at #tech-discussion and we will help
                      you out.
                    <br/>
                    <br/>
                  <ActionButton style={{cursor: "pointer"}} onClick={()=>this.props.gotoPage("pay")}>Build Button</ActionButton>
                </TextContainer>

            </div>
        )
    }
}

export default ToolShed

const TextContainer = styled.div`
    display: block;
    width: 600px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
    margin-bottom: 100px;
`
const Title = styled.div`
  color: #ec7019;
  font-weight: bold;
  font-size: 18px;
  margin-top: 20px;
  margin-bottom: 20px;
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

const Line = styled.div`
  width: 612px;
  height: 47px;
  border-bottom: 1px solid white;
  position: absolute;
  left: 250px;

  @media (max-width: 767px) {
    left: 100px;
    width: 312px;
  }
`
