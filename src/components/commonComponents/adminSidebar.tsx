const AdminSidebar = () => {
    return (
        <div className="flex items-center justify-end h-screen w-2/5 bg-purple-300">
            <div className="relative flex flex-col items-center justify-center bg-purple-300 w-4/5 h-4/5 shadow-2xl rounded-lg p-6">
                <div className="relative">
                    <img src="/images/logo.png" alt="logo" className="w-80 h-auto mx-auto" />
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center w-full px-4 pt-4">
                        <p className="text-lg text-gray-800 font-semibold mb-2">
                            Lead with vision, manage with wisdom.
                        </p>
                        <p className="text-md text-gray-700">
                            Your leadership drives success.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
