const fetch = require('node-fetch');
let hotelId;

let bookingId;

url = 'https://private-4c2a6-allmyles.apiary-mock.com/hotels';

options = {
    method: 'POST',
    body: {
        cityCode: 'HKG',
        occupancy: 1,
        arrivalDate: '2017-09-29',
        leaveDate: '2017-09-30',
        nationality: 'HU',
        filter: {
            stars: ["2", "4", "5"]
        }
    }
}

fetch(url, options)

.then((res)=>{
    return res.json();
})
.then((res)=>{
    console.log('-------- Search Hotel -------');
    console.log(res);
    hotelId = res.hotelResultSet[0].hotel_id;
    return fetch(`https://private-4c2a6-allmyles.apiary-mock.com/hotels/${hotelId}`, {
        method: 'GET'
    })
})

.then((res) => {
    return res.json();
})

.then((res) => {
    console.log('--------- Hotel Detail ----------');
    // console.log(res);
    console.log(res.hotel_details.rooms);
    bookingId = res.hotel_details.rooms[0].booking_id; // 55_0/85_0
    console.log('bookingId:', bookingId);

    return fetch(`https://private-4c2a6-allmyles.apiary-mock.com/hotels/${hotelId}/rooms/${res.hotel_details.rooms.room_id}`, {
        method: 'GET'
    })
})

.then((res)=>{
    return res.json();
})

.then((res)=> {


    console.log('------- Hotel Room Detail --------');
    console.log(res);

    let options = {
        method: 'POST',
        body: {
            "bookBasket": [bookingId],
            "billingInfo": {
                "address": {
                "addressLine1": "Váci út 13-14",
                "cityName": "Budapest",
                "countryCode": "HU",
                "zipCode": "1234"
                },
                "email": "ccc@gmail.com",
                "name": "Kovacs Gyula",
                "phone": {
                "areaCode": "30",
                "countryCode": "36",
                "phoneNumber": "1234567"
                }
            },
            "contactInfo": {
                "address": {
                "addressLine1": "Váci út 13-14",
                "cityName": "Budapest",
                "countryCode": "HU",
                "zipCode": "1234"
                },
                "email": "bbb@gmail.com",
                "name": "Kovacs Lajos",
                "phone": {
                "areaCode": "30",
                "countryCode": "36",
                "phoneNumber": "1234567"
                }
            },
            "persons": [
                {
                "birthDate": "1974-04-03",
                "email": "aaa@gmail.com",
                "firstName": "Janos",
                "gender": "MALE",
                "lastName": "Kovacs",
                "namePrefix": "Mr",
                "passengerTypeCode":"ADT",
                "baggage": "0",
                "document": {
                    "id": "123456",
                    "type": "Passport",
                    "dateOfExpiry": "2018-11-14",
                    "issueCountry": "RS"
                },
                }
            ],
            "userData": {
                "ip": "89.134.155.92",
                "browser_agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:46.0) Gecko/20100101 Firefox/46.0"
            }
        }
    }

    return fetch(`https://private-4c2a6-allmyles.apiary-mock.com/books`, options)
})

.then((res) => {
    return res.json();
})

.then((res) => {
    console.log('---- Booking ----');
    console.log(res);
})

.then((res)=> {
    return res.json();
})

.then((res) => {
    console.log(res);
})

