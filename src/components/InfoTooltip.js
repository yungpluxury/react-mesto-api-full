import React from "react";
import fail from '../images/fail.svg';
import success from '../images/SUCCESS.svg';

function InfoTooltip(props) {
    return (
        <div className={`popup popup_type_reg ${props.isOpen ? 'popup_opened' : ''}`}>
            <div name={props.name} className="popup__container">
                <div className='popup__form popup__form_tooltip'>
                    <button type="button" className="popup__close-button" onClick={props.onClose}></button>
                    <img className='popup__tooltip_image'
                         src={props.isSuccess ? success : fail}
                         alt={props.isSuccess ? 'Регистрация выполнена' : 'Регистрация отклонена'}/>
                    <h2 className="popup__title popup__title-tooltip">
                        {props.isSuccess ? 'Вы успешно Зарегистрировались':'Что-то пошло не так! Попробуйте еще раз.'}</h2>
                </div>
            </div>
        </div>
    )

}

export default InfoTooltip;