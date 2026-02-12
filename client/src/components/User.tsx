import { Dropdown } from "flowbite-react"
import { Avatar } from "flowbite-react/components/Avatar"
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Settings, FileText } from "lucide-react";

const User = () => {
    const [openModal, setOpenModal] = useState(false);
    const { currentUser, logout } = useAuth();
    const photoURL = currentUser?.photoURL

    const handleLogOut = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error during sign-in:', error);
        }
    };

    return (
        <div className='flex items-center justify-center'>
            <Dropdown
                arrowIcon={false}
                inline
                label={
                    <div className="hover:ring-2 hover:ring-slate-200 rounded-full transition-all duration-300">
                        <Avatar
                            alt="User"
                            img={photoURL ? photoURL : 'https://ui-avatars.com/api/?name=User&background=0F172A&color=fff'}
                            rounded
                            className="bg-slate-100"
                        />
                    </div>
                }
                className="w-64 p-2 rounded-xl shadow-xl border border-slate-100"
            >
                <Dropdown.Header className="px-4 py-3">
                    <span className="block text-sm font-semibold text-slate-900">{currentUser?.displayName || 'User'}</span>
                    <span className="block truncate text-xs font-medium text-slate-500 mt-0.5">{currentUser?.email}</span>
                </Dropdown.Header>

                <div className="py-1">
                    <Link to='risk-profile'>
                        <Dropdown.Item className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                            <FileText size={16} />
                            Risk profile
                        </Dropdown.Item>
                    </Link>
                    <Link to='settings'>
                        <Dropdown.Item className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                            <Settings size={16} />
                            Settings
                        </Dropdown.Item>
                    </Link>
                </div>

                <Dropdown.Divider className="my-1 border-slate-100" />

                <Dropdown.Item
                    onClick={() => setOpenModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                >
                    <LogOut size={16} />
                    Sign out
                </Dropdown.Item>
            </Dropdown>

            <Modal show={openModal} size="sm" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center pt-4">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-slate-400" />
                        <h3 className="mb-6 text-lg font-normal text-slate-600">
                            Are you sure you want to sign out?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleLogOut} className="px-2">
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={() => setOpenModal(false)} className="px-2">
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default User