function UserController() {
    var self = this;
    self.coreDBRoles = [];
    self.ApplicationUser = {};
    var actions = [];
    var dataObjects = [];
    actions.push('/Role/FetchRoles');
    self.init = function () {
        var appuser = storageService.get("ApplicationUser");
        if (appuser) {
            self.ApplicationUser = appuser;
        }
        self.usersgrid = new Tabulator("#usersgrid", {
            ajaxURL: '/User/FetchUsers',
            ajaxParams: {},
            ajaxConfig: {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            },
            ajaxResponse: function (url, params, response) {
                return response.data;
            },
            height: "600px",
            layout: "fitColumns",
            resizableColumnFit: true,
            columns: [
                { title: "Name", field: "FullName" },
                { title: "Email", field: "Email" },
                { title: "Phone", field: "Phone" },
                { title: "Role", field: "RoleName" },
                { title: "Hospital Name", field: "HospitalName" },
                { title: "Department Name", field: "DepartmentName" },
                { title: "Designation", field: "Designation" },
                {
                    title: "Is Blocked",
                    field: "IsBlocked",
                    formatter: "tickCross",
                    align: "center"
                },
                {
                    title: "Is Active",
                    field: "IsActive",
                    formatter: "tickCross",
                    align: "center"
                }
            ]
        });
        var requests = actions.map((action, index) => {
            var ajaxConfig = {
                url: action,
                method: 'GET'
            };
            return $.ajax(ajaxConfig);
        });

        $.when.apply($, requests).done(function (...responses) {
            self.coreDBRoles = responses[0]?.data || [];
            var loggedInUserRole = self.coreDBRoles.find(role => role.RoleId === self.ApplicationUser.RoleId);
            if (loggedInUserRole) {
                var userRoles = self.filterRoles(loggedInUserRole.Name, self.coreDBRoles);
                genarateDropdown("RoleId", userRoles, "RoleId", "Name");
            }
            hideLoader();
        }).fail(function () {
            console.log('One or more requests failed.');
        });

        self.filterRoles = function (loggedInRole, roles) {
            if (loggedInRole === 'Administrator') {
                return roles;
            }
            return [];
        };

        makeFormGeneric('#AddEditUserForm', '#btnsubmit');


        $(document).on("click", "#addBtn", function () {
            $('#sidebar').addClass('show');
            $('body').append('<div class="modal-backdrop fade show"></div>');
        });
        $('#closeSidebar, .modal-backdrop').on('click', function () {
            $('#AddEditUserForm')[0].reset();
            $('#sidebar').removeClass('show');
            $('.modal-backdrop').remove();
        });
        $('#AddEditUserForm').on('submit', function (e) {
            e.preventDefault();
            showLoader();
            var formData = getFormData('#AddEditUserForm');
            var userRegistration = addCommonProperties(formData);
            userRegistration.LastPasswordChangedOn = new Date();
            userRegistration.IsBlocked = false;
            userRegistration.Id = null;
            console.log(userRegistration);
            self.addeditUser(userRegistration);
        });
        self.addeditUser = function (userRegistration) {
            makeAjaxRequest({
                url: '/User/InsertOrUpdateUser',
                data: userRegistration,
                type: 'POST',
                successCallback: function (response) {
                    if (response) {
                        $('#AddEditUserForm')[0].reset();
                        $('#sidebar').removeClass('show');
                        $('.modal-backdrop').remove();
                        self.usersgrid.setData();
                    }
                    console.info(response);
                    hideLoader();
                },
                errorCallback: function (xhr, status, error) {
                    console.error("Error in saving user data: " + error);
                }
            });
        };

    };

}