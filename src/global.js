import styled from "styled-components"

export const Container = styled.div`
  position: relative;
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 0 0px;


  @media (min-width: 575px) {
    max-width: 100%;
  }

  @media (min-width: 767px) {
    max-width: 100%;
  }

  @media (min-width: 991px) {
    max-width: 100%;
  }

  @media (min-width: 1199px) {
    max-width: 100%;
  }

  ${props =>
    props.fluid &&
    `
    max-width: 1200px !important;
  `};
`

export const Section = styled.section`
  padding: 0px 0;
  overflow: hidden;
  background-color: #ffff;

  @media (max-width: 991px) {
    padding: 0px 0;
  }

`
