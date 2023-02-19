import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

CartStateProvider.defaultProps = {
  children: '',
};

CartStateProvider.propTypes = {
  children: PropTypes.object,
};

// This is a custom local state provider.
//
// It's used to store data (state) and functionality (updaters)
// in here and anyone can access it via the consumer.
//
// interface Context<T> {
//     Provider: Provider<T>;
//     Consumer: Consumer<T>;
//     displayName?: string;
// }
function CartStateProvider({ children }) {
  // Cart is closed by default
  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function openCart() {
    setCartOpen(true);
  }

  return (
    <LocalStateProvider
      value={{
        cartOpen,
        setCartOpen,
        toggleCart,
        closeCart,
        openCart,
      }}
    >
      {children}
    </LocalStateProvider>
  );
}

// Custom hook for accessing the cart local state.
function useCart() {
  // Use the local state <Consumer> to access local state.
  const all = useContext(LocalStateContext);

  return all;
}

export { CartStateProvider, useCart };
