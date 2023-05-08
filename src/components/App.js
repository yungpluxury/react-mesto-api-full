import React from 'react';
import '../index.css';
import api from '../utils/api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import {Redirect, Route, Switch, useHistory} from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Registration from "./Registration";
import InfoTooltip from "./InfoTooltip";
import * as auth from "../utils/auth";
import {CurrentUserContext} from "../contexts/CurrentUserContext";


function App() {
    const [currentUser, setCurrentUser] = React.useState({});
    const [cards, setCards] = React.useState([])
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [userEmail, setUserEmail] = React.useState('')
    const history = useHistory();

    const checkToken = React.useCallback(() => {
        const token = localStorage.getItem('token');
        auth.checkToken(token).then(
            (data) => {
                setLoggedIn(true);
                setUserEmail(data.email);
                history.push('/my-profile');
            })
            .catch((err) => {
                    console.log(err);
                }
            );
    }, [history]);

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            checkToken();
        }
    }, [checkToken]);

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        api.getUserInfo(token)
            .then((data) => {
                setCurrentUser(data)
            })
            .catch((err) => console.log(err))

    }, [])

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        api.getInitialCards(token)
            .then((data) => {
                setCards(data)
            })
            .catch((err) => console.log(err))

    }, [])


    function handleCardClick(card) {
        setSelectedCard(card)
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleInfoTooltipPopupOpen() {
        setIsInfoTooltipPopupOpen(!isInfoTooltipPopupOpen)
    }

    function closeAllPopups() {
        setSelectedCard(null)
        setIsEditProfilePopupOpen(false)
        setIsAddPlacePopupOpen(false)
        setIsEditAvatarPopupOpen(false)
        setIsInfoTooltipPopupOpen(false)
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i === currentUser._id);

        api.changeLikeCardStatus(card._id, !isLiked, localStorage.token).then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleCardDelete(card) {
        api.cardDelete(card._id,localStorage.token)
            .then(() => {
                setCards((state) => state.filter((c) => c !== card))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleUpdateUser(data) {
        api.editUserData(data, localStorage.token)
            .then((data) => {
                setCurrentUser(data);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleUpdateAvatar(data) {
        api.updateAvatar(data, localStorage.token)
            .then((data) => {
                setCurrentUser(data);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleAddPlaceSubmit(data) {
        api.addCard(data,localStorage.token)
            .then((newCard) => {
                setCards([newCard, ...cards]);
                closeAllPopups()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function register(email, password) {
        auth.register(email, password).then(
            () => {
                setIsSuccess(true)
                handleInfoTooltipPopupOpen()
                history.push('/');
            })
            .catch(() => {
                setIsSuccess(false)
                handleInfoTooltipPopupOpen()
            })
    }

    function login(email, password) {

        auth.authorization(email, password).then(
            (data) => {
                localStorage.setItem('token', data.token);
                setUserEmail(email)
                setLoggedIn(true)
                history.push("/my-profile");
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function signOut() {
        localStorage.removeItem("token");
        setLoggedIn(false);
        history.push('signin');
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
                <Header loggedIn={loggedIn} userEmail={userEmail} onSignOut={signOut}/>
                <Switch>
                    <Route exact path='/'></Route>
                    <ProtectedRoute path='/my-profile'
                                    component={Main}
                                    loggedIn={loggedIn}
                                    onEditProfile={handleEditProfileClick}
                                    onAddPlace={handleAddPlaceClick}
                                    onEditAvatar={handleEditAvatarClick}
                                    onCardClick={handleCardClick}
                                    cards={cards}
                                    onCardLike={handleCardLike}
                                    onCardDelete={handleCardDelete}
                    />
                    <Route path='/signup'>
                        <Registration onRegister={register}/>
                    </Route>
                    <Route path='/signin'>
                        <Login onLogin={login} onChekToken={checkToken}/>
                    </Route>
                    <Route>
                        {loggedIn ? <Redirect to="/"/> : <Redirect to="/signin"/>}
                    </Route>

                </Switch>
                <Footer/>
                <ImagePopup card={selectedCard !== null && selectedCard}
                            onClose={closeAllPopups}/>
                <EditProfilePopup isOpen={isEditProfilePopupOpen}
                                  onClose={closeAllPopups}
                                  onUpdateUser={handleUpdateUser}/>
                <EditAvatarPopup isOpen={isEditAvatarPopupOpen}
                                 onClose={closeAllPopups}
                                 onUpdateAvatar={handleUpdateAvatar}/>
                <AddPlacePopup isOpen={isAddPlacePopupOpen}
                               onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit}/>
                <InfoTooltip isOpen={isInfoTooltipPopupOpen}
                             onClose={closeAllPopups} isSuccess={isSuccess}/>
            </div>

        </CurrentUserContext.Provider>
    )
}

export default App;

