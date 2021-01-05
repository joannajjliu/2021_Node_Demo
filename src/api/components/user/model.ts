interface IUser {
  name: string,
  userName: string,
  password: string,
  email: string
}

class User {
  name: string;
  userName: string;
  password: string;
  email: string;

  constructor(
    name: string,
    userName: string,
    password: string,
    email: string
  ) {
    this.name = name;
    this.userName = userName;
    this.password = password;
    this.email = email;
  }
}

export default User;
export { IUser };