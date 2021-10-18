import React from 'react';
import Info from './info'
import iboga from '../images/iboga-white-icon.png'
import {isMobile} from 'react-device-detect';
import styled from "styled-components"
import { Container, Section } from "../global"

const orange = '#ec7019'
const cream = '#facbac'

let formatElys = (s) => {
    let splitDec = s.split('.')
    console.log('left: ' + splitDec[0])
    let ar = []
    let cnt = 0
    splitDec[0].split('').reverse().forEach(s=>{
        if(ar[cnt] && ar[cnt].length===3)cnt++
        if(!ar[cnt])ar[cnt] = ''
        ar[cnt] = s + ar[cnt]
    })
    console.log(ar)
    let front = ar.reverse().join(',')
    let back = (splitDec.length>1)?'.' + splitDec[1]:''
    return front + back + ' ELYS'

   //return s + ' ELYS'
}

let trimDec = (n,dec) => {
    let ar = n.toString().split('.')
    if(ar.length===1) return ar[0]
    if(dec===0) return ar[0]
    ar[1] = ar[1].substr(0,dec)
    return ar.join('.')
}

let Radio = (props) => (
    <Label>
			<Input type="radio" value={props.value} name={props.name} checked={(props.value===props.selected)} onClick={(e)=>{e.stopPropagation();props.onChange(props.value)}}/>
			<Span>{props.value}</Span>
		</Label>
    // <div style={{position: 'relative', left: -20, display: 'block', textAlign: 'left', cursor: 'pointer', marginTop: 10, marginLeft: 20}}  onClick={(e)=>{e.stopPropagation();props.onChange(props.value)}}>
    //     <input type="radio" value={props.value} name={props.name} checked={(props.value===props.selected)} onClick={(e)=>{e.stopPropagation();props.onChange(props.value)}} style={{cursor: 'pointer'}}/>
    //     <div style={{color: '#ffffff', display: 'inline-block', marginLeft: 10}}>{props.value}</div>
    // </div>
)

let ForestLock = (props) => {
    let approveStyle = {
        width: 150,
        backgroundColor: orange,
        border: 'none',
        borderRadius: 20,
        height: 40,
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 15,
        marginRight: 20
    }
    let lockStyle = Object.assign({},approveStyle)
    lockStyle.color = '#000000'
    lockStyle.backgroundColor = cream
    if(props.lockAmount===0) approveStyle.opacity=0.5
    let approveLock = (props.approval===0)?(
        <button style={approveStyle} onClick={props.approve} disabled={props.lockAmount===0}>APPROVE</button>
    ):(props.approval===1)?(
        <button style={approveStyle}>AWAITING APPROVAL</button>
    ):(props.approval===2)?(
        <button style={lockStyle} onClick={props.lock}>LOCK</button>
    ):(<button style={lockStyle}>AWAITING LOCK</button>)

    return (
    <div style={{border: 'solid 2px ' + orange, display: 'block', paddingTop: 20, borderRadius: 20, width: '98%', position: 'relative'}}>
        <div style={{color: orange, fontWeight: 'bold', fontSize: 20, textAlign: 'center', marginLeft: 20}}>
            <img src={iboga} alt="" width={40} />
            <div style={{display: 'inline-block', marginLeft: 15, marginRight: 15, position: 'relative', top: -11}}>Lock in Forest</div>
            <img src={iboga} alt="" width={40} />
        </div>
        <div style={{display: 'inline-block', marginLeft: (isMobile)?20:30}}>

            <div style={{color: orange, fontWeight: 'bold', fontSize: 18, marginTop: 20}}>Lock Amount</div>
            <div style={{marginTop: 5}}>
                <input onChange={props.lockAmountChange} value={props.lockAmount} defaultValue={0.0} type={'text'}
                    style={{
                        border: 'solid 1px ' + orange,
                        backgroundColor: cream,
                        borderRadius: 10,
                        height: 20,
                        padding: 3,
                        width: 150,
                        paddingLeft: 10,
                        outline: 'transparent'
                    }}
                />
            </div>
            <div style={{color: '#ffffff', fontSize: 12, marginTop: 10, width: (isMobile)?180:250}}>
                You have {(props.balance===-1)?'loading..':formatElys(trimDec(props.balance/1e5,1))} available
            </div>

            <div style={{color: orange, fontWeight: 'bold', fontSize: 18, marginTop: 20}}>Deposit Duration</div>
            <div style={{
                width: 150,
                display: 'block',
                paddingBottom: 10,
                borderBottom: 'solid 2px ' + orange
            }}>
                <Radio onChange={props.selectDuration} value={'7 days'} selected={props.duration} />
                <Radio onChange={props.selectDuration} value={'14 days'} selected={props.duration} />
                <Radio onChange={props.selectDuration} value={'28 days'} selected={props.duration} />
            </div>
            <div style={{
                width: 150,
                display: 'block',
                borderBottom: 'solid 2px ' + orange,
                paddingBottom: 10
            }}>
                <Radio onChange={props.selectDuration} value={'3 months'} selected={props.duration} />
                <Radio onChange={props.selectDuration} value={'6 months'} selected={props.duration} />
                <Radio onChange={props.selectDuration} value={'9 months'} selected={props.duration} />
            </div>
            <div style={{
                width: 150,
                display: 'block'
            }}>
                <Radio onChange={props.selectDuration} value={'1 year'} selected={props.duration} />
                <Radio onChange={props.selectDuration} value={'2 years'} selected={props.duration} />
                <Radio onChange={props.selectDuration} value={'3 years'} selected={props.duration} />
            </div>
        </div>
        <div style={{display: 'inline-block', verticalAlign: 'top', paddingTop: 2, marginLeft: 20}}>
            <div style={{color: orange, fontWeight: 'bold', fontSize: 18, marginTop: 20, marginBottom: 10, width: 200}}>Reward Calculation</div>
                <div style={{position: 'relative', top: -22, fontColor: '#ffffff', marginTop: 30, display: 'block', width: 200}}>
                    {props.apr}% APR <span style={{position: 'relative', top: -5, left: -5}}>
                    <Info>This is the rate as an annualized percentage.  Your actual rate is: (APR x time locked in days)/365.</Info></span>
                </div>
                <div style={{display: 'block', color: '#fffffff', textAlign: 'left', verticalAlign: 'bottom', width: 200}}>
                    <div>Total Reward Amount</div>
                    <div style={{fontSize: 18, marginTop: 5}}>{formatElys(trimDec(props.reward,1))}</div>
                </div>
                <div style={{marginTop: 20}}>
                <div style={{color: orange, fontWeight: 'bold', fontSize: 18, marginTop: 20, width: 200}}>Forest Rescue <span style={{position: 'relative', top: -5, left: -5}}>
                    <Info>A percentage of your rewards goes to preventing deforestation.</Info></span>
                </div>
                <div style={{
                    minWidth: 200,
                    maxWidth: 400,
                    display: 'block'
                }}>
                    <Radio onChange={props.donationChange} value={'1% of rewards'} selected={props.donation} />
                    <Radio onChange={props.donationChange} value={'3% of rewards'} selected={props.donation} />
                    <Radio onChange={props.donationChange} value={'5% of rewards'} selected={props.donation} />
                </div>
            </div>
        </div>
        <div style={{textAlign: 'center', marginTop: 15, marginBottom: 20}}>
            {approveLock}
        </div>
    </div>)
}

export default ForestLock

const Label = styled.label`
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
