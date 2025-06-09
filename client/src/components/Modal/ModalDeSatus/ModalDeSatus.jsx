import React from 'react';
import css from './ModalDeSatus.module.css';
import Success from '../../animation/SuccessAnimate';
import ErroAnimate from '../../animation/ErroAnimate';

const ModalDeSatus = ({ isOpen, onClose, Titulo, status, descricao }) => {
  if (!isOpen) return null;

  return (
    <div className={css.modal_overlay}>
      <div className={css.modal}>
        <h2 className={status ? css.titulo_sucesso : css.titulo_erro}>
          {Titulo}
        </h2>

        {status ? <Success /> : <ErroAnimate />}
        
        <p>{descricao}</p>
        <button className={status ? css.btn_fechar : css.btn_fechar_erro} onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default ModalDeSatus;
