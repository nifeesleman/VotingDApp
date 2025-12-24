import React from "react";
import Style from "./Input.module.css";

export const Input = ({
  inputType,
  title,
  placeholder,
  handleClick,
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
            onChange={handleClick}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
