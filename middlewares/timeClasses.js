class TimeStamp {
    constructor(type) {
        this._type = type;
    }

    set years(years) {
        this._years = years;
    }

    set months(months) {
        this._months = months;
    }

    set days(days) {
        this._days = days;
    }

    set hours(hours) {
        this._hours = hours;
    }

    set minutes(minutes) {
        this._minutes = minutes;
    }

    set seconds(seconds) {
        this._seconds = seconds;
    }
}

module.exports.TimeStamp = TimeStamp;