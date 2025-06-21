const mixins = {
  methods: {
    /**
     * @param {*} value
     */
    formatPrice(value) {
      let val = (value / 1).toFixed(0).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    /**
     * @param {*} partialValue
     * @param {*} totalValue
     */
    percentage(partialValue, totalValue) {
      return (100 * partialValue) / totalValue;
    },

    /**
     * @param {*} maxDate // Campaign max date from backend
     */
    maxDate(maxDate) {
      // Check if maxDate is a valid date string
      const dtMax = new Date(maxDate);
      if (isNaN(dtMax.getTime())) {
        // Check for "Invalid Date"
        console.error("maxDate: Invalid date value received:", maxDate);
        return true; // Assume campaign is closed if date is invalid
      }
      dtMax.setHours(0, 0, 0, 0); // Reset time to start of day

      let now = new Date();
      now.setHours(0, 0, 0, 0);

      // For debugging:
      // console.log('--- maxDate function debug ---');
      // console.log('  Current Date (now):', now.toISOString().split('T')[0]);
      // console.log('  Max Date (dtMax):', dtMax.toISOString().split('T')[0]);
      // console.log('  Comparison (now >= dtMax):', now.getTime() >= dtMax.getTime());
      // console.log('------------------------------');

      return now.getTime() >= dtMax.getTime();
    },

    /**
     * @param {*} maxDate
     */
    countDay(maxDate) {
      const dt2 = new Date(maxDate);
      if (isNaN(dt2.getTime())) {
        // Check for "Invalid Date"
        console.error("countDay: Invalid date value received:", maxDate);
        return 0; // Return 0 days if date is invalid
      }
      dt2.setHours(0, 0, 0, 0); // Reset time maxDate to start of day

      let date = new Date();
      let now = new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Reset current date time

      let result = Math.floor(
        (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
          Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) /
          (1000 * 60 * 60 * 24)
      );

      if (result < 0) {
        return 0;
      }
      return result;
    },
  },
};

export default mixins;
