import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import productsServices from '../services/productsServices';
import { selectProduct, setProduct } from '../redux/features/home/productSlice';
import userServices from '../services/userServices';
import { setCart } from '../redux/features/home/cartSlice';
import { selectUser } from '../redux/features/auth/userSlice';
import { Link } from 'react-router-dom';

const Products = () => {
  const dispatch = useDispatch();
  const product = useSelector(selectProduct);
  const user = useSelector(selectUser);

  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsServices.product();
        dispatch(setProduct(response.data));
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchProducts();
  }, [dispatch]);

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    try {
      const cartData = { quantity: 1 };
      await userServices.addToCart(productId, cartData);

      const response = await userServices.GetAllCart();
      dispatch(setCart(response.data.cart));

      toast.success('Product added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const categories = ['All', 'Mobiles', 'Gadgets', 'Cloths'];

  const filteredProducts =
    selectedCategory === 'All'
      ? product
      : product.filter((p) => p.category === selectedCategory);

  return (
    <div className="px-4 sm:px-6 py-4">
      {/* Category Tags - Responsive */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full border ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-blue-100'
            } whitespace-nowrap`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid - Responsive */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="flex flex-col border rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-40 sm:h-48 md:h-52 w-full object-cover"
                />
              </Link>
              <div className="p-3 flex flex-col flex-grow">
                <h1 className="text-sm sm:text-base font-semibold line-clamp-2">{product.name}</h1>
                <p className="text-xs sm:text-sm text-gray-500 mb-1 line-clamp-2">{product.description}</p>
                <p className="text-sm sm:text-md font-bold mb-2 mt-auto">{product.price} $</p>
                <button
                  className="bg-blue-600 hover:bg-blue-500 text-white py-1 sm:py-2 rounded-xl w-full text-sm sm:text-base"
                  onClick={(e) =>
                    user ? handleAddToCart(e, product._id) : null
                  }
                >
                  {user ? 'Add to Cart' : <Link to="/login">Add to Cart</Link>}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;