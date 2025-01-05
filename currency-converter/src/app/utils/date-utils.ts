//Returns today's date in 'YYYY-MM-DD' format.
export function getToday(): string {
    return new Date().toISOString().split('T')[0];
}

//Returns the date 'daysAgo' days ago in 'YYYY-MM-DD' format.
export function getDateDaysAgo(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
}