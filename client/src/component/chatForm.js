import React from 'react';

export default class ChatForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            chat: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReturnKey = this.handleReturnKey.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        let name = this.state.name.trim();
        let chat = this.state.chat.trim();
        this.props.addChat(name, chat);
        this.setState({
            name: '',
            chat: ''
        })
    }

    handleReturnKey(e) {
        if(e.keyCode === 13 && !e.shiftKey){
            e.preventDefault()
            let button = document.getElementById('submitBtn');
            button.click();
        }
    }

    render() {
        return (
            <form className="form" onSubmit={this.handleSubmit}>
                <li className="list-group-item borderless d-flex justify-content-between align-items-center">
                    <button type="submit" id="submitBtn" className="btn btn-primary btn-circle btn-circle-lg m-1"><i
                        className="fas fa-plus fa-2x"></i></button>
                    <div className="speech-bubble col-11" style={{color: '#fff'}}>
                        <div className="form-label-group">
                            <input type="text" name="name" id="Name" className="form-control " placeholder="Name" required={true}
                                autoFocus={true} onChange={this.handleChange} value={this.state.name} onKeyUp={this.handleReturnKey} />
                            <label htmlFor="addLetter">Name</label>
                        </div>
                        <div className="form-label-group my-0">
                            <textarea id="Chat" name="chat" className="form-control" placeholder="Type your message here ..." required={true}
                                autoFocus={true} onChange={this.handleChange} value={this.state.chat} onKeyUp={this.handleReturnKey}/>
                        </div>
                    </div>
                </li>
            </form>
        );
    }
}