import React, { Component } from 'react';

const orange = '#ec7019'
const cream = '#facbac'

class Info extends Component {
    state = {
        display: false,
        timeout: null
    }
    show = (e) => {
        e.stopPropagation()
        let tm = setTimeout(this.hide,4000)
        this.setState({display: true, timeout: tm})
    }
    hide = (e) => {
        if(e) e.stopPropagation()
        clearTimeout(this.state.timeout)
        this.setState({display: false, timeout: null})
    }
    render = () => {
        let info = (this.state.display)?(<div style={{
            position: 'absolute',
            left: 20, top: -50,
            width: 100,
            minHeight: 50,
            padding: 10,
            backgroundColor: '#ffffff',
            opacity: 0.7,
            borderRadius: 10,
            color: '#000000',
            fontSize: 15
        }}>
            {this.props.children}
        </div>):null
        return <div style={{position: 'relative', display: 'inline-block', marginLeft: 10}}>
            <div style={{
                border: 'solid 1px' + orange, 
                width: 12, height: 12, 
                borderRadius: 8, 
                textAlign: 'center', 
                backgroundColor: cream,
                color: '#000000',
                fontSize: 10,
                cursor: 'pointer'
            }} onMouseOver={this.show} onClick={this.show} onMouseOut={this.hide}>?</div>
            {info}
        </div>
    }
}

export default Info
