// Generic Storage Service
var storageService = {
    // Store data in localStorage
    set: function (key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error storing data in localStorage:', e);
            return false;
        }
    },

    // Retrieve data from localStorage
    get: function (key) {
        try {
            var storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : null;
        } catch (e) {
            console.error('Error retrieving data from localStorage:', e);
            return null;
        }
    },

    // Remove data from localStorage
    remove: function (key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing data from localStorage:', e);
            return false;
        }
    }
};