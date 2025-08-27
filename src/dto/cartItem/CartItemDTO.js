class CartItemDTO {
  constructor(body) {
    this.product_id = body.product_id;
    this.quantity = body.quantity;
  }
}

export default CartItemDTO;