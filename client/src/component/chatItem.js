import React from 'react';
import moment from 'moment';

function todayConvert(date) {
    let time = moment(date).format(' HH:mm');
    date = moment(date).format('YYYY-MM-DD');
    if (date === moment().format('YYYY-MM-DD'))
        date = 'Today';
    else if (date === moment().subtract(1, 'days').format('YYYY-MM-DD'))
        date = 'Yesterday';
    return (date + time);
}

function chatItem(props) {
    return (
        <li className="list-group-item borderless d-flex justify-content-between align-items-center">
            <button className="btn btn-primary btn-circle btn-circle-lg m-1"><i
                className="fas fa-minus fa-2x"></i></button>
            <div className="speech-bubble col-11" style={{ color: '#fff' }}>
                <div className="row justify-content-between mx-1">
                    <h5>{props.name}</h5>
                    <span>{todayConvert(props.id)}</span>
                </div>
                <h6>{props.chat}</h6>
            </div>
        </li>
    );
}



export default chatItem;