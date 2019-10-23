import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ChatForm from './chatForm';
import ChatItem from './chatItem';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const API_URL = 'http://localhost:3001/api/chats';

export default class ChatBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [], typer: '' };
        this.endRef = null;
    }

    componentDidMount() {
        this.loadChat().then(() => {
            this.scrollToBottom();
        })

        socket.on('load chat', (newData) => {
            this.setState((state) => ({ data: [...state.data, newData] }));
        })

        socket.on('typing', (typer) => {
            this.setState({
                typer
            })
        })

        socket.on('stop typing', () => {
            this.setState({
                typer: ''
            })
        })

        socket.on('delete chat', (id) => {
            this.setState(state => ({
                data: state.data.filter(chatData => chatData.id !== id)
            }));
        })
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    loadChat = () => {
        return axios.get(API_URL)
            .then((response) => {
                if (response.data.error)
                    console.log(response.data.message);
                else {
                    let chatData = response.data.chatData.map((chat) => {
                        return { ...chat, status: true };
                    })
                    this.setState({ data: chatData });
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    deleteChat = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                this.setState(state => ({
                    data: state.data.filter(chatData => chatData.id !== id)
                }));
                axios.delete(API_URL + `/${id}`)
                    .then((response) => {
                        socket.emit('delete chat', id);
                        Swal.fire({
                            type: 'success',
                            title: `Chat from ${response.data.chatDeleted.name} Deleted`,
                            showConfirmButton: false,
                            timer: 1300
                        });
                    })
            }
        })
    }

    addChat = (name, chat, deletedId) => {
        if (chat.length > 0) {
            let id = Date.now();
            this.setState(state => {
                let chatData = state.data.filter(chatData => chatData.id !== deletedId);
                return { data: [...chatData, { id, name, chat, status: true }], typer: '' }
            });
            axios.post(API_URL, { id, name, chat })
                .then((response) => {
                    let chatData = { ...response.data.chatAdded, status: true }
                    socket.emit('add chat', chatData)
                    socket.emit('stop typing')
                })
                .catch(err => {
                    this.setState(state => ({
                        data: state.data.map(chatData => {
                            if (chatData.id === id)
                                chatData.status = false;
                            return chatData;
                        })
                    }));
                });
        } else {
            Swal.fire({
                type: 'error',
                title: `chat cant be empty`,
                showConfirmButton: false,
                timer: 1300
            });
        }
    }

    resendChat = (name, chat, id) => {
        this.addChat(name, chat, id);
    }

    scrollToBottom = () => {
        if (this.endRef)
            this.endRef.scrollIntoView();

    }

    typingChat = (name) => {
        socket.emit('typing', name);
    }

    render() {
        let colors = ['btn-info', 'btn-success', 'btn-warning', 'btn-danger']
        return (
            <div className="container d-flex w-100 h-100 p-3 mx-auto flex-column">
                <header className="masthead mb-auto">
                </header>

                <main role="main" className="inner cover dashboard-main">
                    <div className="card">
                        <div className="card-header text-center" >
                            <h3 style={{ fontWeight: 600 }}>React Chat</h3>
                            <p className="text-center">{this.state.typer.length > 0 ? `${this.state.typer} is typing...` : ''}</p>
                        </div>
                        <div className="card-body">
                            <ul className="list-group">
                                <div className="scrollable" style={{ maxHeight: '40vh', overflowY: 'auto' }}>
                                    {this.state.data.map((chatData, index) => (
                                        <ChatItem key={chatData.id} chatData={chatData} color={colors[index % 4]} deleteChat={this.deleteChat} resendChat={this.resendChat} />
                                    ))}
                                    <div ref={(e) => { this.endRef = e }}></div>
                                    <hr />
                                </div>
                                <ChatForm addChat={this.addChat} setTyper={this.typingChat} />
                            </ul>
                        </div>
                    </div>
                </main>

                <footer className="mastfoot mt-auto">
                </footer>
            </div>
        );
    }




}