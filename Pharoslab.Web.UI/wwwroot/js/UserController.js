function UserController() {
    var self = this;
    self.ApplicationUser = {};
    self.selectedRows = [];

    self.currectSelectedUser = {};
    self.init = function () {
        //  kendo.ui.licensing.setLicenseKey("NONE");
        console.log(typeof $.fn.kendoGrid);
        var appuser = storageService.get("ApplicationUser");
        if (appuser) {
            self.ApplicationUser = appuser;
        }
        $("#UserGrid").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: "http://localhost:5265/api/User/FetchUsersAsync",
                        dataType: "json"
                    }
                },
                pageSize: 50,
                schema: {
                    model: {
                        fields: {
                            id: { type: "guid" },
                            firstName: { type: "string" },
                            lastName: { type: "string" },
                            email: { type: "string" },
                            phone: { type: "string" },
                            lastPasswordChangedOn: { type: "date" },
                            isBlocked: { type: "boolean" },
                            isActive: { type: "boolean" }
                        }
                    }
                }
            },
            pageable: true,
            sortable: true,
            columns: [
                {
                    title: "<input type='checkbox' id='parentUserChkbox' style='margin-top: 22px;'>",
                    template: "<input type='checkbox' class='childUserChkbox' data-uid='#= uid #' />",
                    width: 30,
                    headerAttributes: { style: "text-align: center;" },
                    attributes: { style: "text-align: center;" }
                },
                { field: "id", title: "ID", hidden: true },
                { field: "firstName", title: "First Name" },
                { field: "lastName", title: "Last Name" },
                { field: "email", title: "Email" },
                { field: "phone", title: "Phone" },
                { field: "lastPasswordChangedOn", title: "Last Password Changed", format: "{0:MM/dd/yyyy HH:mm}" },
                { field: "isBlocked", title: "Is Blocked", template: "#= isBlocked ? 'Yes' : 'No' #" },
                { field: "isActive", title: "Is Active", template: "#= isActive ? 'Yes' : 'No' #" }
            ],
            dataBound: function () {
                var grid = this;
                var selectedRows = grid.select();
                self.selectedRows = selectedRows.map(function (row) {
                    return grid.dataItem(row);
                });

                // Check if all rows are selected
                var allSelected = selectedRows.length && selectedRows.length === grid.items().length;
                $('#parentUserChkbox').prop('checked', allSelected);

                // Disable all buttons initially
                disableAllButtons();

                // Enable buttons based on selection
                enableButtons();

                // Update the current selected lab test
                if (self.selectedRows.length === 1) {
                    self.currectSelectedUser = self.selectedRows[0];
                } else {
                    self.currectSelectedUser = {};
                }

                console.log("Selected Rows:", self.selectedRows);
                console.log("Current Selected Lab Test:", self.currectSelectedUser);

            }
        });
        function disableAllButtons() {
            $(".custom-cursor").addClass("disabled");
            $("#addBtn").removeClass("disabled");
            $("#editBtn").addClass("disabled");
            $("#deleteBtn").addClass("disabled");
            $("#copyBtn").addClass("disabled");
        }

        function enableButtons() {
            $(".custom-cursor").removeClass("disabled");

            // Get the selected rows from the Kendo Grid
            var selectedRows = $("#UserGrid").data("kendoGrid").select();
            var hasMultipleSelection = selectedRows.length > 1;

            if (hasMultipleSelection) {
                // Disable edit, delete, and copy buttons when multiple rows are selected
                $("#editBtn").addClass("disabled");
                $("#deleteBtn").addClass("disabled");
                $("#copyBtn").addClass("disabled");
                $("#addBtn").removeClass("disabled"); // Allow adding new items
            } else if (selectedRows.length === 1) {
                // Enable edit, delete, and copy buttons when one row is selected
                $("#editBtn").removeClass("disabled");
                $("#deleteBtn").removeClass("disabled");
                $("#copyBtn").removeClass("disabled");
                $("#addBtn").addClass("disabled"); // Disable adding new items when editing
            } else {
                // No rows selected
                disableAllButtons();
            }
        }

        // Handle parent checkbox change
        $(document).on("change", "#parentUserChkbox", function () {
            var isChecked = $(this).is(":checked");
            $(".childUserChkbox").prop("checked", isChecked);
            if (isChecked) {
                $("#UserGrid").data("kendoGrid").select($("#UserGrid").data("kendoGrid").items());
            } else {
                $("#UserGrid").data("kendoGrid").clearSelection();
            }
        });

        // Handle child checkbox change
        $(document).on("change", ".childUserChkbox", function () {
            var row = $(this).closest("tr");
            if ($(this).is(":checked")) {
                $("#UserGrid").data("kendoGrid").select(row);
            } else {
                $("#UserGrid").data("kendoGrid").clearSelection(row);
            }

            // Check if all child checkboxes are checked
            var allRows = $("#UserGrid").data("kendoGrid").items();
            var allChecked = true;

            allRows.each(function () {
                var checkbox = $(this).find(".childUserChkbox");
                if (!checkbox.is(":checked")) {
                    allChecked = false;
                }
            });

            $("#parentUserChkbox").prop("checked", allChecked);
        });

        makeFormGeneric('#AddEditUserForm', '#btnsubmit');

        function makeFormGeneric(formSelector, submitButtonSelector) {
            var form = $(formSelector);
            var submitButton = $(submitButtonSelector);

            form.on('input change', 'input, select, textarea', checkFormValidity);
            checkFormValidity();

            function checkFormValidity() {
                if (form[0].checkValidity()) {
                    submitButton.prop('disabled', false);
                } else {
                    submitButton.prop('disabled', true);
                }
            }
        }
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
        $(document).on("click", "#editBtn", function () {
            if (self.currectSelectedUser) {
                $("#Name").val(self.currectSelectedUser.Name);
                $("#Code").val(self.currectSelectedUser.Code);
                $('#sidebar').addClass('show');
                $('body').append('<div class="modal-backdrop fade show"></div>');
            } else {
                $('#sidebar').removeClass('show');
                $('.modal-backdrop').remove();
            }

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
    function makeAjaxRequest({
        url,
        data = {},
        type = 'GET',
        contentType = 'application/json; charset=utf-8',
        dataType = 'json',
        processData = true,
        cache = false,
        headers = {},
        successCallback = function (response) { console.log(response); },
        errorCallback = function (xhr, status, error) { console.error(`Error: ${error}`); }
    }) {
        const BASE_API_URL = 'http://localhost:5265/api';
        const baseUrl = `${BASE_API_URL}${url}`;
        const token = storageService.get('AccessToken');

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        $.ajax({
            url: baseUrl,
            data: type === 'GET' ? data : JSON.stringify(data),
            type: type,
            contentType: contentType,
            dataType: dataType,
            processData: processData,
            cache: cache,
            headers: headers,
            success: successCallback,
            error: errorCallback
        });
    }
}