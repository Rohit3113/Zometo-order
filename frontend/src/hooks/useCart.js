import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'cart';
const EMPTY_CART = {
  items: [],
  totalPrice: 0,
  totalCount: 0,
};

export default function CartProvider({ children }) {


  const initCart = (() => {
    const storedCart = localStorage.getItem(CART_KEY);
  
    // Log the content of storedCart to help with debugging
    console.log("Stored Cart:", storedCart);
  
    // Check if storedCart is not undefined and not null
    if (storedCart !== undefined && storedCart !== null) {
      try {
        // Attempt to parse the storedCart string as JSON
        return JSON.parse(storedCart);
      } catch (error) {
        // Handle any potential JSON parsing errors
        console.error("Error parsing JSON from local storage:", error);
      }
    }
    // If there was an issue or the data was not present, return the EMPTY_CART
    return EMPTY_CART;
  })();
  
  const [cartItems, setCartItems] = useState(initCart.items);
  const [totalPrice, setTotalPrice] = useState(initCart.totalPrice);
  const [totalCount, setTotalCount] = useState(initCart.totalCount);

  const sum = items => {
    return items.reduce((prevValue, curValue) => prevValue + curValue, 0);
  };

  useEffect(() => {
    const totalPrice = sum(cartItems.map(item => item.price));
    const totalCount = sum(cartItems.map(item => item.quantity));
    setTotalPrice(totalPrice);
    setTotalCount(totalCount);

    localStorage.setItem(
      CART_KEY,
      JSON.stringify({
        items: cartItems,
        totalPrice,
        totalCount,
      })
    );
  }, [cartItems]);

  const removeFromCart = foodId => {
    const filteredCartItems = cartItems.filter(item => item.food.id !== foodId);
    setCartItems(filteredCartItems);
  };
  
  
  const changeQuantity = (cartItem, newQauntity) => {
    const { food } = cartItem;

    const changedCartItem = {
      ...cartItem,
      quantity: newQauntity,
      price: food.price * newQauntity,
    };

    setCartItems(
      cartItems.map(item => (item.food.id === food.id ? changedCartItem : item))
    );
  };

  const addToCart = food => {
    const cartItem = cartItems.find(item => item.food.id === food.id);
    if (cartItem) {
      changeQuantity(cartItem, cartItem.quantity + 1);
    } else {
      setCartItems([...cartItems, { food, quantity: 1, price: food.price }]);
    }
  };

  const clearCart = () => {
    localStorage.removeItem(CART_KEY);
    const { items, totalPrice, totalCount } = EMPTY_CART;
    setCartItems(items);
    setTotalPrice(totalPrice);
    setTotalCount(totalCount);
  };

  return (
    <CartContext.Provider
      value={{
        cart: { items: cartItems, totalPrice, totalCount },
        removeFromCart,
        changeQuantity,
        addToCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);



