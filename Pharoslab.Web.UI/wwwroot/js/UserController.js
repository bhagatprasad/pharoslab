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
                selectable: "multiple, row",
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

                var allSelected = selectedRows.length && selectedRows.length === grid.items().length;
                $('#parentUserChkbox').prop('checked', allSelected);

                disableAllButtons();
                enableButtons();

                if (self.selectedRows.length === 1) {
                    self.currectSelectedUser = self.selectedRows[0];
                } else {
                    self.currectSelectedUser = {};
                }
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
            var selectedRows = $("#UserGrid").data("kendoGrid").select();
            var hasMultipleSelection = selectedRows.length > 1;

            if (hasMultipleSelection) {
                $("#editBtn").addClass("disabled");
                $("#deleteBtn").addClass("disabled");
                $("#copyBtn").addClass("disabled");
                $("#addBtn").removeClass("disabled");
            } else if (selectedRows.length === 1) {
                $("#editBtn").removeClass("disabled");
                $("#deleteBtn").removeClass("disabled");
                $("#copyBtn").removeClass("disabled");
                $("#addBtn").addClass("disabled");
            } else {
                disableAllButtons();
            }
        }

        $(document).on("change", "#parentUserChkbox", function () {
            var isChecked = $(this).is(":checked");
            $(".childUserChkbox").prop("checked", isChecked);

            var grid = $("#UserGrid").data("kendoGrid");


            grid.items().removeClass("k-selected");

            if (isChecked) {

                grid.items().each(function () {
                    grid.select(this);
                });
            } else {
                grid.clearSelection();
            }
            updateSelectedRows();
        });

        $(document).on("change", ".childUserChkbox", function () {
            var grid = $("#UserGrid").data("kendoGrid");
            var row = $(this).closest("tr");

            if ($(this).is(":checked")) {
                grid.select(row);
            } else {
                $(row).removeClass("k-selected");

                $(row).find(".k-checkbox").removeClass("k-checkbox-selected");

                var dataItem = grid.dataItem(row);
                grid.clearSelection(dataItem);

                self.selectedRows = self.selectedRows.filter(function (item) {
                    return item.uid !== dataItem.uid;
                });
            }

            var allChecked = $(".childUserChkbox").length === $(".childUserChkbox:checked").length;
            $("#parentUserChkbox").prop("checked", allChecked)

            updateSelectedRows();
        });

        function updateSelectedRows() {
            var grid = $("#UserGrid").data("kendoGrid");
            var selectedRows = grid.select().toArray();

            var selectedUids = selectedRows.map(function (row) {
                return $(row).data("uid");
            });

            self.selectedRows = grid._data.filter(function (dataItem) {
                return selectedUids.includes(dataItem.uid);
            });

            var allSelected = self.selectedRows.length > 0 && self.selectedRows.length === grid.items().length;
            $("#parentUserChkbox").prop("checked", allSelected);

            disableAllButtons();
            enableButtons();

            self.currectSelectedUser = self.selectedRows.length === 1 ? self.selectedRows[0] : {};
        }

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
            $("#editpasswordhandle").removeClass("showHide");
            $("#Password").attr("required", "required");
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
            var formData = {
                FirstName: $("#FirstName").val(),
                LastName: $("#LastName").val(),
                Email: $("#Email").val(),
                Phone: $("#Phone").val()
            };
            if (Object.keys(self.currectSelectedUser).length === 0 || !self.currectSelectedUser.id) {
                formData.Password = $("#Password").val();
            }
            var userRegistration = addCommonProperties(formData);
            userRegistration.LastPasswordChangedOn = new Date();
            userRegistration.IsBlocked = false;
            userRegistration.Id = self.currectSelectedUser && self.currectSelectedUser.id ? self.currectSelectedUser.id : null;
            console.log(userRegistration);
            self.addeditUser(userRegistration);
        });
        $(document).on("click", "#editBtn", function () {
            if (self.currectSelectedUser) {
                $("#FirstName").val(self.currectSelectedUser.firstName);
                $("#LastName").val(self.currectSelectedUser.lastName);
                $("#Email").val(self.currectSelectedUser.email);
                $("#Phone").val(self.currectSelectedUser.phone);
                $("#Password").removeAttr("required");
                $("#editpasswordhandle").addClass("showHide");
                $('#sidebar').addClass('show');
                $('body').append('<div class="modal-backdrop fade show"></div>');
            } else {
                $('#sidebar').removeClass('show');
                $('.modal-backdrop').remove();
            }

        });
        self.addeditUser = function (userRegistration) {
            makeAjaxRequest({
                url: '/User/InsertOrUpdateUserAsync',
                data: userRegistration,
                type: 'POST',
                successCallback: function (response) {
                    if (response) {
                        $('#AddEditUserForm')[0].reset();
                        $('#sidebar').removeClass('show');
                        $('.modal-backdrop').remove();
                        var grid = $("#UserGrid").data("kendoGrid");
                        grid.dataSource.read();
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
    $(document).on("click", ".toggle-password", function () {
        var inputField = $(this).closest('.input-group').find('.form-control');
        var icon = $(this).find('i');

        if (inputField.attr('type') === 'password') {
            inputField.attr('type', 'text');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        } else {
            inputField.attr('type', 'password');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        }
    });
    function showLoader() {
        $('#overlay').attr('style', 'display:grid');
        $('#overlay').show();
    }

    function hideLoader() {
        $('#overlay').attr('style', 'display:none');
        $('#overlay').hide();
    }
    function getFormData(formSelector) {
        var formData = {};
        $(formSelector).find('input, select, textarea').each(function () {
            var id = $(this).attr('id');
            if (id) {
                formData[id] = $(this).val();
            }
        });
        return formData;
    }

    function addCommonProperties(data) {
        var appuser = storageService.get("ApplicationUser");
        var userId = appuser ? appuser.Id : null;
        data.CreatedOn = new Date();
        data.CreatedBy = userId;
        data.ModifiedOn = new Date();
        data.ModifiedBy = userId;
        data.IsActive = true;
        return data;
    }
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
        errorCallback = function (xhr, status, error) { console.error(`Error: ${error} `); }
    }) {
        const BASE_API_URL = 'http://localhost:5265/api';
        const baseUrl = `${BASE_API_URL}${url} `;
        const token = storageService.get('AccessToken');

        if (token) {
            headers['Authorization'] = `Bearer ${token} `;
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