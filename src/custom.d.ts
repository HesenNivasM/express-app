declare namespace Express {
	export interface Request {
		userId: string;
		user?: string | { id: string; iat: number; exp: number };
	}
}
