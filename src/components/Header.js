import React from 'react';
import logo from '../images/logo.svg'
import {Link, useLocation} from 'react-router-dom';

function Header(props) {
    const location = useLocation();

    return (
        <header className="header">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#" target="_blank" rel="noopener"><img className="header__logo hover" src={logo}
                                                                alt="логотип"/></a>
                {props.loggedIn ? (
                <>
                    <div className='header__container'>
                    <p className='header__email header__email-style'>{props.userEmail}</p>
                    <Link className='header__signout header__email-style' to='/signin' onClick ={props.onSignOut}>Выйти</Link>
                    </div>
                </>
                ) : (
                <Link className='header__sign header__email-style'
                      to={`${location.pathname === '/signin' ? '/signup' : '/signin'}`}>
                    {`${location.pathname === '/signin' ? 'Регистрация' : 'Войти' }`}
                </Link>
                )}

        </header>
    );
}

export default Header;