export let onlineSemesterStubForDates = (today: Date) => {
  let tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const daysInPolish = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];

  return {
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
          "timetableId": 61454,
          "type": "normal",
          "title": `${daysInPolish[today.getDay()]}`,
          "description": "15:00-16:35",
          "dayOfTheWeek": `${daysInPolish[today.getDay()]}`,
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
          "timetableId": 61454,
          "type": "normal",
          "title": `${daysInPolish[tomorrow.getDay()]}`,
          "description": "15:00-16:35",
          "dayOfTheWeek": `${daysInPolish[tomorrow.getDay()]}`,
          "availablePlacesNo": 2,
          "availablePlaces": "Wolnych miejsc: 2",
          "price": "1 536,00 zł",
          "oneTimePaymentPrice": "1 436,00 zł",
          "lessonCount": 18,
          "lessonStartHour": 15,
          "startDate": `${tomorrow.toLocaleDateString()}`,
          "endDate": "08.02.2024",
          "startDateDateTimeFormat": `${tomorrow}`
        }
      ],
      "cityType": "MainCity"
    },
    "otherLocalisations": [],
    "otherCourses": []
  }
}