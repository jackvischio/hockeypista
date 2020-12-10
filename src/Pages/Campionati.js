import React, { Component } from 'react'

import { caricaCampionati } from '../API/ApiCampionati'

import Navbar from '../Components/Varie/Navbar'
import Loader from '../Components/Varie/Loader'
import { CampLarge as CampElement } from '../Components/Campionati/CampLarge'

class Campionati extends Component {

    constructor(props) {
        super();

        this.state = {
            campionati: [],
            loaded: false
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        
        fetch("https://www.server2.sidgad.es/fisr/fisr_ls_1.php").then((res) => {
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
                <Navbar  title={"Campionati"} active={"Campionati"} />
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
