import React from 'react';
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function Card(props) {
    const currentUser = React.useContext(CurrentUserContext);
    const isOwn = props.card.owner === currentUser._id;
    const cardDeleteButtonClassName = (
        `card__delete ${isOwn ? 'card__delete_active' : 'card__delete_hidden'}`
    );
    const isLiked = props.card.likes.some(i => i._id === currentUser._id);
    const cardLikeButtonClassName = (
        `card__like-button ${isLiked ? 'card__like-button_active' : ''}`
    );


    function handleClick() {
        props.onCardClick(props.card);
    }

    function handleLikeClick() {
        props.onCardLike(props.card);
    }

    function handleDeleteClick() {
        props.onCardDelete(props.card);
    }

    return (
        <article className="card">
            <div className="card__group">
                <img src={props.card.link} alt={props.card.name} onClick={handleClick} className="card__image"/>
                <button className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
                <div className="card__group-container">
                    <h2 className="card__title">{props.card.name}</h2>
                    <div className="card__like_group">
                        <button type="button" onClick={handleLikeClick} className={cardLikeButtonClassName}></button>
                        <span className="card__like-info">{props.card.likes.length}</span>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default Card