// components/ModalAcessoNegado.jsx
import React from 'react';
import css from './Logoff.module.css'; // você pode colocar os estilos separados

const ModalAcessoNegado = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const userName = localStorage.getItem("name")
  return (
        <div className={css.modal_overlay}>
          <div className={css.modal}>
            <h2>Logoff</h2>
            <p>Usuario deslogado com sucesso</p>
            <button className={css.btn_fechar} onClick={onClose}>Fechar</button>
          </div>
        </div>
  );
};

export default ModalAcessoNegado;
