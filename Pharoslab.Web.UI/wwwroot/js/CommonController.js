
window.onbeforeunload = function () {
    sessionStorage.clear();

    // Get all cookies
    var cookies = document.cookie.split(";");

    // Loop through the cookies and delete each one
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;Secure;SameSite=Strict;";
    }
};
window.addEventListener('unload', function () {
    window.location.href = '/Account/Login';
});
function switchCommonFormatter(cell, table, formatterParams) {
    var value = cell.getValue();
    var checked = value ? "checked" : "";
    return `
                <label class="switch">
                    <input type="checkbox" ${checked} onclick="toggleActive(${cell.getRow().getIndex(), table})">
                    <span class="slider"></span>
                </label>`;
}

function toggleActive(rowIndex, table) {
    var row = table.getRow(rowIndex);
    var data = row.getData();
    data.IsActive = !data.IsActive;
    row.update(data);
}

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
    const token = localStorage.getItem('AccessToken');

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
const Id = "00000000-0000-0000-0000-000000000000";

const API_URLS = {
    AuthenticateAsync: "/Account/AuthenticateUserAsync",
    GenarateUserClaimsAsync:'/Account/GenarateUserClaimsAsync'
};
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
function exportToExcel(data, columns, sheetName, filename, sortColumn, sortOrder) {
    // Filter columns to include in the Excel file
    var filteredData = [];
    if (data.length > 0) {
        filteredData = data.map(function (item) {
            var filteredItem = {};
            columns.forEach(function (col) {
                filteredItem[col] = item[col];
            });
            return filteredItem;
        });
        if (filteredData.length > 0 && sortColumn) {
            filteredData.sort(function (a, b) {
                if (a[sortColumn] < b[sortColumn]) return sortOrder === 'asc' ? -1 : 1;
                if (a[sortColumn] > b[sortColumn]) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }
    }
    else {
        var headerRow = {};
        columns.forEach(function (col) {
            headerRow[col] = null;
        });
        filteredData.push(headerRow);
    }

    // Apply sorting if sortColumn is provided


    // Create a new workbook and add the data as a worksheet
    var workbook = XLSX.utils.book_new();
    var worksheet = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate the Excel file
    var excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    var dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a link element and trigger the download
    var link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = filename + '.xlsx';
    document.body.appendChild(link);
    link.click();
}
const gridColumns = {
    TenantGrid: ['TenantName', 'TenantCode', 'Logo', 'TenantWebsite', 'Location', 'Address', 'ContactName', 'ContactPhone', 'Products', 'Makes', 'DealerCount'],
    RoleGrid: ['Name', 'Code'],
    CustomerGrid: ['Id', 'VIN', 'Price', 'Miles', 'StockNo', 'Year', 'Make', 'Model', 'Trim', 'BodyType', 'VehicleType', 'Drivetrain', 'Transmission', 'FuelType', 'EngineSize', 'EngineBlock', 'SellerName', 'Street', 'City', 'State', 'Zip'],
    VehicleGrid: ["id", "vin", "price", "miles", "stock_no", "year", "make", "model", "trim", "body_type", "vehicle_type", "drivetrain", "transmission", "fuel_type", "engine_size", "engine_block", "seller_name", "street", "city", "state", "zip"]
};
const exportType = {
    "Exporttemplate": "Export Template",
    "Exportwithgriddata": "Export with Grid Data",
    "Exportwithoriginaldata": "Export with Original Data"
};

function processFiles(files, gridColumns, callback) {
    var importedData = [];
    var fileList = $('#fileInfo ul');
    fileList.empty();

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        fileList.append('<li>' + file.name + ' (' + file.size + ' bytes)</li>');
    }

    var reader = new FileReader();

    reader.onload = function (e) {
        var contents = e.target.result;

        var workbook = XLSX.read(contents, { type: 'binary' });
        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
        var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Define expected column headers
        var expectedHeaders = gridColumns;

        // Get actual column headers from the Excel file
        var actualHeaders = Object.values(jsonData[0]);

        // Validate column headers
        var isValid = compareColumnHeaders(expectedHeaders, actualHeaders);

        if (isValid) {
            console.log('Excel column headers are valid.');
        } else {
            console.log('Excel column headers are invalid.');
        }

        if (isValid) {
            var headerIndexMap = {};

            // Map actual headers to their indexes
            for (var j = 0; j < actualHeaders.length; j++) {
                headerIndexMap[actualHeaders[j]] = j;
            }

            for (var i = 1; i < jsonData.length; i++) {
                if (jsonData[i][0] != '' && jsonData[i][0] != 'undefined' && jsonData[i][0] != null) {
                    var rowData = mapRowToObject(jsonData[i], headerIndexMap);
                    var comon = addCommonProperties(rowData);
                    importedData.push(comon);
                }
            }
        }

        // Call the callback with the imported data
        callback(importedData);
    };

    reader.readAsBinaryString(file);
}

function mapRowToObject(row, headerIndexMap) {
    var obj = {};

    for (var key in headerIndexMap) {
        if (headerIndexMap.hasOwnProperty(key)) {
            obj[key] = row[headerIndexMap[key]];
        }
    }

    return obj;
}
function compareColumnHeaders(expectedHeaders, actualHeaders) {
    // Check if the number of columns match
    if (expectedHeaders.length !== actualHeaders.length) {
        return false;
    }

    // Check if the column headers match in order
    for (var i = 0; i < expectedHeaders.length; i++) {
        if (expectedHeaders[i].toLowerCase() !== actualHeaders[i].toLowerCase()) {
            return false;
        }
    }

    return true;
}
// Function to disable all buttons
function disableAllButtons() {

    $(".custom-cursor").addClass("disabled");
    $("#addBtn").removeClass("disabled");
    $("#exportBtn").removeClass("disabled");
    $("#importBtn").removeClass("disabled");
    /* $("#permissionBtn").removeClass("disabled");*/
}

// Function to enable buttons
function enableButtons(table) {
    $(".custom-cursor").removeClass("disabled");

    // Highlight buttons based on selection
    var selectedRows = table.getSelectedRows();
    var hasMultipleSelection = selectedRows.length > 1;

    if (hasMultipleSelection) {
        /* $("#addBtn").removeClass("selected");*/
        $("#editBtn").addClass("disabled");
        $("#deleteBtn").addClass("disabled");
        $("#copyBtn").addClass("disabled");
        $("#addBtn").removeClass("disabled");
        $("#permissionBtn").removeClass("disabled");
        $("#campaignBtn").removeClass("disabled");
    } else {
        selectedRows.forEach(function (row) {
            // Highlight based on specific conditions (e.g., edit and delete)
            var isSelected = row.isSelected();
            if (isSelected) {
                /*  $("#addBtn").addClass("selected");*/
                $("#editBtn").addClass("selected");
                $("#deleteBtn").addClass("selected");
                $("#copyBtn").addClass("selected");
                $("#addBtn").addClass("disabled");
                $("#permissionBtn").addClass("selected");
                $("#campaignBtn").addClass("selected");
            }
        });
    }
}

function getQueryStringParameter(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
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
const Activities = {
    EXPORT: 'Export',
    COPY: 'Copy',
    IMPORT: 'Import',
    DELETE: 'Delete',
    ADD: 'Add',
    SAVE: 'Save',
    UPDATE: 'Update',
    VIEW: 'View',
    EDIT: 'Edit'
};

const Features = {
    CAMPAIGN_CHANNEL: 'CampaignChannel',
    WORKFLOW_ACTIVITY: 'WorkFlowActivity',
    MAKE_MODEL: 'MakeModel',
    YEAR: 'Year',
    CAMPAIGN_TYPE: 'CampaignType',
    CATEGORY: 'Category',
    MAKE: 'Make',
    CAMPAIGN_PERIOD: 'CampaignPeriod',
    WORKFLOW_TEMPLATE: 'WorkFlowTemplate',
    URL_TYPE: 'URLType',
    USER: 'User',
    SERVICE_TYPE: 'ServiceType',
    AMINITY: 'Aminity',
    ROLE: 'Role',
    INCENTIVE: 'Incentive',
    ACTIVITY: 'Activity',
    WORKFLOW: 'WorkFlow',
    TENANT: 'Tenant',
    STATUS: 'Status',
    PRODUCT: 'Product',
    DELEVERY_TYPE: 'DeleveryType',
    DealerAdvantage: 'DealerAdvantage',
    Campaign: 'Campaign',
    SettingType: 'SettingType',
    Dealer: 'Dealer'
};

function hasPermission(featureName, activityName) {
    var userPermissions = storageService.get('UserPermissions');
    if (!userPermissions) {
        console.error('Permissions data not found in local storage.');
        return false;
    }
    for (var i = 0; i < userPermissions.length; i++) {
        var feature = userPermissions[i];
        if (feature.FeatureName === featureName) {
            for (var j = 0; j < feature.Activities.length; j++) {
                var activity = feature.Activities[j];
                if (activity.ActivityName === activityName) {
                    return activity.IsEnabled;
                }
                /*   return false;*/
            }
        }
    }
    return false;
}

function genarateDropdown(dropdownId, data, valueField, textField) {
    var $dropdown = $('#' + dropdownId);
    $dropdown.empty();

    var $defaultOption = $('<option>', {
        value: '',
        text: 'Select an option'
    });
    $dropdown.append($defaultOption);

    $.each(data, function (index, item) {
        var $option = $('<option>', {
            value: item[valueField],
            text: item[textField]
        });
        $dropdown.append($option);
    });

    $dropdown.trigger('change');

    /*$dropdown.dropdown();*/
};

function formatDate(date) {
    const dateParts = date.split('-');
    return `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
}

function generateDealerCode() {
    const now = new Date();
    var appuser = storageService.get("ApplicationUser");
    var tenantCode = appuser.TenantId.split('-')[0];
    // Get individual components of the date and time
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    // Concatenate components to form the desired code
    const dateTimeCode = `${tenantCode}${month}${day}${year}${hours}${minutes}${seconds}${milliseconds}`;

    return dateTimeCode;
}
function showLoader() {
    $('#overlay').attr('style', 'display:grid');
    $('#overlay').show();
}

function hideLoader() {
    $('#overlay').attr('style', 'display:none');
    $('#overlay').hide();
}
$(document).on('click', '.wizard li', function () {
    var $this = $(this);
    var $siblings = $this.parent().children('li');

    // Remove all classes from siblings
    $siblings.removeClass('completed active');

    // Mark the clicked item as active
    $this.addClass('active');

    // Mark all previous items as completed
    $this.prevAll().addClass('completed');

    // Ensure all future items are not completed
    $this.nextAll().removeClass('completed');
});

const next = e => {
    const current = e.target.closest('div');
    current.classList.remove('active');
    current.classList.add('complete');

    const next = current.nextElementSibling;
    if (next) {
        next.classList.remove('hidden');
        next.classList.add('active');
    }
};

document
    .querySelector('button')
    .addEventListener('click', next);

function generateUniquePhoneNumber() {
    var phoneNumber = '';

    // Ensure the first digit is not zero
    phoneNumber += Math.floor(Math.random() * 9) + 1;

    // Generate the remaining 9 digits
    for (var i = 0; i < 9; i++) {
        phoneNumber += Math.floor(Math.random() * 10);
    }

    return phoneNumber;
}
function generateUniqueEmail(baseName, domain) {
    // Generate a random string of 5 alphanumeric characters
    var randomString = Math.random().toString(36).substring(2, 7);

    // Combine the base name with the random string and domain to create the email
    var email = baseName + randomString + "@" + domain.replace(/ /g, '') + ".com";

    return email;
}
