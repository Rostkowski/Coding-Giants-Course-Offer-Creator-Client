import '../../../../extensionMethods/getDayOfTheWeek';

const today = new Date();

export const PTG1Dates = {
    "courseId": 270,
    "localisation": {
        "localisationId": 1216,
        "address": {
            "street": "",
            "city": "Online",
            "postalCode": " "
        },
        "dates": [
            {
                "timetableId": 12345,
                "type": "normal",
                "title": `${today.getDayOfTheWeekInLocalLanguage('pl-PL')}`,
                "description": "15:00-16:35",
                "dayOfTheWeek": `${today.getDayOfTheWeekInLocalLanguage('pl-PL')}`,
                "availablePlacesNo": 2,
                "availablePlaces": "Wolnych miejsc: 2",
                "price": "1 536,00 zł",
                "oneTimePaymentPrice": "1 436,00 zł",
                "lessonCount": 18,
                "lessonStartHour": 15,
                "startDate": `${today.toLocaleDateString()}`,
                "endDate": "08.02.2024",
                "startDateDateTimeFormat": `${today}`
            },
            {
                "timetableId": 12346,
                "type": "normal",
                "title": `${today.getDayOfTheWeekInLocalLanguage('pl-PL')}`,
                "description": "18:00-20:35",
                "dayOfTheWeek": `${today.getDayOfTheWeekInLocalLanguage('pl-PL')}`,
                "availablePlacesNo": 2,
                "availablePlaces": "Wolnych miejsc: 2",
                "price": "1 536,00 zł",
                "oneTimePaymentPrice": "1 436,00 zł",
                "lessonCount": 18,
                "lessonStartHour": 15,
                "startDate": `${today.toLocaleDateString()}`,
                "endDate": "08.02.2024",
                "startDateDateTimeFormat": `${today}`
            }
        ],
        "cityType": "MainCity"
    },
    "otherLocalisations": [],
    "otherCourses": []
}