import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdOutlineSaveAlt } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { createPortal } from "react-dom";
import { RxCross2 } from "react-icons/rx";

const CreateProduct = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      toast.error("Ошибка при получении магазинов");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/categories"
      );
      setCategories(res.data);
    } catch {
      toast.error("Ошибка при загрузке категорий");
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setForm({ ...form, category: categoryId, subcategory: "" });
    const selectedCategory = categories.find((c) => c._id === categoryId);
    setSubcategories(selectedCategory?.subcategories || []);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setSelectedImage(file);
    setPreviewURL(url);
    setUploadedImages((prev) => [...prev, url]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      category,
      subcategory,
      shop,
      costPrice,
      sellingPrice,
      stock,
      description,
      label,
    } = form;

    if (
      !name ||
      !category ||
      !subcategory ||
      !shop ||
      !costPrice ||
      !sellingPrice
    ) {
      return toast.warn("Пожалуйста, заполните все обязательные поля");
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (selectedImage) formData.append("image", selectedImage);

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

      toast.success("Товар успешно создан");
      navigate("/products");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Произошла ошибка при создании"
      );
    }
  };

  return (
    <div className="flex w-full">
      {/* Левая часть формы */}
      <div className="w-1/2 p-6">
        <h2 className="text-2xl font-semibold mb-4">Добавить новый товар</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Название товара"
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
              <option value="">Выберите категорию</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.title}
                </option>
              ))}
            </select>
            {form.category && (
              <select
                className="select select-bordered w-full"
                value={form.subcategory}
                onChange={(e) =>
                  setForm({ ...form, subcategory: e.target.value })
                }
              >
                <option value="">Выберите подкатегорию</option>
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
            <option value="">Выберите магазин</option>
            {shops.map((shop) => (
              <option key={shop._id} value={shop._id}>
                {shop.shopname}
              </option>
            ))}
          </select>

          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Закупочная цена"
              className="input input-bordered w-full"
              value={form.costPrice}
              onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
            />
            <input
              type="number"
              placeholder="Цена продажи"
              className="input input-bordered w-full"
              value={form.sellingPrice}
              onChange={(e) =>
                setForm({ ...form, sellingPrice: e.target.value })
              }
            />
          </div>

          <input
            type="number"
            placeholder="Количество на складе"
            className="input input-bordered w-full"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <input
            type="text"
            placeholder="Метка"
            className="input input-bordered w-full"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
          <textarea
            placeholder="Описание"
            className="textarea textarea-bordered w-full"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          ></textarea>
          <button className="btn btn-primary w-full">Создать</button>
        </form>
      </div>

      {/* Правая часть: изображение */}
      <div className="w-1/2 pt-[70px] flex flex-col gap-4 px-4">
        <div className="flex gap-4 h-80 relative">
          {/* Большое превью */}
          <div
            onClick={handleImageClick}
            className="w-full bg-base-300 border-2 border-success rounded-xl cursor-pointer flex items-center justify-center overflow-hidden relative"
          >
            {previewURL ? (
              <>
                <img
                  src={previewURL}
                  alt="preview"
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewURL(null);
                    setSelectedImage(null);
                    setUploadedImages([]);
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-100"
                >
                  <RxCross2 />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <MdOutlineSaveAlt className="text-5xl text-primary" />
                <p className="text-xs mt-2">Здесь отобразится изображение</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Маленькие карточки */}
          <div className="w-1/2 flex flex-wrap gap-2 content-start">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="relative group">
                {uploadedImages[idx] ? (
                  <img
                    src={uploadedImages[idx]}
                    alt={`upload-${idx}`}
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                ) : (
                  <div className="w-20 h-20 bg-base-200 rounded-md border flex items-center justify-center text-gray-400 text-sm">
                    Пусто
                  </div>
                )}
              </div>
            ))}
            {uploadedImages.length > 3 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-20 h-20 bg-base-200 rounded-md border flex items-center justify-center text-3xl text-primary"
              >
                <IoMdAdd />
              </button>
            )}
          </div>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Выберите файл</legend>
            <input
              type="file"
              className="file-input"
              onChange={handleImageChange}
            />
            <label className="label">Максимум 2MB</label>
          </fieldset>
        </div>
      </div>

      {/* Модалка всех изображений */}
      {isModalOpen &&
        createPortal(
          <>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <button
              className="btn"
              onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              open modal
            </button>
            <dialog id="my_modal_3" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">
                  Press ESC key or click on ✕ button to close
                </p>
              </div>
            </dialog>

            
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Все загруженные изображения
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-lg"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {uploadedImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`modal-${idx}`}
                      className="w-full h-32 object-cover rounded-md border"
                    />
                  ))}
                </div>
              </div>
            </div>
            , document.body
          </>
        )}
    </div>
  );
};

export default CreateProduct;
