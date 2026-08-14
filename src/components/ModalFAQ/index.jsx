import { useEffect, useState } from 'react';
import './index.css';

// Tempo em tela antes de sair sozinha.
const AUTO_HIDE_MS = 7000;
// Precisa casar com a animação .is-leaving no CSS.
const EXIT_MS = 300;

export default function ModalFAQ({ open, onClose }) {
  // Continua montada depois que `open` vira false, até a animação de saída
  // terminar — senão a dica sumiria de um frame para o outro.
  const [visible, setVisible] = useState(open);
  const [prevOpen, setPrevOpen] = useState(open);

  // Ajuste de estado durante o render (padrão suportado pelo React): ao abrir,
  // monta no mesmo render, sem passar por um efeito.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setVisible(true);
  }

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  // Desmonta por tempo, não pelo evento animationend: se a animação não rodar
  // (aba em segundo plano, motion reduzido), o evento nunca dispara e a dica
  // ficaria presa na tela.
  useEffect(() => {
    if (open || !visible) return;
    const timer = setTimeout(() => setVisible(false), EXIT_MS);
    return () => clearTimeout(timer);
  }, [open, visible]);

  if (!visible) return null;

  return (
    <div className="modal-corner-container" role="status" aria-live="polite">
      <div className={`modal-content ${open ? '' : 'is-leaving'}`}>
        <h3>Dúvidas e suporte, aqui!</h3>
        <button type="button" className="btn-faq-span" onClick={onClose}>
          Entendi
        </button>
      </div>
    </div>
  );
}
