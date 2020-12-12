import React, { Component } from 'react'
import Navbar from '../Components/Varie/Navbar';

export default class Configura extends Component {
    constructor(props) {
        super();
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <>
                <Navbar title={"Risultati Hockey pista"} />
                <div className="container text-center">
                    <a href="https://www.server2.sidgad.es/fisr/fisr_ls_1.php" target="blank" className="btn btn-danger">
                        Vada vada, non cincischi
                    </a>
                </div>
            </>
        )
    }
}