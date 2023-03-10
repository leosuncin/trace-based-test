export interface Login {
  email: string;
  password: string;
}

export interface Register extends Login {
  name: string;
}

export interface User extends Omit<Register, 'password'> {
  id: string;
  isAdmin: boolean;
}
