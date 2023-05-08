import React from 'react';
import PopupWithForm from './PopupWithForm';
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {
    const currentUser = React.useContext(CurrentUserContext);
    const [name, setName] = React.useState('')
    const [description, setDescription] = React.useState('')

    React.useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser, props.isOpen]);

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();

        // Передаём значения управляемых компонентов во внешний обработчик
        props.onUpdateUser({
            name,
            about: description,
        });
    }

    //меняем имя профиля
    function changeName(e) {
        setName(e.target.value);
    }

    //меняем вид деятельности
    function changeDescription(e) {
        setDescription(e.target.value);
    }


    return (
        <PopupWithForm
            isOpen={props.isOpen}
            onClose={props.onClose}
            name='name'
            title='Редактировать профиль'
            buttonText='Сохранить'
            onSubmit={handleSubmit}
        >
            <input type="text" name="name" value={name || ''} className='popup__input' id="name-input" minLength="2"
                   maxLength="40"
                   placeholder="Имя" required onChange={changeName}/>
            <span className="popup__error" id="name-input-error"></span>
            <input type="text" name="job" value={description || ''} minLength="2" maxLength="200" id="job-input"
                   className="popup__input popup__input_type-job" placeholder="Вид деятельности" required
                   onChange={changeDescription}/>
            <span className="popup__error" id="job-input-error"></span>
        </PopupWithForm>
    )
}

export default EditProfilePopup;
