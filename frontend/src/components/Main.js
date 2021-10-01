import React from 'react';
import Card from "./Card";
import pencilImage from '../images/Karandashimage.svg'
import {CurrentUserContext} from "../contexts/CurrentUserContext";


function Main(props) {
    const currentUser = React.useContext(CurrentUserContext);

    return (
        <main className="content">
            <section className="profile">
                <div className="profile__info-block">
                    <img onClick={props.onEditAvatar} alt='аватар' src={pencilImage}
                         className="profile__edit-button-avatar"/>
                    <img className="profile__avatar" src={currentUser.avatar} alt="фото Кусто"/>
                </div>
                <div className="profile__info">
                    <div className="profile__webinfo">
                        <h1 className="profile__title">{currentUser.name}</h1>
                        <button onClick={props.onEditProfile} aria-label="profilebutton" type="button"
                                className="profile__edit-button hover"></button>
                    </div>
                    <p className="profile__text">{currentUser.about}</p>
                </div>
                <button onClick={props.onAddPlace} type="button" className="profile__add-button hover"></button>
            </section>

            <section className="cards">
                {props.cards.map((card => (
                    <Card
                        onCardClick={props.onCardClick}
                        onCardLike={props.onCardLike}
                        onCardDelete={props.onCardDelete}
                        key={card._id}
                        card={card}
                    />
                )))
                }
            </section>

        </main>
    );
}

export default Main;