
import React from 'react'
import {isMobile} from 'react-device-detect';
import styled from "styled-components"
import { Container, Section } from "../global"


class Woo extends React.Component {

    render = () => {
        return (
            <div style={{display: 'block', width: (isMobile)?350:550, borderRadius: 20, marginLeft: 'auto', marginRight: 'auto', marginTop: 40, marginBottom: 20}}>
                This is a list of various plug-ins and tools available for ELYS. We will release more as we build the ecosystem of vendors and buyers.

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
            </div>
        )
    }
}

export default Woo

const TextContainer = styled.div`
    display: block;
    width: 600px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
`
const Title = styled.div`
  color: #ec7019;
  font-weight: bold;
  font-size: 18px;
  margin-top: 20px;
  margin-bottom: 20px;
`
