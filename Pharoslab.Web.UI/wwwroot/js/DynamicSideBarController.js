function DynamicSideBarController() {
    var self = this;
    self.init = function () {
        var appUserInfo = storageService.get('ApplicationUser');
        var navHTML = `
            <li class="nav-item">
                            <a href="index.html" class="nav-link">
                                <span class="pcoded-micon"><i class="feather icon-user-md"></i></span>
                                <span class="pcoded-mtext">My Info</span>
                            </a>
                        </li>
        `;
        $('#dynamic-nav').html(navHTML);
    };
}
