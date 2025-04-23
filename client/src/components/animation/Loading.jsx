import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import style from './Loading.module.css';
const Loading = () => {
  return (
    <div className={style.loading}>

      <DotLottieReact

        src="https://lottie.host/42d4c6fe-7178-414c-a5dd-b199a1db724c/UbkJsEU0v2.lottie"
        loop
        autoplay
      />
    </div>

  );
};
export default Loading;