declare global {
    interface Date {
        getDayOfTheWeekInLocalLanguage(locale?: string): string;
    }
  }

Date.prototype.getDayOfTheWeekInLocalLanguage = function(locale: string = 'pl-PL'): string {
    let daysOfTheWeek: string[];

    switch(locale) {
        case 'pl-PL': {
            daysOfTheWeek = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
            break;
        }
        default: {
            daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            break;
        }
    }
    
    return daysOfTheWeek[this.getDay()]
}

export {};