import React from "react";
import PopupWithForm from "./PopupWithForm";


function AddPlacePopup(props) {
    const [name, setName] = React.useState('')
    const [link, setLink] = React.useState('')

    //меняем название карточки
    function changeName(e) {
        setName(e.target.value)
    }

    //меняем ссылку
    function changeLink(e) {
        setLink(e.target.value)
    }


    function handleSubmit(e) {
        e.preventDefault();
        props.onAddPlace({
            name: name,
            link: link,
        })

    }

    //очистил инпуты перед открытие попапа
    React.useEffect(() => {
            setLink('')
            setName('')
        }
        //открыл попап
        , [props.isOpen])


    return (
        <PopupWithForm
            name='name'
            title='Новое место'
            buttonText='Сохранить'
            onSubmit={handleSubmit}
            isOpen={props.isOpen}
            onClose={props.onClose}
        >
            <input type="text" name="name" value={name} id="title-input" className="popup__input" minLength="2"
                   maxLength="30"
                   placeholder="Название" required onChange={changeName}/>
            <span className="popup__error" id="title-input-error"></span>
            <input type="url" name="link" value={link} id="link-input" className="popup__input"
                   placeholder="Ссылка на картинку"
                   required onChange={changeLink}/>
            <span className="popup__error" id="link-input-error"></span>
        </PopupWithForm>
    )
}

export default AddPlacePopup;