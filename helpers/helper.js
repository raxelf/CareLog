const getGreetingStatus = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 11) {
        return "Selamat Pagi";
    } else if (hour >= 11 && hour < 15) {
        return "Selamat Siang";
    } else if (hour >= 15 && hour < 18) {
        return "Selamat Sore";
    } else {
        return "Selamat Malam";
    }
}

const getFormattedDateTime = (date) => {
    return new Date(date).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const getFormattedDate = (date) => {
    return new Date(date).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}
const getFormmatedDateForInputDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
}

module.exports = {
    getGreetingStatus,
    getFormattedDateTime,
    getFormattedDate,
    getFormmatedDateForInputDate
}