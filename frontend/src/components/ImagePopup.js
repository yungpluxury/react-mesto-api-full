import React from 'react';

function ImagePopup(props) {
    return (
        <div className={`popup popup_type_image ${props.card ? 'popup_opened' : ''}`}>
            <div className='popup__overlay'></div>
            <figure className='popup__figure'>
                <img className='popup__image' src={props.card.link} alt={props.card.name}/>
                <figcaption className="popup__caption">{props.card.name}</figcaption>
                <button onClick={props.onClose} type="button"
                        className="popup__close-button popup__close-button_type_image hover"></button>
            </figure>
        </div>
    )
}

export default ImagePopup;