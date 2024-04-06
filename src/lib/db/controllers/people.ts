//

class People {
	private static instance: People;

	private constructor() {}

	public static getInstance(): People {
		if (!People.instance) {
			People.instance = new People();
		}
		return People.instance;
	}

	public async login() {
		// ...
	}

	public async register() {
		// ...
	}
}

export const people = People.getInstance();
