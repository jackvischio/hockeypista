import React, { Component } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/global.css'

import Calendario from './Pages/Calendario';
import Campionati from './Pages/Campionati';
import Campionato from './Pages/Campionato';
import Home from './Pages/Home';
import Partita from './Pages/Partita';
import Squadra from './Pages/Squadra';
import SocietaAll from './Pages/SocietaAll';
import Societa from './Pages/Societa';
import Salvati from './Pages/Salvati';
import Guida from './Pages/Guida';
import Impostazioni from './Pages/Impostazioni';
import PrimoAccesso from './Pages/PrimoAccesso';
import Giocatore from './Pages/Giocatore';

import SplashScreen from './SplashScreen';

class App extends Component {
	render() {
		return (
			<>
				<Router basename="/">
					<Switch>
						<Route exact path="/" component={Home} />
						<Route path="/calendario/:id" component={Calendario} />
						<Route path="/campionati" component={Campionati} />
						<Route path="/campionato/:id" component={Campionato} />
						<Route path="/partita/:id" component={Partita} />
						<Route path="/squadra/:id" component={Squadra} />
						<Route exact path="/societa" component={SocietaAll} />
						<Route path="/societa/:id" component={Societa} />
						<Route path="/giocatore/:id" component={Giocatore} />
						<Route path="/salvati" component={Salvati} />
						<Route path="/guida" component={Guida} />
						<Route path="/impostazioni" component={Impostazioni} />
						<Route path="/primoaccesso" component={PrimoAccesso} />
						<Redirect to="/" />
					</Switch>
				</Router>
			</>
		)
	}
}

export default SplashScreen(App);