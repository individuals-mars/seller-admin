import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategory, setFilteredCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state?.user?.token);

  console.log("user", {user: user, token: token})
  const fetchProducts = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sellerProducts = res.data.data.filter(
        (product) => product.seller._id === user._id
      );
      setProducts(sellerProducts);
    } catch (error) {
      console.error('❌ Product Fetch Error:', error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_BACKEND_URL +'/api/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('❌ Category Fetch Error:', error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = filteredCategory
      ? product.category?._id === filteredCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Mening Mahsulotlarim</h1>
        <button
          onClick={() => navigate('/createproduct')}
          className="btn btn-primary"
        >
          + Yangi mahsulot
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Qidiruv..."
          className="input input-bordered w-full max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="select select-bordered"
          value={filteredCategory}
          onChange={(e) => setFilteredCategory(e.target.value)}
        >
          <option value="">Barcha kategoriyalar</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>


      <div className="overflow-x-auto rounded-lg shadow">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base-content">
            <tr>
              <th>#</th>
              <th>Nomi</th>
              <th>Kategoriya</th>
              <th>Narx</th>
              <th>Ombor</th>
              <th>Faol</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.category?.name}</td>
                  <td>
                    {product.price?.sellingPrice?.toLocaleString()} so'm
                  </td>
                  <td>{product.stock ?? 0}</td>
                  <td>
                    <span
                      className={`badge ${
                        product.isActive ? 'badge-success' : 'badge-error'
                      }`}
                    >
                      {product.isActive ? 'Faol' : 'Bloklangan'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500">
                  Mahsulot topilmadi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
