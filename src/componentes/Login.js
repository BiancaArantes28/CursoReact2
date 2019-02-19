import React, { Component } from 'react';
import { history } from 'react-router-dom';

export default class Login extends Component{
    constructor(props){
        super(props);
        if(this.props.location.state){
            this.state = {msg: this.props.location.state.msg};
        }else{
            this.state = {msg: ''};
        }
        
    }
    envia(event){
        event.preventDefault();
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({login: this.login.value, senha: this.senha.value}),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };
        fetch('https://instalura-api.herokuapp.com/api/public/login', requestInfo)
        .then(response => {
            if(response.ok){
                return response.text();
            }else{
                throw new Error('não foi possível fazer o login');
            }
        })
        .then(token => {
            localStorage.setItem('auth-token', token);
            this.props.history.push('timeline');
        })
        .catch(error => {
            this.setState({msg: error.message});
        });
    }
    render(){
        return(
            <div className="login-box">
                <span>{this.state.msg}</span>
                <h1 className="header-logo">Instalura</h1>
                <form onSubmit={this.envia.bind(this)}>
                    <input type="text" ref={(input) => this.login = input}/>
                    <input type="password" ref={(input) => this.senha = input}/>
                    <input type="submit" value="Login"/>
                </form>
            </div>
        );
    }
}