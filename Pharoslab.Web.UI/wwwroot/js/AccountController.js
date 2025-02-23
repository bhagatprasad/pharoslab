function AccountController() {
    var self = this;
    self.userResponceData = {};
    self.init = function () {
        var form = $('#formAuthentication');
        var signUpButton = $('#btnSubmit');
        form.on('input', 'input, select, textarea', checkFormValidity);
        checkFormValidity();
        function checkFormValidity() {
            if (form[0].checkValidity()) {
                signUpButton.prop('disabled', false);
            } else {
                signUpButton.prop('disabled', true);
            }
        }
        $(document).on("click", "#btnSubmit", function (e) {
            e.preventDefault();
            $(".se-pre-con").show();

            var userAuthetnication = {
                username: $("#username").val(),
                password: $("#password").val()
            };

            makeAjaxRequest({
                url: API_URLS.AuthenticateAsync,
                data: userAuthetnication,
                type: 'POST',
                successCallback: handleAuthenticationSuccess,
                errorCallback: handleAuthenticationError
            });
        });

        function handleAuthenticationSuccess(response) {
            var appUserInfo = storageService.get('AccessToken');
            if (appUserInfo) {
                storageService.remove('AccessToken');
            }
            console.info(response);
            if (response.jwtToken) {

                storageService.set('AccessToken', response.jwtToken);

                makeAjaxRequest({
                    url: API_URLS.GenarateUserClaimsAsync,
                    data: response,
                    type: 'POST',
                    successCallback: handleUserClaimSuccess,
                    errorCallback: handleAuthenticationError
                });
            } else {
                console.error(response.statusMessage);
                toastr.error(response.statusMessage, 'Error');
                $(".se-pre-con").hide();
            }
           
        }
        function handleUserClaimSuccess(response) {
            console.info(response);
            if (response) {
                var appUserInfo = storageService.get('ApplicationUser');
                if (appUserInfo) {
                    storageService.remove('ApplicationUser');
                }
                storageService.set('ApplicationUser', response);

                var appUserInfo = storageService.get('ApplicationUser');

                if (appUserInfo) {
                    window.location.href = "/Index.html";
                }
                updateEnvironmentAndVersion();

                $(".se-pre-con").hide();
            }
            $(".se-pre-con").hide();
            toastr.success('Login success now we are redirecting to dashboard!', 'Success');
        }
        function handleAuthenticationError(xhr, status, error) {
            console.error("Error in upserting data to server: " + error);
            $(".se-pre-con").hide();
            toastr.error(error, 'Error');
        }
        function updateEnvironmentAndVersion() {
            var environment = storageService.get('Environment');
            if (environment) {
                storageService.remove('Environment');
            }
            storageService.set('Environment', window.location.hostname);

            var version = storageService.get('Version');
            if (version) {
                storageService.remove('Version');
            }
            storageService.set('Version', '1.0.0.0');
        }
    };
}