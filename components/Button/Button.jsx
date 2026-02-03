import Style from "./Button.module.css";
export const Button = ({ btnName, handleClick, classStyle, disabled }) => (
  <button
    className={Style.button}
    type="button"
    onClick={handleClick}
    disabled={disabled}
  >
    {btnName}
  </button>
);
export default Button;
