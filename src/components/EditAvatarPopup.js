import React from 'react';
import PopupWithForm from './PopupWithForm';


function EditAvatarPopup(props) {
    const avatarRef = React.useRef('')

    function handleSubmit(e) {
        e.preventDefault();
        props.onUpdateAvatar({
            avatar: avatarRef.current.value
        });
        //сбросил инпуты
        avatarRef.current.value = ('');
    }


    return (
        <PopupWithForm
            isOpen={props.isOpen}
            onClose={props.onClose}
            name='link'
            title='Обновить аватар'
            buttonText='Сохранить'
            onSubmit={handleSubmit}
        >
            <input type="url" name="link" id="avatar-input" minLength="2" className="popup__input"
                   placeholder="Ссылка на картинку" required ref={avatarRef}/>
            <span className="popup__error" id="avatar-input-error"></span>

        </PopupWithForm>
    )
}

export default EditAvatarPopup;