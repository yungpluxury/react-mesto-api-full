import React from "react";
import {Link}  from 'react-router-dom';

function Registration(props) {
const[email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    function changeEmail(evt) {
        setEmail(evt.target.value);
    }

    function changePassword(evt) {
       setPassword(evt.target.value);
    }

    function handleSubmit(evt) {
    evt.preventDefault()
        props.onRegister(email, password)
    }


    return(
        <div className='login'>
            <h1 className='login__title' >Регистрация</h1>
            <form className='login__form' onSubmit={handleSubmit}>
                <input className='login__input'  type='email' name='email'
                       value={email} onChange={changeEmail} placeholder='Email' required/>
                <input className='login__input'  type='password'
                       name='password'
                       value={password} onChange={changePassword} placeholder='Пароль' required/>
                <button className='login__button' type='submit'>Зарегистрироваться</button>
                <Link className='login__question' to='/signin'>Уже зарегистрированы?Войти</Link>
            </form>
        </div>
    );

}

export default Registration;
