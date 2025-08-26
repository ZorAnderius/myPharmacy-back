class ProductDTO {
  constructor(body) {
    this.name = body.name;
    this.description = body.description;
    this.price = body.price;
    this.quantity = body.quantity;
    this.category_id = body.category_id;
    this.status_id = body.status_id;
  }
}

export default ProductDTO;
