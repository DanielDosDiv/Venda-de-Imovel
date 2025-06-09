
import React from 'react';
import css from'./ModalDeUserSemLgoin.module.css'; // você pode colocar os estilos separados

const ModalAcessoNegado = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={css.modal_overlay}>
      <div className={css.modal}>
        <h2>Acesso Negado</h2>
        <p>Nenhum usuario logado. Faça login para continuar.</p>
        <button className={css.btn_fechar} onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default ModalAcessoNegado;
