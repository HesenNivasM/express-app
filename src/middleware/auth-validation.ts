import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import jwt from 'jsonwebtoken';

type LoginRequestBody = {
	email: string;
	password: string;
};

const loginSchema = z
	.object({
		email: z.string().min(6).email(),
		password: z.string().min(6),
	})
	.strict();

export const loginValidation = async (req: Request, res: Response, next: NextFunction) => {
	const parsed = loginSchema.safeParse(req.body);
	if (!parsed.success) res.status(400).send(parsed.error);
	else {
		const { email: emailFromBody, password: passwordFromBody }: LoginRequestBody = req.body;
		const user = await User.findOne({ email: emailFromBody });
		if (user) {
			const validPass = await bcrypt.compare(passwordFromBody, user.password);
			if (validPass) {
				req.userId = user._id;
				next();
			} else res.status(400).send('Invalid Email or Password!!!');
		} else res.status(400).send('Invalid Email or Password!!!');
	}
};

const siginUpSchema = z
	.object({
		name: z.string().min(3),
		email: z.string().min(6).email(),
		password: z.string().min(6),
	})
	.strict();

type SignUpRequestBody = {
	email: string;
};
export const signUpValidation = async (req: Request, res: Response, next: NextFunction) => {
	const parsed = siginUpSchema.safeParse(req.body);
	if (!parsed.success) res.status(400).send(parsed.error);
	else {
		const { email: emailFromBody }: SignUpRequestBody = req.body;
		const emailExist = await User.findOne({ email: emailFromBody });
		if (emailExist) res.status(400).send('Email already exists!!!');
		else next();
	}
};

export const verify = (req: Request, res: Response, next: NextFunction) => {
	const auth = req.header('Authorization');
	if (!auth) return res.status(401).send('Access denied!!!');
	let token = auth.split(' ')[1];
	if (!token) return res.status(401).send('Access denied!!!');
	try {
		const verify: any = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verify;
		next();
	} catch (err) {
		return res.status(400).send('Invalid token!!!');
	}
};
