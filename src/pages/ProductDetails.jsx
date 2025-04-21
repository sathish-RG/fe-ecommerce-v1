import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import productsServices from '../services/productsServices';
import { toast } from 'react-toastify';
import { selectSingleProduct, setSingleProduct } from '../redux/features/home/productSlice';
import { selectUser } from '../redux/features/auth/userSlice';
import userServices from '../services/userServices';
import { setCart } from '../redux/features/home/cartSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(selectSingleProduct);
  const user = useSelector(selectUser);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await productsServices.productDetails(id);
        dispatch(setSingleProduct(response.data));
      } catch (err) {
        toast.error(err.message || 'Failed to load product details');
      }
    };

    fetchProductDetails();
  }, [dispatch, id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      const cartData = { quantity: 1 };
      await userServices.addToCart(product._id, cartData);

      const response = await userServices.GetAllCart();
      dispatch(setCart(response.data.cart));

      toast.success('Product added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2 p-6 flex justify-center">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-auto max-h-96 object-contain rounded-lg"
              />
            </div>

            {/* Product Details */}
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold mb-1">
                {product.category}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center text-yellow-400 mr-2">
                  {/* Star ratings (you can replace with actual rating component) */}
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 text-sm">(24 reviews)</span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>

              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="ml-2 text-lg text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-center">
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
                    In Stock
                  </span>
                  <span className="text-sm text-gray-600">Ships in 1-2 business days</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
                >
                  Add to Cart
                </button>
                {!user && (
                  <Link
                    to="/login"
                    className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors duration-200"
                  >
                    Login to Purchase
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Additional Product Information */}
          <div className="p-6 md:p-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Specifications</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Brand: {product.brand || 'Generic'}</li>
                  <li>• Category: {product.category}</li>
                  <li>• Weight: 1.2 kg</li>
                  <li>• Dimensions: 10 x 15 x 5 cm</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Shipping & Returns</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Free shipping on orders over $50</li>
                  <li>• 30-day return policy</li>
                  <li>• Warranty: 1 year</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;