import { KeystoneContext, SessionStore } from '@keystone-next/types';
import { CartItem } from '../schemas/CartItem';
import { Session } from '../types';
import { CartItemCreateInput } from '../.keystone/schema-types';

// HOW TO TEST THIS:
//
// http://keystone.127.0.0.1.xip.io:3000/api/graphql
// mutation {
//   addToCart(productId: "604cdca697d045778a8c50e6") {
//     id
//     quantity
//   }
// }
//
// Execute the Query a few times

async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  // Is the current user signed in?
  const userSession = context.session as Session;
  if (!userSession.itemId) {
    throw new Error('You must be logged in to do this!');
  }

  // Query the current users cart items.
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: userSession.itemId }, product: { id: productId } },
    resolveFields: 'id,quantity',
  });

  // Destructure the first cart item from the array.
  const [existingCartItem] = allCartItems;

  // Update quantity of existing cart item in the user's cart.
  if (existingCartItem) {
    console.log(existingCartItem);
    console.log(
      `There are already ${existingCartItem.quantity}, increment by 1!`
    );

    // See if the current item is in user's cart.
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: {
        quantity: existingCartItem.quantity + 1, // It's in the cart => increment by 1
      },
      resolveFields: false,
    });
  }
  // If it isn't => create a new cart item!
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: userSession.itemId } },
    },
    resolveFields: false,
  });
}

export default addToCart;
