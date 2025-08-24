class UpdateShopDTO {
  constructor(body) {
    this.name = body.name;
    this.ownerName = body.ownerName;
    this.phone = body.phone;
    this.email = body.email;
    this.hasDelivery = body.hasDelivery;

    this.street = body.street;
    this.apartment = body.apartment;
    this.code = body.code;
    this.city = body.city;
  }
}

export default UpdateShopDTO;
