export default function calcTotalPrice(cart) {
  return cart.reduce((tally, cartItem) => {
    if (!cartItem.product) {
      // products can be deleted, but they could still be in a user's cart.
      return tally;
    }
    return tally + cartItem.quantity * cartItem.product.price;
  }, 0);
}
