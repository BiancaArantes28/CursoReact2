import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';

const emailRegex = RegExp(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/);
const formValid = formErrors => {
    let valid = true;

    Object.values(formErrors).forEach( val => {
        val.length > 0 && (valid = false)
    });
    return valid;
}

class FormValidacao extends Component{
    constructor(props){
        super(props);
        this.state = {
            titulo: null,
            preco: null, 
            autor: '', 
            autores: [],
            formErrors: {
                titulo: '',
                preco: '',
                autor: ''
            }
        };
    }

    componentDidMount(){
        $.ajax({
            url: "http://cdc-react.herokuapp.com/api/autores",
            dataType: "json",
            success: function(resposta){
              this.setState({autores: resposta});
            }.bind(this)
        });
    }

    handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;
        
        switch(name){
            
            case "titulo":
                formErrors.titulo = value.length < 3 && value.length > 0 
                    ? 'Minimo de 3 caracteres!' 
                    : ''; 
                break;
            case "preco":
                formErrors.preco = value.length < 0
                    ? 'Este campo é obrigatório' 
                    : ''; 
                break;
            case "autor":
                formErrors.autor = value === "" 
                    ? 'Escolha uma opção' 
                    : ''; 
                break;


        }
        this.setState({formErrors, [name]: value });
    };
    handleSubmit = e => {
        e.preventDefault();
        $(".danger").css({"display": "none"});
        $(".success").css({"display": "none"});
        if(formValid(this.state.formErrors)){
            
            $.ajax({
                url: 'http://cdc-react.herokuapp.com/api/livros',
                contentType: 'application/json',
                dataType: 'json',
                type: 'post',
                data: JSON.stringify({titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autor}),
                success: function(novaListagem){
                  PubSub.publish('atualiza-lista-livros', novaListagem);
                  this.setState({titulo: '', preco: null, autor: ''});
                  $(".success").css({"display": "block"});
                }.bind(this),
                error: function(resposta){
                  if(resposta.status === 400){
                    //new TratadorErros().publicaErros(resposta.responseJSON);
                    $(".danger").css({"display": "block"});
                  }
                },
                beforeSend: function(){
                  PubSub.publish("limpa-erros", {});
                }
            })
        }else{
            $(".danger").css({"display": "block"});
        }

    }

    render(){
        const { formErrors } = this.state;
        return(
            <div id="layout">
                <div id="main">
                    <span className="danger">Você possui alguns erros, por favor, confira o seu formulário</span>
                    <span className="success">Cadastrado com sucesso!</span>
                    <h1>Create Account</h1>
                    <div className="pure-form pure-form-aligned">
                        <form className="pure-form pure-form-aligned" onSubmit={this.handleSubmit} noValidate>
                            <div className="pure-control-group">
                                <label htmlFor="titulo">Título</label>
                                <input 
                                    type="text"
                                    className={formErrors.titulo.length > 0 ? "has-error" : null}
                                    placeholder="First Name"
                                    name="titulo"
                                    noValidate 
                                    onChange={this.handleChange}
                                />
                                {formErrors.titulo.length > 0 && (
                                    <span className="error">{formErrors.titulo}</span>
                                )}
                            </div>
                            <div className="pure-control-group">
                                <label htmlFor="preco">Preço</label>
                                <input 
                                    type="number"
                                    className={formErrors.preco.length > 0 ? "has-error" : null}
                                    placeholder="exemple@exemple.com"
                                    name="preco"
                                    noValidate 
                                    onChange={this.handleChange}
                                />
                                {formErrors.preco.length > 0 && (
                                    <span className="error">{formErrors.preco}</span>
                                )}
                            </div>
                            {/* <div className="pure-control-group">
                                <label htmlFor="password">Password</label>
                                <input 
                                    type="password"
                                    className={formErrors.firstname.length > 0 ? "has-error" : null}
                                    placeholder="Your password"
                                    name="password"
                                    noValidate 
                                    onChange={this.handleChange}
                                />
                                {formErrors.password.length > 0 && (
                                    <span className="error">{formErrors.password}</span>
                                )}
                            </div> */}
                            <div className="pure-control-group">
                                <label htmlFor="autor">Autor</label>
                                <select value={this.state.autor} name="autor" onChange={this.handleChange}>
                                    <option value="">Selecione</option>
                                    {
                                        this.state.autores.map(function (autor) {
                                            return <option key={autor.id} value={autor.id}>
                                                {autor.nome}
                                            </option>;
                                        })
                                    }
                                </select>
                                {formErrors.autor === "" && (
                                    <span className="error">{formErrors.autor}</span>
                                )}
                            </div>
                            <div className="createAccount">
                                <button type="submit">Create Account</button>
                                <span>Already have an Account?</span>
                            </div>
                        </form>
                    </div>

                    
                </div>
            </div>
        );
    }

    
}


class TabelaLivros extends Component{

    render(){
        return(
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                        <th>Título</th>
                        <th>Preço</th>
                        <th>Autor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.livros.map(function(livro){
                                return(
                                    <tr key={livro.id}>
                                        <td>{ livro.titulo }</td>
                                        <td>{ livro.preco }</td>
                                        <td>{ livro.autor.nome }</td>
                                    </tr> 
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default class FormValidacaoBox extends Component{
    constructor(){
        super();
        this.state = {livros: []};
    }

    componentDidMount(){
        $.ajax({
            url: "http://cdc-react.herokuapp.com/api/livros",
            dataType: "json",
            success: function(resposta){
              this.setState({livros: resposta});
            }.bind(this)
        });
        PubSub.subscribe('atualiza-lista-livros', function(topico, novaLista){
            this.setState({livros: novaLista});
        }.bind(this));
    }

    render(){
        return(
            <div>
                <div className="header">
                    <h1>Lista de Livros</h1>
                </div>
                <div className="content" id="content">
                    <FormValidacao callbackAtualizaListagem={this.atualizaListagem}/>
                    <TabelaLivros livros={this.state.livros}/>
                </div>
            </div> 
        );
    }
}