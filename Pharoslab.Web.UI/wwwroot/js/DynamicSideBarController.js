function DynamicSideBarController() {
    var self = this;
    self.init = function () {
        var appUserInfo = storageService.get('ApplicationUser');
        var navHTML = `
           
        `;

        if (appUserInfo) {
            switch (appUserInfo.RoleName) {
                case "Doctor":
                    navHTML += `
                        <li class="nav-item">
                            <a href="/DoctorDashboard/Index" class="nav-link">
                                <span class="pcoded-micon"><i class="feather icon-user-md"></i></span>
                                <span class="pcoded-mtext">Doctor Dashboard</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="/DoctorAppointments/Index" class="nav-link">
                                <span class="pcoded-micon"><i class="feather icon-calendar"></i></span>
                                <span class="pcoded-mtext">Appointments</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="/DoctorPrescriptions/Index" class="nav-link">
                                <span class="pcoded-micon"><i class="feather icon-file-text"></i></span>
                                <span class="pcoded-mtext">Prescriptions</span>
                            </a>
                        </li>
                    `;
                    break;

                case "Executive":
                    navHTML += `
                        <li class="nav-item">
                            <a href="/ExecutiveDashboard/Index" class="nav-link">
                                <span class="pcoded-micon"><i class="feather icon-briefcase"></i></span>
                                <span class="pcoded-mtext">Executive Dashboard</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="/ExecutiveReports/Index" class="nav-link">
                                <span class="pcoded-micon"><i class="feather icon-file-text"></i></span>
                                <span class="pcoded-mtext">Reports</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="/ExecutiveAnalytics/Index" class="nav-link">
                                <span class="pcoded-micon"><i class="feather icon-pie-chart"></i></span>
                                <span class="pcoded-mtext">Analytics</span>
                            </a>
                        </li>
                    `;
                    break;
                case "Receptionist":
                    navHTML += `
                       <li class="nav-item">
                            <a href="/ReceptionistDashboard/Index" class="nav-link">
                                <span class="pcoded-micon"><i class="feather icon-home"></i></span>
                                <span class="pcoded-mtext">Executive Dashboard</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="/DoctorAppointment/Index" class="nav-link">
                                <span class="pcoded-micon"><i class="feather icon-calendar"></i></span>
                                <span class="pcoded-mtext">Appointments</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="/ExecutiveReports/Index" class="nav-link">
                                <span class="pcoded-micon"><i class="feather icon-file"></i></span>
                                <span class="pcoded-mtext">Reports</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="/ExecutiveAnalytics/Index" class="nav-link">
                                <span class="pcoded-micon"><i class="feather icon-bar-chart"></i></span>
                                <span class="pcoded-mtext">Analytics</span>
                            </a>
                        </li>
                    `;
                    break;
                case "Pharmacist":
                    navHTML += `
                        <li class="nav-item">
                            <a href="/PharmacistDashBoard/Index" class="nav-link">
                                <span class="pcoded-micon"><i class="feather icon-capsule"></i></span>
                                <span class="pcoded-mtext">Pharmacist Dashboard</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="/PharmacistInventory/Index" class="nav-link">
                                <span class="pcoded-micon"><i class="feather icon-box"></i></span>
                                <span class="pcoded-mtext">Inventory</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="/PharmacistOrders/Index" class="nav-link">
                                <span class="pcoded-micon"><i class="feather icon-truck"></i></span>
                                <span class="pcoded-mtext">Orders</span>
                            </a>
                        </li>
                    `;
                    break;

                case "Lab technicians":
                    navHTML += `
                        <li class="nav-item">
                            <a href="/LabTechnicianDashBoard/Index" class="nav-link">
                                <span class="pcoded-micon"><i class="feather icon-flask"></i></span>
                                <span class="pcoded-mtext">Lab Technician Dashboard</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="/LabTechnicianTests/Index" class="nav-link">
                                <span class="pcoded-micon"><i class="feather icon-test-tube"></i></span>
                                <span class="pcoded-mtext">Tests</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="/LabTechnicianReports/Index" class="nav-link">
                                <span class="pcoded-micon"><i class="feather icon-file-text"></i></span>
                                <span class="pcoded-mtext">Reports</span>
                            </a>
                        </li>
                    `;
                    break;

                default:
                    navHTML += `
                         <li class="nav-item">
                                        <a href="/Home/Index" class="nav-link">
                                            <span class="pcoded-micon"><i class="feather icon-home"></i></span>
                                            <span class="pcoded-mtext">Dashboard</span>
                                        </a>
                                    </li>
                            <li class="nav-item">
                                <a href="/Department/Index" class="nav-link">
                                    <span class="pcoded-micon"><i class="fas fa-building"></i></span>
                                    <span class="pcoded-mtext">Department</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="/Role/Index" class="nav-link">
                                    <span class="pcoded-micon"><i class="fas fa-user-tag"></i></span>
                                    <span class="pcoded-mtext">Role</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="/HospitalType/Index" class="nav-link">
                                    <span class="pcoded-micon"><i class="fas fa-hospital"></i></span>
                                    <span class="pcoded-mtext">Hospital Type</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="/LabTest/Index" class="nav-link">
                                    <span class="pcoded-micon"><i class="fas fa-flask"></i></span>
                                    <span class="pcoded-mtext">Lab Test</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="/Medicine/Index" class="nav-link">
                                    <span class="pcoded-micon"><i class="fas fa-pills"></i></span>
                                    <span class="pcoded-mtext">Medicine</span>
                                </a>
                            </li>
                           <li class="nav-item">
                                <a href="/PaymentType/Index" class="nav-link">
                                    <span class="pcoded-micon"><i class="fas fa-credit-card"></i></span>
                                    <span class="pcoded-mtext">Payment Type</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="/PatientType/Index" class="nav-link">
                                    <span class="pcoded-micon"><i class="fas fa-user-injured"></i></span>
                                    <span class="pcoded-mtext">Patient Type</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="/Hospital/Index" class="nav-link">
                                    <span class="pcoded-micon"><i class="fas fa-hospital"></i></span>
                                    <span class="pcoded-mtext">Hospital</span>
                                </a>
                            </li>
                       <li class="nav-item">
                            <a href="/Specialization/Index" class="nav-link">
                                <span class="pcoded-micon"><i class="fas fa-user-md"></i></span>
                                <span class="pcoded-mtext">Specialization</span>
                            </a>
                        </li>
`;
            }
        }

        // Insert the constructed HTML into the #dynamic-nav container
        $('#dynamic-nav').html(navHTML);
    };
}
