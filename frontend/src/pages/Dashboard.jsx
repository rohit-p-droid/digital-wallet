import React from "react";
import WalletDashboard from "../components/WalletDashboard";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
    return (
        <>
        <Navbar/>
        <div className="p-6">
            <WalletDashboard />
        </div></>
    );
};

export default Dashboard;
