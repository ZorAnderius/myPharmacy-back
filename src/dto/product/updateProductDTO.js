class UpdateProductDTO {
  constructor(body) {
    this.name = body.name;
    this.description = body.description;
    this.price = body.price;
    this.quantity = body.quantity;
    this.catalog_id = body.catalog_id;
    this.status_id = body.status_id;
  }
}

export default UpdateProductDTO;
