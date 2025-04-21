import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCart, setCart } from '../redux/features/home/cartSlice';
import { toast } from 'react-toastify';
import userServices from '../services/userServices';
import { selectUser } from '../redux/features/auth/userSlice';
import { Link } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const user = useSelector(selectUser);
  
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if(user){
          const response = await userServices.GetAllCart();
          dispatch(setCart(response.data.cart));
        }
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchCart();
  }, [dispatch, user]);

  if (!Array.isArray(cart)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading cart items...</div>
      </div>
    );
  }

  const handleDeleteCart = async (e, productId) => {
    e.preventDefault();
    try {
      await userServices.deleteCart(productId);
      toast.success("Item removed successfully");

      const response = await userServices.GetAllCart();
      dispatch(setCart(response.data.cart));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateQuantity = async (productId, newQty) => {
    try {
      if (user && newQty > 0) { // Prevent zero or negative quantities
        await userServices.addQuantity(productId, { quantity: newQty });
        toast.success("Quantity updated");

        const response = await userServices.GetAllCart();
        dispatch(setCart(response.data.cart));
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const totalAmount = cart.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

  const cartList = cart.map((item) => (
    <div 
      key={item._id} 
      className="flex flex-col w-full sm:w-[300px] border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <img 
        src={item.productId?.image} 
        alt={item.productId?.name} 
        className="w-full h-48 sm:h-56 object-cover rounded-t-lg" 
      />
      <div className="p-4 flex flex-col flex-grow">
        <h1 className="text-lg font-bold line-clamp-2">{item.productId?.name}</h1>
        <div className="flex items-center justify-between my-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
            >
              -
            </button>
            <span className="font-medium">{item.quantity}</span>
            <button 
              onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
            >
              +
            </button>
          </div>
          <p className="text-md font-medium">${(item.productId?.price * item.quantity).toFixed(2)}</p>
        </div>
        <button 
          onClick={(e) => handleDeleteCart(e, item.productId?._id)}
          className="mt-auto bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg transition-colors duration-200"
        >
          Remove Item
        </button>
      </div>
    </div>
  ));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
          <Link 
            to="/" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {cartList}
          </div>
          
          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal ({cart.length} items)</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="block mt-6 bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-lg transition-colors duration-200"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;