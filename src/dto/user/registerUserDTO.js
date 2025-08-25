import LoginUserDRO from './LoginUserDTO.js';

class RegisterUserDRO extends LoginUserDRO {
  constructor(body) {
    super({ email: body.email, password: body.password });
    this.firstName = body.firstName;
    this.lastName = body.lastName;
    this.phoneNumber = body.phoneNumber;
  }
}

export default RegisterUserDRO;
