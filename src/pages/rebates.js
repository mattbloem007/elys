
import React from 'react'
import {isMobile} from 'react-device-detect';
import styled from "styled-components"
import { Container, Section } from "../global"


class Rebates extends React.Component {

    render = () => {
        return (
            <div style={{display: 'block', width: (isMobile)?350:550, borderRadius: 20, marginLeft: 'auto', marginRight: 'auto', marginTop: 40, marginBottom: 20}}>
                  <Title>Current Rebates</Title>
                  <TextContainer>
                    You may claim your rebates in ELYS here. If you made a purchase from a Vendor who is part
                    of the rebate program connect to elys.money with the wallet via which you made your
                    purchase and you will be able to claim your rebate for buying in ELYS.
                  </TextContainer>
                  <TableGrid>
                    <ColTitle>Vendor  <Triangle /></ColTitle>
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
                      <ActionButton>Claim</ActionButton>
                    </GridTitles>
                  </BorderedContainer>

            </div>
        )
    }
}

export default Rebates

const TextContainer = styled.div`
    display: block;
    width: 600px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
`

const Triangle = styled.div`
  width: 0px;
  height: 0px;
  display: inline-block;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;

  border-top: 10px solid #ffffff;
`

const ColTitle = styled.div`
  width: 130px;
  height: 47px;
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
  margin: 0px auto;
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
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  padding: 0px 0 40px;
  width: 1094px;
  height: 300px;
  margin-bottom: 300px;
  background: #ED6F1B00 0% 0% no-repeat padding-box;
  border: 1px solid #ED6F1B;
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
