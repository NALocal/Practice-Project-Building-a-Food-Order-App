import { useContext, useState } from 'react';

import classes from './Cart.module.css';

import Modal from '../UI/Modal';

import CartItem from './CartItem';

import CartContext from '../../store/cart-context';

import Checkout from './Checkout';

const Cart = props => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const cartCtx = useContext(CartContext);
  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const cartItemRemoveHandler = id => {
    cartCtx.removeItem(id);
  };
  const cartItemAddHandler = item => {
    cartCtx.addItem({ ...item, amount: 1 });
  };
  const orderHandler = () => {
    setIsCheckout(true);
  };
  const submitOrderHandler = async userData => {
    setIsSubmitting(true);
    await fetch('https://foodorder-7a19c-default-rtdb.firebaseio.com/order.json', {
      method: 'POST',
      body: JSON.stringify({
        user: userData,
        orderedItems: cartCtx.items,
      })
    });
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  };
  const cartItems = (
    <ul className={classes['cart-items']}>
      {/* {[{ id: 'c1', name: 'Sushi', amount: 2, price: 12.99 }].map(item => <li>{item.name}</li>)} */}
      {cartCtx.items.map(item => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)} />))}
    </ul>);
  const hasItem = cartCtx.items.length > 0;
  const modalActions = (<div className={classes.actions}>
    <button className={classes['button--alt']} onClick={props.onHideCart}>Close</button>
    {hasItem && <button className={classes.button} onClick={orderHandler}>Order</button>}
  </div>);
  const cartModalContent = (
    <>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout ? <Checkout onConfirm={submitOrderHandler} onCancel={props.onHideCart} /> : modalActions}
    </>);
  const isSubmittingModalContent = <p>Sending order data...</p>;
  const didSubmitModalContent = (
    <>
      <p>Successfully sent the order!!</p>
      <div className={classes.actions}>
        <button className={classes.button} onClick={props.onHideCart}>Close</button>
      </div>
    </>
  );
  return (
    <Modal onClick={props.onHideCart}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;