import { Route, Routes } from "react-router-dom"
import AdminLogin from "../pages/adminPages/adminLoginPage"
import AdminDashboardPage from "../pages/adminPages/adminDashboardPage"
import AdminProtectiveCheck from "../protectiveCheck/adminProtectiveCheck"
import AdminProtectiveCheckLogout from "../protectiveCheck/adminProtectiveCheckeLogout"
import AdminMentorListPage from "../pages/adminPages/adminMentorListPage"
import AdminMentorSinglePage from "../pages/adminPages/adminMentorSinglePage"
import AdminUserListPage from "../pages/adminPages/adminUserListPage"


const AdminRoutes = ()=>{
    return(
        <Routes>
            <Route path="/" element={< AdminProtectiveCheckLogout element={<AdminLogin/>} />}/>
            <Route path="/dashboard" element={<AdminProtectiveCheck element={<AdminDashboardPage />} />} />
            <Route path="/mentor-list" element={<AdminProtectiveCheck element={<AdminMentorListPage />}/>} />
            <Route path='/mentor-details/:id' element={<AdminProtectiveCheck element={<AdminMentorSinglePage/>}/>}/>
            <Route path="/users" element={<AdminProtectiveCheck element={<AdminUserListPage />}/>} />

        </Routes>
    )
}

export default AdminRoutes