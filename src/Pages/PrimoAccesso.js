import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import GtagInitialize from '../API/ApiAnalytics'
import Navbar from '../Components/Varie/Navbar';

export default class PrimoAccesso extends Component {
    constructor(props) {
        super();

        // TITLE AND ANALYTICS
        document.title = "Primo accesso";
        GtagInitialize();
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = "Benvenuto su HockeyPista 2.0";
    }

    render() {
        return (
            <>
                <Navbar title={"Risultati Hockey pista"} />
                <div className="container">
                    <div className="card">
                        <div className="card-body">
                            <h4>
                                Benvenuti su HockeyPista 2.0!
                            </h4>
                            <h5>Qualche informazione per iniziare:</h5>
                            <div className="row justify-content-center">
                                <Box title="Attivazione del sito." icon="fa-key">
                                    <p>
                                        Il sito ha bisogno del tuo aiuto per funzionare!
                                    </p>
                                    <p>
                                        Quando visualizzi l'avviso che dice che il sito non è attivo, segui i passaggi della guida per riattivarlo.
                                    </p>
                                    <p>
                                        Purtroppo, a causa di un problema esterno a questo sito, l'operazione dovrà essere ripetuta circa una volta a settimana, a seconda del browser che usi.
                                    </p>
                                </Box>
                                <Box title="Installa il sito come applicazione." icon="fa-cloud-download-alt">
                                    <p>
                                        Puoi salvare questo sito come applicazione per accederci in modo più veloce, specialmente da smartphone.
                                    </p>
                                    <p>
                                        Per farlo, vai nel menù del browser e clicca su "Aggiungi a schermata home".
                                    </p>
                                </Box>
                                <Box title="Prima attivazione." icon="fa-key">
                                    <p>
                                        Puoi effettuare già adesso la prima attivazione del sito, così da iniziare ad usare subito HockeyPista2.0
                                    </p>
                                    <Link to="/guida" className="btn btn-outline-primary">Leggi la guida</Link>
                                </Box>
                            </div>
                            <div className="w-100 text-center mt-4">
                                <Link to="/" className="btn btn-primary w-100 text-uppercase" style={{ maxWidth: "300px" }}>Vai al sito</Link>
                            </div>
                            <div className="alert alert-warning mt-4" role="alert">
                                <h6 className="font-weight-bold">
                                    <i className="fas fa-exclamation-triangle"></i> &nbsp; Disclaimer.
                                </h6>
                                <p>
                                    HockeyPista 2.0 è una piattaforma alternativa non ufficiale per la visualizzazione dei campionati e dei risultati delle partite di hockey su pista in Italia.
                                </p>
                                <p>
                                    HockeyPista 2.0 utilizza i contenuti pubblicamente disponibili sulla <a href="http://hockeypista.fisr.it/">piattaforma ufficiale</a>, rielaborandoli solamente in veste grafica.
                                </p>
                                <p>
                                    HockeyPista 2.0 è un progetto ancora in fase sperimentale, pertanto alcuni contenuti potrebbero non essere consistenti, mostrare errori di presentazione e/o di elaborazione.
                                    Se riscontri qualche errore importante, puoi segnalarlo <a href="https://github.com/gvischio/hockeypista/issues">qui</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

function Box(props) {
    return (
        <div className="col col-12 col-md-6 col-lg-4">
            <div className="card card-body" style={{ height: "calc(100% - 0.5rem)" }}>
                <h6 className="font-weight-bold">
                    <i className={"fas text-primary " + props.icon}></i> &nbsp;
                    {props.title}</h6>
                {props.children}
            </div>
        </div>
    )
}