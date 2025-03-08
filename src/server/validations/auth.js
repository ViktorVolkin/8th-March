import { body } from "express-validator";
export const registerValidation = [
	body(
		"password",
		"пароль невалиден, переделывай, нужно больше 5 символов."
	).isLength({ min: 5 }),
	body(
		"fullName",
		"имя невалидно, переделывай, нужно больше 2 символов."
	).isLength({ min: 3 }),
	body(
		"username",
		"Логин должен содержать не менее 3 символов и только латинские буквы."
	)
		.isLength({ min: 3 })
		.matches(/^[a-zA-Z0-9_]+$/),
];
