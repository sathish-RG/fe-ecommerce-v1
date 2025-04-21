import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCart, setCart } from '../redux/features/home/cartSlice';
import { toast } from 'react-toastify';
import userServices from '../services/userServices';
import { selectAddress, setAddress } from '../redux/features/home/orderSlice';
import { Link, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const cartItems = useSelector(selectCart);
  const address = useSelector(selectAddress);
  const dispatch = useDispatch();
  const navigate=useNavigate();

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!address.trim()) {
      toast.error('Please enter a valid address!');
      return;
    }

    const orderData = {
      address,
      cart: cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
    };

    try {
      await userServices.placeOrder(orderData);
      dispatch(setAddress(''));
      await userServices.deletAllcart();
      dispatch(setCart([]));
      navigate('/');
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place the order.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Checkout</h1>

        {/* Address Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-700 mb-3">Shipping Address</h2>
          <textarea
            id="address"
            name="address"
            placeholder="Enter your full address including street, city, and postal code"
            rows="4"
            value={address}
            onChange={(e) => dispatch(setAddress(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        {/* Order Summary Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Order Summary</h2>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">Your cart is empty!</p>
              <Link 
                to="/products" 
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="border rounded-lg divide-y">
              {cartItems.map((item) => (
                <div key={item.productId._id} className="p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.productId.image} 
                      alt={item.productId.name} 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">{item.productId.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">${(item.productId.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-700 mb-3">Payment Method</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <input 
                id="cash-on-delivery" 
                name="payment-method" 
                type="radio" 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                checked 
                readOnly
              />
              <label htmlFor="cash-on-delivery" className="ml-3 block text-sm font-medium text-gray-700">
                Cash on Delivery
              </label>
            </div>
          </div>
        </div>

        {/* Total and Checkout Button */}
        <div className="border-t pt-6">
          <div className="flex justify-between text-lg font-medium mb-6">
            <span>Total:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          
          <button
            onClick={handlePlaceOrder}
            disabled={cartItems.length === 0}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors duration-200 ${
              cartItems.length === 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;