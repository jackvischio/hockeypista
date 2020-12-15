import React, { Component } from 'react'
import Navbar from '../Components/Varie/Navbar';

import guida_1 from '../assets/guida/guida_1.jpg'
import guida_2 from '../assets/guida/guida_2.jpg'
import guida_3 from '../assets/guida/guida_3.jpg'
import { Link } from 'react-router-dom';

export default class Guida extends Component {
    constructor(props) {
        super();
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const img_style = {
            height: "100%",
            maxHeight: "400px",
            width: "auto",
            margin: "0 auto",
            border: "1px solid #ccc"
        };

        return (
            <>
                <Navbar title={"Risultati Hockey pista"} />
                <div className="container">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="m-0 p-0">Attivazione del sito</h2>
                        </div>
                        <div className="card-body">
                            <p>Purtroppo, a causa di un problema esterno a questa piattaforma e causato dal sito originale, è necessario eseguire i seguenti passaggi per poter utilizzare Hockeypista 2.0.</p>

                            <div className="alert alert-warning">
                                <b>Attenzione</b>: questa operazione non compromette la sicurezza del tuo dispositivo. Ma, in ogni caso, se non ti fidi, non procedere.
                                 Purtroppo, però, se non procedi non potrai usufruire di Hockeypista 2.0.
                            </div>

                            <h4 className="mt-4">0. Se possibile, utilizza Google Chrome</h4>
                            <p>Specialmente se stai utilizzando questa piattaforma su smartphone e/o tablet, utilizza Google Chrome come browser.</p>
                            <p>L'utilizzo di altri browser <i>potrebbe</i> portare a comportamenti indesiderati da parte della piattaforma.</p>

                            <h4 className="mt-4">1. Apri il link di attivazione</h4>
                            <p>Clicca sul seguente pulsante rosso. Si aprirà la pagina in una nuova scheda.</p>
                            <a href="https://www.server2.sidgad.es/fisr/fisr_ls_1.php" target="blank" className="btn btn-danger">
                                Procedi con l'attivazione
                            </a>

                            <h4 className="mt-4">2. Aggira l'avviso di sicurezza</h4>
                            <p>Il browser mostrerà un avviso di sicurezza come quello della prima foto.</p>
                            <ol>
                                <li>Clicca su "avanzate".</li>
                                <li>Clicca su "Procedi".</li>
                                <li>Nel momento in cui visualizzi la pagina bianca, hai completato la procedura. Puoi chiudere la scheda e tornare su questa pagina</li>
                            </ol>
                            <div className="row">
                                <div className="col col-12 col-md-4 text-center">
                                    <img src={guida_1} alt="guida 1" style={img_style} />
                                    <p className="m-0 p-0 pb-2" style={{ fontSize: "0.8em" }}>Passaggio 1</p>
                                </div>
                                <div className="col col-12 col-md-4 text-center">
                                    <img src={guida_2} alt="guida 2" style={img_style} />
                                    <p className="m-0 p-0 pb-2" style={{ fontSize: "0.8em" }}>Passaggio 2</p>
                                </div>
                                <div className="col col-12 col-md-4 text-center">
                                    <img src={guida_3} alt="guida 3" style={img_style} />
                                    <p className="m-0 p-0 pb-2" style={{ fontSize: "0.8em" }}>Passaggio 3</p>
                                </div>
                            </div>

                            <h4 className="mt-4">3. Utilizza HockeyPista 2.0</h4>
                            <p>A questo punto, la piattaforma è attiva e puoi iniziare ad utilizzarla.</p>
                            <Link to="/" className="btn btn-primary">Vai alla home</Link>

                            <hr />
                            <p>
                                Per segnalare malfunzionamenti e/o bug, utilizza la scheda <a href="https://github.com/gvischio/hockeypista/issues">issues</a> della repository di github.
                            </p>
                            <p>
                                Sei un po' nerd anche tu e vuoi contribuire a questo progetto? Richiedi di collaborare alla repository!
                            </p>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}