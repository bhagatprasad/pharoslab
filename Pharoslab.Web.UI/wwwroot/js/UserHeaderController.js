function UserHeaderController() {
    var self = this;
    self.ApplicationUser = {};
    self.dbUserNotifications = [];
    self.init = function () {
        var appuser = storageService.get("ApplicationUser");
        if (appuser) {
            self.ApplicationUser = appuser;
        }

        self.InBoxGrid = new Tabulator("#InBoxGrid", {
            height: "600px",
            layout: "fitColumns",
            resizableColumnFit: true,
            data: self.dbUserNotifications,
            columns: [
                {
                    title: "",
                    formatter: function () {
                        return "<i class='icon feather icon-mail'></i>";
                    },
                    width: 40,
                    hozAlign: "center",
                    headerSort: false
                },
                { title: "Subject", field: "Subject" },
                { title: "Message", field: "MessageContentOne" },
                { title: "Received On", field: "RecievedOn" },
            ],
            selectable: 1,
            rowClick: function (e, row) {
                if (row.getElement().classList.contains("expanded")) {
                    row.getElement().classList.remove("expanded");
                    row.getElement().querySelector(".expanded-row-content").remove();
                } else {
                    row.getElement().classList.add("expanded");

                    var holderEl = document.createElement("div");
                    holderEl.classList.add("expanded-row-content");

                    var content = `
            <div><strong>Title:</strong> ${row.getData().Title}</div>
            <div><strong>Note:</strong> ${row.getData().Note}</div>
            <div>${row.getData().MessageContentOne} <br/> ${row.getData().MessageContentTwo}<br/><br/></div>
            <div>
                <h4>Amplify RPM</h4>
                <img src="https://amplify-rpm-azurewebsites.betalen.in/assets/logo.png" alt="Amplify RPM Logo" style="vertical-align: middle; width: 150px; height: 80px;" />
                <br/>
            </div>
        `;

                    holderEl.innerHTML = content;
                    row.getElement().appendChild(holderEl);
                }
            }

        });

        $(document).on("click", "#show_all", function () {
            showLoader();
            fetchNotifications();
        });
    }

    function fetchNotifications() {
        makeAjaxRequest({
            url: API_URLS.FetchNotificationsAsync,
            data: { userId: self.ApplicationUser.Id },
            type: 'GET',
            successCallback: function (response) {
                if (response) {
                    console.info(response);
                    self.dbUserNotifications = response && response.data ? response.data : [];
                    displayInboxModal();
                    //  updateNotificationList(self.dbUserNotifications);
                }
                hideLoader();
            },
            errorCallback: function (xhr, status, error) {
                console.error("Error in fetching notifications: " + error);
            }
        });
    }
    function updateNotificationList(notifications) {
        var notiBody = $(".noti-body");
        notiBody.empty();
        if (notifications.length > 0) {
            notifications.forEach(function (notification) {
                var timeAgo = calculateTimeAgo(notification.ReceivedOn);
                var isNew = !notification.IsRead ? '<p class="m-b-0">NEW</p>' : '';

                var listItem = `
                    <li class="n-title">
                        ${isNew}
                    </li>
                    <li class="notification">
                        <div class="media">
                            <img class="img-radius" src="/assets/images/user/avatar-1.jpg" alt="Generic placeholder image">
                            <div class="media-body">
                                <p><strong>${notification.Title}</strong><span class="n-time text-muted"><i class="icon feather icon-clock m-r-10"></i>${timeAgo}</span></p>
                                <p>${notification.MessageContentOne}</p>
                            </div>
                        </div>
                    </li>
                `;

                notiBody.append(listItem);
            });
        }
    }

    function displayInboxModal() {

        self.InBoxGrid.replaceData(self.dbUserNotifications);

        $('#InboxModal').modal({ backdrop: 'static', keyboard: false });
        $("#InboxModal").modal("show");
    }


    function calculateTimeAgo(receivedOn) {

        return "10 min";
    }
}
