const NavBar = () => {
    return (
        <nav className="bg-red border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
                {/* Logo */}
                <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img
                        src="https://flowbite.com/docs/images/logo.svg"
                        className="h-8"
                        alt="Flowbite Logo"
                    />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Flowbite
          </span>
                </a>

                {/* Menu chính (chỗ này thêm flex!) */}
                <div className="flex items-center gap-10 font-medium">
                    <a
                        href="#"
                        className="text-blue-700 dark:text-blue-500"
                    >
                        Home
                    </a>
                    <a
                        href="#"
                        className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
                    >
                        About
                    </a>
                    <a
                        href="#"
                        className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
                    >
                        Services
                    </a>
                    <a
                        href="#"
                        className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
                    >
                        Pricing
                    </a>
                    <a
                        href="#"
                        className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
                    >
                        Contact
                    </a>
                </div>

                {/* Ngôn ngữ */}
                <div className="flex items-center space-x-2">
                    <img
                        src="https://flagcdn.com/w20/us.png"
                        alt="US flag"
                        className="w-5 h-5"
                    />
                    <span className="text-gray-900 dark:text-white text-sm font-medium">
            English (US)
          </span>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
