import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import style from './Loading.module.css'

const Notfound = () => {
    return (
        <div className={style.loading}>

            <DotLottieReact
                src="https://lottie.host/fbc595b0-55ba-4087-9945-5e4e7fcad7de/5TFXs5gAMu.lottie"
                loop
                autoplay
            />
                <p>Nenhum imóvel disponível no momento</p>

        </div>

    );
};
export default Notfound;