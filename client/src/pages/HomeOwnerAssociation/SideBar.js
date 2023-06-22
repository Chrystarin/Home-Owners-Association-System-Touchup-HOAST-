import React,{useState} from 'react'
import './Dashboard.scss';
import {useAuth} from '../../utils/AuthContext.js';

function SideBar(props) {
    const {isRole} = useAuth();

    return (
        <div className='SectionManage__SideNav'>
            <ul>
                {
                    (isRole('admin'))? <>
                        <li>
                            <a href="/dashboard" className={(props.active=="Dashboard")?"active":""}><h6>Dashboard</h6></a>
                        </li>
                        <li>
                            <a href="/associationdues" className={(props.active=="AssociationDues")?"active":""}><h6>Association Dues</h6></a>
                        </li>
                    </>
                    :
                    <>
                        <li>
                            <a href="/scanner" className={(props.active=="Scanner")?"active":""}><h6>Scanner</h6></a>
                        </li>
                    </>
                }


                <li>
                    <a href="/logs" className={(props.active=="Logs")?"active":""}><h6>Logs</h6></a>
                </li>
                <li>
                    <a href="guard" className={(props.active=="Guard")?"active":""}><h6>Guards</h6></a>
                </li>
                <li>
                    <a href="/visitorslist" className={(props.active=="VisitorsList")?"active":""}><h6>Visitors List</h6></a>
                </li>
                <li>
                    <a href="/residentslist" className={(props.active=="ResidentsList")?"active":""}><h6>Residents List</h6></a>
                </li>
                <li>
                    <a href="vehiclelist" className={(props.active=="VehiclesList")?"active":""}><h6>Vehicles List</h6></a>
                </li>
                <li>
                    <a href="homelist" className={(props.active=="HomesList")?"active":""}><h6>Homes List</h6></a>
                </li>
                
            </ul>
        </div>
    )
}

export default SideBar