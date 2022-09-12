module.exports = {
    // format_date returns the date in MM/DD/YYYY format
    format_date: date => {
        return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
            date
        ).getFullYear()}`;
    },
    // format_plural: "2 comments", "1 comment"
    format_plural: (word, amount) => {
        if (amount !== 1) {
            return `${amount} ${word}s`;
        }
        return `${amount} ${word}`;
    }
}