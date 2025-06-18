import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5";
import { BsListNested } from "react-icons/bs";
import { RiShoppingBasket2Fill } from "react-icons/ri";
import { SiSimpleanalytics } from "react-icons/si";
import { FaRegEnvelopeOpen } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";

const Sidebar = () => {
    const location = useLocation();
    const Name = import.meta.env.VITE_MARS_NAME;

    const menuItems = [
        {
            path: "/dashboard",
            icon: <IoHomeOutline />,
            label: "Dashboard"
        },
        {
            path: "/analytics",
            icon: <SiSimpleanalytics />,
            label: "Analytics"
        },
        {
            path: "/orders",
            icon: <BsListNested />,
            label: "Orders"
        },
        {
            label: "Shops",
            icon: <FaCartShopping />,
            children: [
                {
                    path: "/allshops",
                    label: "My Shops",
                },
                {
                    path: "/modalcreateshops",
                    label: "Modal Create Shops"
                }
            ]
        },
        {
            label: "Products",
            icon: <RiShoppingBasket2Fill />,
            children: [
                {
                    path: "/allproduct",
                    label: "All Product",

                },
                {
                    path: "/drafproduct",
                    label: "Draf Product",

                },
                {
                    path: "/lowproduct",
                    label: "Low Products",

                }
            ]
        },
        {
            path: "/reviews",
            icon: <FaRegEnvelopeOpen />,
            label: "Reviews"
        },
    ];

    const renderMenuItems = (items) => {
        return items.map((item, index) => {
            const isActive = item.path && location.pathname === item.path;

            if (item.children) {
                return (
                    <li key={index}>
                        <details open>
                            <summary className="flex items-center rounded-xl p-2 gap-5 p text-sm cursor-pointer ">
                                {item.icon} {item.label}
                            </summary>
                            <ul className="ml-4">
                                {item.children.map((child, childIndex) => {
                                    const isChildActive = child.path && location.pathname === child.path;
                                    return (
                                        <li
                                            key={childIndex}
                                            className={`relative ${isChildActive ? "border-primary text-primary bg-base-300 rounded-xl font-bold" : ""}`}
                                        >
                                            {isChildActive && (
                                                <div className='bg-primary absolute -left-18 top-0 max-w-0.5 w-0.5 h-full'></div>
                                            )}
                                            <Link
                                                className="text-sm flex gap-5 items-center py-2 hover:bg-base-300 flex-1 px-2 rounded-xl overflow-y-auto"
                                                to={child.path}
                                            >
                                                {child.icon} {child.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </details>
                    </li>
                );
            }

            return (
                <li
                    key={index}
                    className={`relative ${isActive ? "border-primary text-primary bg-base-300 rounded-xl font-bold flex flex-col " : ""}`}
                >
                    {isActive && (
                        <div className='bg-primary absolute -left-12 top-0 max-w-0.5 w-0.5 h-full'></div>
                    )}
                    <Link
                        className="text-sm flex gap-5 items-center py-2 hover:bg-base-300  px-2 rounded-xl"
                        to={item.path}
                    >
                        {item.icon} {item.label}
                    </Link>
                </li>
            );
        });
    };

    return (
        <div className="w-2/12 fixed top-0 left-0 ">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="w-full">
                <div className='flex w-full flex-col justify-center text-center h-[20%] items-center'>
                    <Link to={"/dashboard"}>
                        <img src="../src/assets/logo.png" className='size-24' alt="Logo" />
                    </Link>
                    <p className='text-primary text-sm'>{Name} Dashboard</p>
                </div>
                <ul className="menu overflow-y-auto text-base-content mt-5 max-h-[50%] rounded-[40px] gap-1 relative flex flex-col w-full h-auto flex-grow transition-all py-6 px-6">
                    {renderMenuItems(menuItems)}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
