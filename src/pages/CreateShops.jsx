import React, { useState, useEffect } from 'react';
import { SiGooglemaps } from 'react-icons/si';
import { MdEdit, MdOutlineLocalPhone, MdVisibility } from 'react-icons/md';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateShops = () => {
    const [showModal, setShowModal] = useState(false);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        shopname: '',
        address: '',
        description: '',
        logotype: '',
        location: '',
        phone: '',
        TariffPlan: 'basic',
    });

    const token = useSelector((state) => state.user.token);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShops = async () => {
            if (!token) {
                toast.error('Please log in to view shops');
                setFetchLoading(false);
                return;
            }

            setFetchLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/shop`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch shops');
                }
                const data = await response.json();
                setShops(Array.isArray(data) ? data : data.data || []);
            } catch (err) {
                console.error('Error fetching shops:', err);
                toast.error(err.message || 'Failed to load shops');
            } finally {
                setFetchLoading(false);
            }
        };
        fetchShops();
    }, [token]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.shopname.trim()) newErrors.shopname = 'Shop name is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.location.match(/^-?\d+\.\d+,-?\d+\.\d+$/)) {
            newErrors.location = 'Location must be in "lat,lon" format (e.g., 41.3111,69.2797)';
        }
        if (!formData.phone.match(/^\+?\d{10,15}$/)) {
            newErrors.phone = 'Phone must be a valid number (e.g., +998901234567)';
        }
        if (formData.logotype && !formData.logotype.match(/^https?:\/\/.*\.(png|jpg|jpeg|gif)$/)) {
            newErrors.logotype = 'Logo must be a valid image URL';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateShop = async () => {
        if (!token) {
            toast.error('Please log in to create a shop');
            return;
        }

        if (!validateForm()) {
            toast.error('Please fix form errors');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/shop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error creating shop');
            }

            const newShop = await response.json();
            setShops((prev) => [...prev, newShop]);
            setShowModal(false);
            setFormData({
                shopname: '',
                address: '',
                description: '',
                logotype: '',
                location: '',
                phone: '',
                TariffPlan: 'basic',
            });
            setErrors({});
            toast.success('Shop created successfully');
        } catch (err) {
            console.error('Error creating shop:', err);
            toast.error(err.message || 'Error creating shop');
        } finally {
            setLoading(false);
        }
    }

    const handleShopClick = (shopId) => {
        if (shopId) {
            navigate(`/shopdetail/${shopId}`);
        } else {
            toast.error('Shop ID is missing');
        }
    };

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setShowModal(false);
        };
        if (showModal) {
            document.addEventListener('keydown', handleEsc);
        }
        return () => document.removeEventListener('keydown', handleEsc);
    }, [showModal]);

    return (
        <div className="p-6">
            <div className="flex justify-between mb-3">
                <h1 className="font-semibold text-2xl mb-4">Shops</h1>
                <button
                    className="p-3 btn btn-success rounded-lg text-base-100 flex"
                    onClick={() => setShowModal(true)}
                    aria-label="Create new shop"
                    disabled={!token}
                    aria-disabled={!token}
                >
                    <FiPlus className="mr-1 my-1" /> Create Shop
                </button>
            </div>
            <hr className="mb-6 border-base-300" />

            {fetchLoading ? (
                <div className="flex flex-wrap gap-6">
                    {[...Array(1)].map((_, i) => (
                        <div key={i} className="skeleton h-[260px] w-[390px] mt-4"></div>
                    ))}
                </div>
            ) : shops.length === 0 ? (
                <p className="text-center text-gray-500">No shops available</p>
            ) : (
                <div className="flex flex-wrap gap-6">
                    {shops.map((shop, index) => (
                        <div
                            key={shop.id || index}
                            className="card bg-base-100 shadow-xl w-[390px] h-[260px] cursor-pointer hover:shadow-2xl transition-shadow"
                        >
                            <div className="card-body flex flex-row items-center gap-4" onClick={() => handleShopClick(shop._id)}>
                                <img
                                    src={shop.logotype || '/image-removebg-preview.png'}
                                    alt={`${shop.shopname} logo`}
                                    className="w-24 h-24 object-contain rounded-full bg-success"
                                />
                                <div>
                                    <h2 className="card-title text-lg">{shop.shopname}</h2>
                                    <p className="text-sm text-gray-500 flex mt-2">
                                        <SiGooglemaps className="mr-1 mt-2" />
                                        {shop.address}
                                    </p>
                                    <p className="text-sm text-gray-500 flex mt-2">
                                        <MdOutlineLocalPhone className="mr-1 mt-1" />
                                        {shop.phone || '+998901234567'}
                                    </p>
                                </div>
                            </div>
                            <hr className="border-base-300" />
                            <div>
                                <div className="flex justify-between p-5 text-center">
                                    <div>
                                        <p className="font-bold text-base-350">{shop.commission || '10%'}</p>
                                        <p className="text-xs text-base-350">Commission</p>
                                    </div>
                                    <p className="text-gray-500">|</p>
                                    <div>
                                        <p className="font-bold text-base-350">{shop.sales || '0'}</p>
                                        <p className="text-xs text-base-350">Sales</p>
                                    </div>
                                    <p className="text-gray-500">|</p>
                                    <div>
                                        <p className="font-bold text-base-350">{shop.balance || '0'}</p>
                                        <p className="text-xs text-base-350">Balance</p>
                                    </div>
                                    <p className="text-gray-500">|</p>
                                    <div>
                                        <p className="font-bold text-base-350">{shop.withdraw || '0'}</p>
                                        <p className="text-xs text-base-350">Withdraw</p>
                                    </div>

                                </div>
                            </div>
                            
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal modal-open" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <div className="modal-box">
                        <h3 id="modal-title" className="font-bold text-lg">Create Branch</h3>
                        <div className="mt-5">
                            <label className="py-2 font-semibold" htmlFor="logotype">Logo URL</label>
                            <input
                                id="logotype"
                                type="text"
                                className={`border border-base-300 p-2 w-full rounded-lg ${errors.logotype ? 'border-error' : ''}`}
                                placeholder="https://your-logo-url.com/image.png"
                                value={formData.logotype}
                                onChange={(e) => setFormData({ ...formData, logotype: e.target.value })}
                            />
                            {errors.logotype && <p className="text-error text-sm">{errors.logotype}</p>}
                        </div>

                        <div className="mt-2">
                            <label className="py-2 font-semibold" htmlFor="shopname">Shop Name</label>
                            <input
                                id="shopname"
                                type="text"
                                className={`border border-base-300 p-2 w-full rounded-lg ${errors.shopname ? 'border-error' : ''}`}
                                placeholder="Create New Branch"
                                value={formData.shopname}
                                onChange={(e) => setFormData({ ...formData, shopname: e.target.value })}
                            />
                            {errors.shopname && <p className="text-error text-sm">{errors.shopname}</p>}
                        </div>

                        <div className="mt-2">
                            <label className="py-2 font-semibold" htmlFor="address">Address</label>
                            <input
                                id="address"
                                type="text"
                                className={`border border-base-300 p-2 w-full rounded-lg ${errors.address ? 'border-error' : ''}`}
                                placeholder="Address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                            {errors.address && <p className="text-error text-sm">{errors.address}</p>}
                        </div>

                        <div className="mt-2">
                            <label className="py-2 font-semibold" htmlFor="phone">Phone</label>
                            <input
                                id="phone"
                                type="text"
                                className={`border border-base-300 p-2 w-full rounded-lg ${errors.phone ? 'border-error' : ''}`}
                                placeholder="+998 90 123 45 67"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            {errors.phone && <p className="text-error text-sm">{errors.phone}</p>}
                        </div>

                        <div className="mt-2">
                            <label className="py-2 font-semibold" htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                className="border border-base-300 p-2 w-full rounded-lg h-24"
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="mt-2">
                            <label className="py-2 font-semibold" htmlFor="location">Location (lat,lon)</label>
                            <input
                                id="location"
                                type="text"
                                className={`border border-base-300 p-2 w-full rounded-lg ${errors.location ? 'border-error' : ''}`}
                                placeholder="41.3111,69.2797"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                            {errors.location && <p className="text-error text-sm">{errors.location}</p>}
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn btn-error"
                                onClick={() => setShowModal(false)}
                                aria-label="Cancel"
                            >
                                Cancel
                            </button>
                            <button
                                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                                onClick={handleCreateShop}
                                disabled={loading || !token}
                                aria-disabled={loading || !token}
                                aria-label="Create Shop"
                            >
                                {loading ? 'Creating...' : 'Create Shop'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateShops;