import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './styles/main.scss'
import Error404 from './pages/Error/Error404.js';
import LandingPage from './pages/LandingPage/LandingPage.js';
import Login from './pages/Login/Login.js';
import Register from './pages/Register/Register.js';
import Homes from './pages/Homes/Homes';
import AddHome from './pages/Homes/AddHome.js';
import ResidentsView from './pages/ResidentsView/ResidentsView.js';
import ViewHome from './pages/Homes/ViewHome.js';
import EditHome from './pages/Homes/EditHome.js';

import Vehicles from './pages/Vehicles/Vehicles.js';
import UpdateVehicle from './pages/Vehicles/UpdateVehicle.js'
import AddVehicle from './pages/Vehicles/AddVehicle.js';
import VehicleView from './pages/Vehicles/VehicleView.js';

import Visitors from './pages/Visitors/Visitors.js';
import AddVisitor from './pages/Visitors/AddVisitor.js';
import VisitorView from './pages/Visitors/VisitorView.js';

import Dashboard from './pages/HomeOwnerAssociation/Dashboard.js';
import AssociationDues from './pages/HomeOwnerAssociation/AssociationDues.js';
import Logs from './pages/HomeOwnerAssociation/Logs.js';
import VisitorsList from './pages/HomeOwnerAssociation/VisitorsList.js';
import ResidentsList from './pages/HomeOwnerAssociation/ResidentsList.js';
import VehicleList from './pages/HomeOwnerAssociation/VehicleList.js';
import HomeList from './pages/HomeOwnerAssociation/HomeList.js';
import DuesView from './pages/HomeOwnerAssociation/DuesView.js';

import Scanner from './pages/HomeOwnerAssociation/Scanner.js';

import ProtectedRoute from './utils/ProtectedRoute.js';

import RegisterHoa from './pages/HomeOwnerAssociation/RegisterHoa.js';
import AddGuard from './pages/HomeOwnerAssociation/AddGuard.js';

import Guard from './pages/HomeOwnerAssociation/Guard.js';

import Profile from './pages/Profile/Profile.js'
import EditProfile from './pages/Profile/EditProfile.js'

function App() {
	return (
		<Routes>
			{/* Public Routes */}
			<Route path="/" element={<LandingPage />} />
			<Route path="/login"element={<Login />} />
			<Route path="/register" element={<Register />} />

			{/* Private Routes for Users */}
			<Route element={<ProtectedRoute/>}>
				<Route path="/hoa" element={<RegisterHoa />} />

				{/* <Route path="/resident/:id" element={<ResidentsView />} /> */}

				{/* New Route for editing user datails */}
                <Route path="/profile" element={<Profile />}/>
				<Route path="/profile/edit" element={<EditProfile />}/>

				<Route path="/vehicles">
					<Route path="" element={<Vehicles />} />
					<Route path="add" element={<AddVehicle />} />
					<Route path="update" element={<UpdateVehicle />} />
					<Route path=":id" element={<VehicleView />} />
				</Route>

				<Route path="/visitors">
					<Route path="" element={<Visitors />} />
					<Route path="add" element={<AddVisitor />} />
					<Route path=":id" element={<VisitorView />} />
				</Route>

				{/* Private Routes for Homeowner and Residents */}
				<Route path="/homes">
					<Route path="" element={<Homes />} />
					<Route path="add" element={<AddHome />} />
					<Route path=":id" element={<ViewHome />} />
					<Route path=":id/:resId" element={<ResidentsView />} />
                    <Route element={<ProtectedRoute allowedRoles={['homeowner']}/>} >
                        <Route path=":id/edit" element={<EditHome />} />
                    </Route>
				</Route>

				{/* Private Routes for Guard */}
				<Route element={<ProtectedRoute allowedRoles={['guard']} />}  >
					<Route path="/scanner" element={<Scanner />} />
				</Route>

				{/* Private Routes for Admin */}
				<Route element={<ProtectedRoute />} allowedRoles={['admin']} >
					<Route path="/associationdues" element={<AssociationDues />} />
					<Route path="/guard" element={<Guard />} />
					<Route path="/addguard" element={<AddGuard />} />
					<Route path="/duesview" element={<DuesView />} />
				</Route>

				{/* Private Routes for Admin and Guard */}
				<Route element={<ProtectedRoute />} allowedRoles={['admin', 'guard']} >
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="visitorslist" element={<VisitorsList />} />
					<Route path="logs" element={<Logs />} />
					<Route path="residentslist" element={<ResidentsList />} />
					<Route path="vehiclelist" element={<VehicleList />} />
					<Route path="homelist" element={<HomeList />} />
				</Route>
			</Route>

			{/* Error Routes */}
			<Route path="*" element={<Error404 />} />
		</Routes>
	);
}

export default App;
