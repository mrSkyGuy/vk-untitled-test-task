import { FieldErrors, UseFormHandleSubmit, UseFormRegister, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("You cannot send empty field")
    .matches(/^[A-Za-z]+$/gu, "You must use latin letters")
    .min(2, "Name must be no shorter than 2 letters long")
    .max(30, "Name must be no longer than 30 letters long")
});

export function useFormControlWithValidation(): [
  UseFormRegister<TFormInput>,
  UseFormHandleSubmit<TFormInput, undefined>,
  string,
  FieldErrors<TFormInput>
] {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<TFormInput>({ resolver: yupResolver(schema) });
  const name = watch("name");

  return [register, handleSubmit, name, errors];
}
