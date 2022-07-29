import {isMobile} from 'react-device-detect';

const Column = (props) => {
    return (
        <div style={{
            display: 'inline-block',
            width: (isMobile)?70:'20%',
            color: '#000000',
            verticalAlign: 'top',
            textAlign: 'left',
            marginLeft: 30
        }}>
            <div style={{fontSize: 16, fontWeight: 'bold', marginTop: (isMobile)?5:8, marginBottom: 6}}>{props.header}</div>
            {props.children}
        </div>
    )
}

const Link = (props) => {
    return <a href={'https://www.elyseos.com/' + props.href} style={{
        display: 'block',
        textDecoration: 'none',
        textAlign: 'left',
        color: '#000000',
        fontSize: 14,
        marginLeft: 4,
        marginTop: 2
    }}>{props.children}</a>
}

let footerTop = (isMobile)?window.innerHeight - 150:window.innerHeight - 100
if(!isMobile && footerTop<700)footerTop = 700

const Footer = () => (
    <div style={{
        display: 'block',
        width: '100%',
        backgroundColor: '#facbac',
        height: 100,
        bottom: 0
    }}>

        <div style={{
            maxWidth: 650,
            marginLeft: 'auto',
            marginRight: 'auto'
        }}>
            <Column header="General">
                <Link href="home">About</Link>
                <Link href="faq">FAQ</Link>
            </Column>
            <Column header="Technology">
                <Link href="token-timelines">Token</Link>
                <Link href="litepaper">Lightpaper</Link>
            </Column>
            <Column header="Community">
                <Link href="https://app.gitbook.com/c/5deeMaOeXG1Hj9HVcM5U">Guidebook</Link>
                <Link href="https://snapshot.org/#/elyseos.eth">Governance</Link>
                <Link href="litepaper">Lightpaper</Link>
            </Column>
            <Column header="Listings">
                <Link href="https://nomics.com/assets/elys-elyseos" style={{marginLeft: "0px"}}>Nomics</Link>
                <Link href="https://spooky.fi/#/" style={{marginLeft: "0px"}}>Spooky Swap</Link>
            </Column>

        </div>
    </div>
)

export default Footer
