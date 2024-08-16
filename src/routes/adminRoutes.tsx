import { Route, Routes } from "react-router-dom"
import AdminLogin from "../pages/adminPages/adminLoginPage"
import AdminDashboardPage from "../pages/adminPages/adminDashboardPage"
import AdminProtectiveCheck from "../protectiveCheck/adminProtectiveCheck"
import AdminProtectiveCheckLogout from "../protectiveCheck/adminProtectiveCheckeLogout"


const AdminRoutes = ()=>{
    return(
        <Routes>
            <Route path="/" element={< AdminProtectiveCheckLogout element={<AdminLogin/>} />}/>
            <Route path="/dashboard" element={<AdminProtectiveCheck element={<AdminDashboardPage />} />} />
        </Routes>
    )
}

export default AdminRoutes