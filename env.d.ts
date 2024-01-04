declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT?: string;
			MONGO_URI: string;
			JWT_SECRET: string;
			JWT_LIFETIME: string;
			RATELIMIT_WINDOW?: number;
			RATELIMIT_MAX?: number;
		}
	}
}

export {};
