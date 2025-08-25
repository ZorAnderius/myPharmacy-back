import UpdateProductDTO from './updateProductDTO.js';

class CreateProductDTO extends UpdateProductDTO {
  constructor(body) {
    super(body);
    this.supplier_id = body.supplier_id;
  }
}

export default CreateProductDTO;
