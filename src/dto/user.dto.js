class UserDTO {
  constructor(user) {
    (this.first_name = user.first_name), (this.email = user.email);
    this.role = user.role;
  }
}

export default UserDTO;

//normaliza la informacion que recibe
