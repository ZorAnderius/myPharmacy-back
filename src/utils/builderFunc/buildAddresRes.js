const buildAddresRes = address => {
  return address
    ? {
        street: address.street,
        apartment: address.apartment,
        zipCode: address.zipCode?.code,
        city: address.zipCode?.city,
      }
    : null;
};

export default buildAddresRes;
