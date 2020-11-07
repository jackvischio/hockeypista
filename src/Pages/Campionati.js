import React, { Component } from 'react'

import Navbar from '../Components/Navbar'
import Loader from '../Components/Loader'
import { CampLarge as CampElement } from '../Components/Campionati/CampLarge'

import { caricaCampionati } from '../API/ApiCampionati'

class Campionati extends Component {

    constructor() {
        super();

        this.state = {
            campionati: [],
            loaded: false
        };
    }

    componentDidMount() {
        fetch("http://www.server2.sidgad.es/fisr/fisr_ls_1.php").then((res) => {
            return res.text();
        }).then(data => {
            let camp = caricaCampionati(data);

            camp.forEach(c => this.state.campionati.push(c));

            this.setState({
                loaded: true
            });

            console.log(this.state);
        });
    }

    render() {
        return (
            <>
                <Navbar active={"Campionati"} />
                <div className="container">
                    <div className="row">
                        {(!this.state.loaded) ? <Loader /> : this.state.campionati.map((camp, i) => <CampElement key={i} {...camp} />)}
                    </div>
                </div>
            </>
        )
    }
}

export default Campionati;
