import styled from 'styled-components';
import PropTypes from 'prop-types';
import Image from 'next/image';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import Supreme from './styles/Supreme';
import formatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';
import { useCart } from '../lib/cartState';
import useUser from './User';
import RemoveFromCart from './RemoveFromCart';
import { Checkout } from './Checkout';

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid var(--lightGray);
  display: grid;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 1rem;
  }
  h3,
  p {
    margin: 0;
  }
`;

CartItem.defaultProps = {
  cartItem: '',
};

CartItem.propTypes = {
  cartItem: PropTypes.object,
};

function CartItem({ cartItem }) {
  const { product } = cartItem;
  if (!product) return null;
  return (
    <CartItemStyles>
      <Image
        width="100"
        src={product.photo.image.publicUrlTransformed}
        alt={product.name}
      />
      <div>
        <h3>{product.name}</h3>
        <p>
          {formatMoney(product.price * cartItem.quantity)} (
          <em>
            {cartItem.quantity} &times; {formatMoney(product.price)}
          </em>
        </p>
      </div>
      <RemoveFromCart id={cartItem.id} />
    </CartItemStyles>
  );
}

export default function Cart() {
  const me = useUser();
  const { cartOpen, closeCart } = useCart();
  if (!me) return null;
  return (
    <CartStyles open={cartOpen}>
      <header>
        <Supreme>{me.name}'s Cart</Supreme>
        <CloseButton onClick={closeCart}>&times;</CloseButton>
      </header>
      <ul>
        {me.cart.map((cartItem) => (
          <CartItem key={cartItem.id} cartItem={cartItem} />
        ))}
      </ul>
      <footer>
        <p>{formatMoney(calcTotalPrice(me.cart))}</p>
        <Checkout />
      </footer>
    </CartStyles>
  );
}
