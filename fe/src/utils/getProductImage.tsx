export const getProductImage = (fileName: string) => {
  try {
    console.log( `../assets/images/products/${fileName}`);
    
    return `../assets/images/products/${fileName}`;
    // return require(`../assets/images/products/${fileName}`);
  } catch {
    return `../assets/images/products/default.png`;
    // return require(`../assets/images/products/default.png`);
  }
};
