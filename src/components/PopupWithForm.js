import React from 'react';

function PopupWithForm(props) {
    return (
        <div className={`popup popup_type_${props.name} ${props.isOpen ? 'popup_opened' : ''}`}>
            <form name={props.name} className="popup__container" onSubmit={props.onSubmit}>
                <div className='popup__form'>
                    <button type="button" className="popup__close-button" onClick={props.onClose}></button>
                    <h2 className="popup__title">{props.title}</h2>
                    {props.children}
                    <button type="submit" className="popup__submit-button">{props.buttonText}</button>
                </div>
            </form>
        </div>
    )
}

export default PopupWithForm;
