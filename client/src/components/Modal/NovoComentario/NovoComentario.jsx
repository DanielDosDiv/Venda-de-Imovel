// components/ModalAcessoNegado.jsx
import React from 'react';
import { useRef } from 'react';
import css from './NovoComentario.module.css'; // você pode colocar os estilos separados
import InputPreset from '../../Input';

const NovoComentario = ({ isOpen, onClose, inputRef  }) => {
  if (!isOpen) return null;

  // const userName = localStorage.getItem("name")
  return (
        <div className={css.modal_overlay}>
          <div className={css.modal}>
            <h2>Novo Comentario</h2>
            {/* <textarea>Digite aqui</textarea> */}
            <InputPreset type={"text"} placeholder={"Digite aqui"} ref={inputRef } />
            <button className={css.btn_fechar} onClick={onClose}>Enviar</button>
          </div>
        </div>
  );
};

export default NovoComentario;
