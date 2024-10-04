import React from "react";
import "./CSS/Admin.css";
import Sidebar from "../Components/Sidebar/Sidebar";
import AddProduct from "../Components/AddProduct/AddProduct";
import { Route, Routes } from "react-router-dom";
import ListProduct from "../Components/ListProduct/ListProduct";
import AddPromociones from "../Components/AddPromociones/AddPromociones";
import ListPromociones from "../Components/ListPromociones/ListPromociones";
import ListOrdenes from "../Components/ListOrdenes/ListOrdenes";
import AddAdmin from "../Components/AddAdmin/AddAdmin";
import ListAdmin from "../Components/ListAdmin/ListAdmin";
import ListCupones from "../Components/ListCupones/ListCupones";
import AddCupones from "../Components/AddCupones/AddCupones";

const Admin = () => {

  return (
    <div className="admin">
      <Sidebar />
      <Routes>
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/listproduct" element={<ListProduct />} />
        <Route path="/addpromociones" element={<AddPromociones />} />
        <Route path="/listpromociones" element={<ListPromociones />} />
        <Route path="/listordenes" element={<ListOrdenes />} />
        <Route path="/addadmin" element={<AddAdmin />} />
        <Route path="/listadmin" element={<ListAdmin />} />
        <Route path="/addCupones" element={<AddCupones />} />
        <Route path="/listCUpones" element={<ListCupones />} />
      </Routes>
    </div>
  );
};

export default Admin;
