import React, {
  PropsWithChildren,
  forwardRef,
  Ref,
  ChangeEvent,
  FocusEvent,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import { InputComponent, InputProps } from "./Input.types";
import { useInputCSS } from "./Input.styles";
import { useControlled } from "../utils/hooks";
import { InputGroupConfig } from "./InputGroup.types";
import { useInputGroupContext } from "./input-group-context";

const mergeInputGroupProps = (
  inputProps: InputProps,
  config: InputGroupConfig
): InputProps => {
  if (!config.isInputGroup) return inputProps;
  return {
    ...inputProps,
    size: config.size,
    type: config.type,
    readOnly: config.readOnly,
    disabled: config.disabled,
  };
};

const Input: InputComponent = Object.assign(
  forwardRef<HTMLInputElement, PropsWithChildren<InputProps>>(
    (inputProps, ref: Ref<HTMLInputElement | null>) => {
      const inputGroupConfig = useInputGroupContext();
      const {
        type = "default",
        size = "md",
        width = "100%",
        htmlType = "text",
        placeholder = "",
        defaultValue = "",
        disabled = false,
        readOnly = false,
        className = "",
        autoComplete = "off",
        value,
        onChange,
        onBlur,
        onFocus,
        ...restProps
      } = mergeInputGroupProps(inputProps, inputGroupConfig);
      const [internalValue, setInternalValue] = useControlled({
        defaultValue,
        value,
      });
      const { className: resolveClassName, styles } = useInputCSS({
        type,
        size,
        width,
        disabled,
      });
      const classes = classNames(
        "raw-input",
        disabled && "raw-disabled-input",
        className,
        resolveClassName
      );

      const focusHandler = (event: FocusEvent<HTMLInputElement>) => {
        onFocus?.(event);
      };

      const blurHandler = (event: FocusEvent<HTMLInputElement>) => {
        onBlur?.(event);
      };

      const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (disabled || readOnly) return;
        setInternalValue(event.target.value);
        onChange?.(event);
      };

      return (
        <>
          <input
            ref={ref}
            type={htmlType}
            className={classes}
            value={internalValue}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            onFocus={focusHandler}
            onBlur={blurHandler}
            onChange={changeHandler}
            autoComplete={autoComplete}
            {...restProps}
          />
          {styles}
        </>
      );
    }
  ),
  { id: "Input" }
);

export default Input;
