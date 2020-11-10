import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/global.css'

import Calendario from './Pages/Calendario';
import Campionati from './Pages/Campionati';
import Campionato from './Pages/Campionato';
import Home from './Pages/Home';
import Partita from './Pages/Partita';
import Squadra from './Pages/Squadra';

export default class App extends Component {
	render() {
		return (
			<>
				<Router>
					<Route exact path="/" component={Home} />
					<Route path="/calendario/:id" component={Calendario} />
					<Route path="/campionati" component={Campionati} />
					<Route path="/campionato/:id" component={Campionato} />
					<Route path="/partita/:id" component={Partita} />
					<Route path="/squadra/:id" component={Squadra} />
				</Router>
			</>
		)
	}
}
