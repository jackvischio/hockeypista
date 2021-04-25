import React, { Component } from 'react'
import { CaricaPartite } from './Middleware/MwInCorso';
import logo from "./assets/logo_512.jpg"

export default function SplashScreen(WrappedComponent) {
    return class extends Component {
        constructor(props) {
            super(props);

            // per mostrare la splach solo al primo caricamento
            // (almeno in web, vedremo su mobile)
            let count = 0;
            try {
                let x = (sessionStorage.getItem("logged"));
                if (x !== null) count = parseInt(x);
            } catch (e) { }
            count++;
            sessionStorage.setItem("logged", count);
            this.state = {
                loading: (count <= 2),
                messaggio: ".. caricamento .."
            };
        }

        componentDidMount() {
            window.scrollTo(0, 0);
            document.title = "Homepage - HockeyPista 2.0";

            setTimeout(() => { this.messaggio(-1) }, 1200);

            CaricaPartite.Tutte(true, () => { this.setState({ loading: false }) }, () => { });
        }

        messaggi = [
            ".. carico i campionati ..",
            ".. time-out per la squadra di casa ..",
            ".. scelgo con che pallina giocare ..",
            ".. appello delle squadre ..",
            ".. riscaldamento dei giocatori ..",
            ".. la telecamera non era accesa, ricominciamo .."
        ]

        messaggio(prev) {
            let max = this.messaggi.length;
            let next = 0;
            do {
                next = Math.floor(Math.random() * max);
            } while (next == prev);
            this.setState({ messaggio: this.messaggi[next] });
            setTimeout(() => { this.messaggio(next); }, 750 + (Math.random() * 750));
        }

        render() {
            // while checking user session, show "loading" message
            if (this.state.loading) return LoadingMessage(this.state.messaggio);

            // otherwise, show the desired route
            return <WrappedComponent {...this.props} />;
        }
    }
}

function LoadingMessage(msg) {
    return (
        <div className="container p-2" style={{ height: "100vh", alignItems: 'middle' }}>
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                <div className="card card-body text-center" style={{ width: 'auto', maxWidth: '300px' }} >
                    <div className="m-auto p-3" style={{ width: 'auto', maxWidth: '200px' }}>
                        <img src={logo} className="rounded w-100" />
                        <br />
                        <h3><strong>HockeyPista 2.0</strong></h3>
                    </div>
                    <div className="m-auto p-3 w-100">
                        <div className="spinner-border text-primary " role="status" style={{ height: '50px', width: '50px', fontSize: '1.4em' }}> </div>
                    </div>
                    <div className="m-auto p-3 w-100 text-muted font-italic" style={{ height: '96px' }}>
                        {msg}
                    </div>
                </div>
            </div>
        </div>
    );
}