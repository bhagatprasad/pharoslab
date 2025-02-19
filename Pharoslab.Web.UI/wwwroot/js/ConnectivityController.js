$(document).ready(function () {
    function createModal() {
        var modalHtml = `
            <div class="modal" id="offlineModal" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Connectivity Issue</h5>
                            <button type="button" class="close" id="manualClose" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p>You are offline. Please check your internet connection.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="closeButton">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('body').append(modalHtml);

        $('#manualClose').on('click', function () {
            if (!navigator.onLine) {
                return false; 
            }
        });

        $('#closeButton').on('click', function () {
            $('#offlineModal').modal('hide');
        });
    }

    function checkConnectivity() {
        if (!navigator.onLine) {
            $('#offlineModal').modal('show');
            $('#closeButton').hide(); 
        } else {
            $('#offlineModal').modal('hide');
            $('#closeButton').show();
        }
    }

   
    createModal();

    $(window).on('offline', function () {
        $('#offlineModal').modal('show');
        $('#closeButton').hide(); 
    });

    
    $(window).on('online', function () {
        $('#offlineModal').modal('hide');
        $('#closeButton').show(); 
    });

   
    checkConnectivity();
});
