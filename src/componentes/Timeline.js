import React, { Component } from 'react';
import FotoItem from './FotoItem';

export default class Timeline extends Component {

    constructor(props){
        super(props);
        this.state = {fotos: []};
    }
    componentDidMount(){
        // const { login } = this.props.match.params
        let urlPerfil;
        if(this.props.login === undefined){
            urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        }else{
            urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${this.props.login}`;
        }
        fetch(`https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`)
        .then(response => response.json())
        .then(fotos => {
            this.setState({fotos: fotos});
        });
        
    }
    render(){
        return (
        <div className="fotos container">
            {
                this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto}/>)
            }
        </div>            
        );
    }
}