import css from './Button.css';
function Button({text, className, onClick}) {
  return (
    <button className={className} onClick={onClick}>
      {text}
    </button>
  );

}
export default Button;