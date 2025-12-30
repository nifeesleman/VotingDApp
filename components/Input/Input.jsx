import React from "react";
import Style from "./Input.module.css";

export const Input = ({
  inputType,
  title,
  placeholder,
  handleChange,
  handleClick, // kept for backward compatibility
  Button,
}) => {
  return (
    <div className={Style.input}>
      <p>{title}</p>
      {inputType === "text" ? (
        <div className={Style.input__box}>
          <input
            type="text"
            className={Style.input__box__form}
            placeholder={placeholder}
            onChange={handleChange || handleClick}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
