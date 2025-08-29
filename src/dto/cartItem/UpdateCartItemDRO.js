class UpdateCartItemDTO {
  constructor(body) {
    this.id = body.cartItemId;
    this.quantity = body.quantity;
  }
}

export default UpdateCartItemDTO;