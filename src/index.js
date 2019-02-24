import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import './css/pure-min.css';
import App from './App';
import { BrowserRouter as Router, Route,Switch, Redirect, matchPath } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import Login from './componentes/Login';
import Logout from './componentes/Logout';
import LivrosBox from './Livro';
import FormValidacao from './FormValidacao';

function verificaAutenticacao(nextState, replace){
    if(localStorage.getItem('auth-token') !== null){
        return true;
    }
}

// function verificaAutenticacao(nextState, replace) { 
//     console.log("cai aqui");
//     const match = matchPath('/timeline', {
//         path: nextState.match.url,
//         exact: true
//     })  

//     let valida = false
//     if (match !== null) {
//         valida = match.isExact
//     }

//     if (valida && localStorage.getItem('auth-token') === null) { 
//         // return <Redirect to={{
//         //     pathname: '/',
//         //     state:  {msg: 'Faça login para acessar esta página'}
//         // }}/>
//         return false;
//     }
//     // return <App/>
//     return true;
// }
ReactDOM.render(
    
    (<Router>
            <Switch>
                <Route exact path="/" component={Login}/>
                {/* <Route path="/timeline" render={() => (
                    verificaAutenticacao() ? (
                        <App />
                    ) : (
                        <Redirect to={{
                            pathname: '/',        
                            state:{msg:'usuário não autenticado'}
                          }}/>
                    )
                )}/> */}
                {/* <Route path="/timeline/:login?" render={verificaAutenticacao}/> */}
                <Route path="/timeline/:login?" render={(props) => (
                    verificaAutenticacao() ? (
                        <App {...props}/>
                    ) : (
                        <Redirect to={{
                            pathname: '/',        
                            state:{msg:'usuário não autenticado!'}
                        }}/>
                    )
                )}/>
                {/* <Route exact path="/timeline" render={verificaAutenticacao}/> */}
                {/* <Route exact path="/livro"  render={() => (
                    verificaAutenticacao() ? (
                        <LivrosBox />
                    ) : (
                        <Redirect to={{
                            pathname: '/',        
                            state:{msg:'usuário não autenticado'}
                          }}/>
                    )
                )}/> */}
                <Route exact path="/formvalidacao" component={FormValidacao}/>
                <Route exact path="/logout" component={Logout}/>
            </Switch>
    </Router>), 
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
