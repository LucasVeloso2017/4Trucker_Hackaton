import React from 'react';
import { Link } from 'react-router-dom'
import Logo from '../../assets/logo.png'
import {FiLogIn} from 'react-icons/fi'
import './home.css'

const Home: React.FC = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                <img src={Logo} alt="ecoleta" />
                </header>

                <main>
                    <h1>Sua plataforma de divulgação do seu estabelecimento.</h1>
                    <p>Ajudamos pessoas a encontrarem seu estabelecimento de forma eficiente.</p>
                    <p>Baixe agora 4Trucker!!</p>

                    <Link to='/create-point'>
                        <span> <FiLogIn/> </span>
                        <strong>Cadastre seu estabelecimento</strong>
                    </Link>
                </main>
            </div>
        </div>
    );
}

export default Home;