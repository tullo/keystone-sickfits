import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import nProgress from 'nprogress';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import SickButton from './styles/SickButton';
import { useCart } from '../lib/cartState';
import { CURRENT_USER_QUERY } from './User';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

function CheckoutForm() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [checkout, { error: graphQLError }] = useMutation(
    CREATE_ORDER_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );
  const router = useRouter();
  const { closeCart } = useCart();

  async function handleSubmit(e) {
    // Stop the form from submitting.
    e.preventDefault();

    // Turn the loader one
    setLoading(true);

    console.log('Trigger the page transition!');

    // Start the page transition.
    nProgress.start();

    // Create the payment method via stripe
    // (token comes back here if successful).
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    console.log('Converted payment information from Stripe', paymentMethod);

    // Handle any errors from Stripe.
    if (error) {
      setError(error);
      nProgress.done();

      // Abort the checkout.
      return;
    }

    // Send the token returned from stripe to the keystone
    // server via a custom mutation,
    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    });

    console.log('Processed Order', order);

    // Switch to the order page.
    router.push({
      pathname: `/order/[id]`,
      query: {
        id: order.data.checkout.id,
      },
    });

    // Close the cart.
    closeCart();

    // Turn the loader off
    setLoading(false);

    // End the page transition.
    nProgress.done();
  }

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <p style={{ fontSize: 12 }}>{error.message}</p>}
      {graphQLError && <p style={{ fontSize: 12 }}>{graphQLError.message}</p>}
      <CardElement />
      <SickButton>Check Out Now</SickButton>
    </CheckoutFormStyles>
  );
}

function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

export { Checkout };
