import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const navigate = useNavigate();
  const { token, _id } = useSelector((state) => state.user.user);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    subcategory: "",
    shop: "",
    costPrice: "",
    sellingPrice: "",
    stock: "",
    description: "",
    label: "",
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/shops/myshops",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShops(res.data);
    } catch {
      toast.error("Magazinlarni yuklashda xatolik");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/categories"
      );
      setCategories(res.data);
    } catch {
      toast.error("Kategoriyalarni yuklashda xatolik");
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setForm({ ...form, category: categoryId, subcategory: "" });

    const selectedCategory = categories.find((c) => c._id === categoryId);
    setSubcategories(selectedCategory?.subcategories || []);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    setPreviewURLs(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      category,
      shop,
      costPrice,
      sellingPrice,
      stock,
      description,
      subcategory,
      label,
    } = form;

    if (!name || !category || !shop || !costPrice || !sellingPrice || !stock) {
      return toast.warn("Barcha majburiy maydonlarni to‘ldiring");
    }

    try {
      const formData = new FormData();

      const productData = {
        name,
        category,
        seller: _id,
        shop,
        stock: Number(stock),
        price: {
          costPrice: Number(costPrice),
          sellingPrice: Number(sellingPrice),
        },
        description,
        tags: label ? [label] : [],
        subcategory: subcategory || null,
      };

      formData.append("product", JSON.stringify(productData));

      selectedImages.forEach((img) => formData.append("images", img));

      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Mahsulot muvaffaqiyatli yaratildi");
      navigate("/products");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Mahsulot yaratishda xatolik yuz berdi"
      );
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Yangi mahsulot qo‘shish</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Mahsulot nomi"
          className="input input-bordered w-full"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />


        <div className="flex gap-4">
          <select
            className="select select-bordered w-full"
            value={form.category}
            onChange={handleCategoryChange}
          >
            <option value="">Kategoriya tanlang</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name || cat.title}
              </option>
            ))}
          </select>

          {subcategories.length > 0 && (
            <select
              className="select select-bordered w-full"
              value={form.subcategory}
              onChange={(e) =>
                setForm({ ...form, subcategory: e.target.value })
              }
            >
              <option value="">Subkategoriya</option>
              {subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <select
          className="select select-bordered w-full"
          value={form.shop}
          onChange={(e) => setForm({ ...form, shop: e.target.value })}
        >
          <option value="">Magazin tanlang</option>
          {shops.map((shop) => (
            <option key={shop._id} value={shop._id}>
              {shop.shopname}
            </option>
          ))}
        </select>

        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Narxi (ulgurji)"
            className="input input-bordered w-full"
            value={form.costPrice}
            onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Narxi (sotuv)"
            className="input input-bordered w-full"
            value={form.sellingPrice}
            onChange={(e) =>
              setForm({ ...form, sellingPrice: e.target.value })
            }
          />
        </div>

        <input
          type="number"
          placeholder="Ombor miqdori"
          className="input input-bordered w-full"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <input
          type="text"
          placeholder="Teg (optional)"
          className="input input-bordered w-full"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />

        <textarea
          placeholder="Tavsif"
          className="textarea textarea-bordered w-full"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        ></textarea>

        <div>
          <button
            type="button"
            className="btn btn-outline w-full"
            onClick={() => fileInputRef.current.click()}
          >
            Rasmlar yuklash
          </button>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
          {previewURLs.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {previewURLs.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`preview-${idx}`}
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Yaratish
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
