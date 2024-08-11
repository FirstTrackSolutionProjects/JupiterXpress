export const navItems = [
    {
        name : 'Home',
        url : '/'
    },
    {
        name : 'Tracking',
        url : '/tracking',
    },
    {
        name : 'Pricing',
        isDropdown : true,
        options : [{
            name : 'Domestic',
            url : '/domestic',
        },{
            name : 'International',
            url : '/international',
        }]
    },
    {
        name : 'Blogs',
        url : '/get-blogs'
    },
    {
        name : 'About',
        url : '/about-us'
    },
    {
        name : 'Contact',
        url : '/contact-send'
    }
]

export const menuItems = [
    {
        icon : "logo.webp",
        name : "Dashboard",
        isDropdown : false,
        menuID : [0],
        dropDownOptions : [{}]
    },
    {
        icon : "logo.webp",
        name : "Wallet Recharge",
        isDropdown : false,
        menuID : [8],
        dropDownOptions : [{}]
    },
    {
        icon : "logo.webp",
        name : "KYC Update",
        isDropdown : false,
        merchantOnly : true,
        menuID : [13],
        dropDownOptions : [{}]
    },
    {
        icon : "logo.webp",
        name : "Create Shipment",
        isDropdown : true,
        merchantOnly : true,
        menuID : [1],
        dropDownOptions : [{
            icon : "logo.webp",
            name : "Domestic",
            isDropdown : false,
            menuID : [1,0],
            dropDownOptions : [{}]
        },{
            icon : "logo.webp",
            name : "International",
            isDropdown : false,
            menuID : [1,1],
            dropDownOptions : [{}]
        },]
    },
    {
        icon : "logo.webp",
        name : "Warehouse",
        isDropdown : false,
        merchantOnly : true,
        menuID : [2],
        dropDownOptions : [{}]
    },
    {
        icon : "logo.webp",
        name : "Parcels",
        isDropdown : true,
        merchantOnly : true,
        menuID : [3],
        dropDownOptions : [{
            icon : "logo.webp",
            name : "Domestic",
            isDropdown : false,
            menuID : [3,0],
            dropDownOptions : [{}]
        },
        {
            icon : "logo.webp",
            name : "International",
            isDropdown : false,
            menuID : [3,1],
            dropDownOptions : [{}]
        },]
    },
    {
        icon : "logo.webp",
        name : "Transaction History",
        isDropdown : false,
        menuID : [4],
        dropDownOptions : [{}]
    },
    {
        icon : "logo.webp",
        name : "Reports",
        isDropdown : true,
        merchantOnly : true,
        menuID : [5],
        dropDownOptions : [{
            icon : "logo.webp",
            name : "Domestic Reports",
            isDropdown : false,
            menuID : [5,0],
            dropDownOptions : [{}]
        },{
            icon : "logo.webp",
            name : "International Reports",
            isDropdown : false,
            menuID : [5,1],
            dropDownOptions : [{}]
        },]
    },
    {
        icon : "logo.webp",
        name : "Merchant Manage",
        isDropdown : true,
        admin : true,
        menuID : [9],
        dropDownOptions : [{
            icon : "logo.webp",
            name : "Verified Merchants",
            isDropdown : false,
            menuID : [9,0],
            dropDownOptions : [{}]
        },
        {
            icon : "logo.webp",
            name : "Non-Verified Merchants",
            isDropdown : false,
            menuID : [9,1],
            dropDownOptions : [{}]
        },
        {
            icon : "logo.webp",
            name : "Merchant Transactions",
            isDropdown : false,
            menuID : [9,2],
            dropDownOptions : [{}]
        },
        {
            icon : "logo.webp",
            name : "Shipments",
            isDropdown : true,
            menuID : [9,3],
            dropDownOptions : [{
                icon : "logo.webp",
                name : "Domestic",
                isDropdown : false,
                menuID : [9,3,0],
                dropDownOptions : [{}]
            },{
                icon : "logo.webp",
                name : "International",
                isDropdown : false,
                menuID : [9,3,1],
                dropDownOptions : [{}]
            },]
        },
        {
            icon : "logo.webp",
            name : "Shipment Reports",
            isDropdown : true,
            menuID : [9,4],
            dropDownOptions : [{
                icon : "logo.webp",
                name : "Domestic Reports",
                isDropdown : false,
                menuID : [9,4,0],
                dropDownOptions : [{}]
            },{
                icon : "logo.webp",
                name : "International Reports",
                isDropdown : false,
                menuID : [9,4,1],
                dropDownOptions : [{}]
            },]
        }]
    },
    // {
    //     icon : "logo.webp",
    //     name : "Users",
    //     admin : true,
    //     isDropdown : true,
    //     menuID : [10],
    //     dropDownOptions : [{
    //         icon : "logo.webp",
    //         name : "Accounts",
    //         isDropdown : false,
    //         menuID : [10,0],
    //         dropDownOptions : [{}]
    //     },{
    //         icon : "logo.webp",
    //         name : "Admin",
    //         isDropdown : false,
    //         menuID : [10,1],
    //         dropDownOptions : [{}]
    //     },]
    // },
    {
        icon : "logo.webp",
        name : "Submission",
        isDropdown : true,
        admin : true,
        // menuID : [11],
        dropDownOptions : [{
            icon : "logo.webp",
            name : "Merchant Verification",
            isDropdown : false,
            admin : true,
            menuID : [11,0],
            dropDownOptions : [{}]
        },
        {
            icon : "logo.webp",
            name : "Contact Submission",
            isDropdown : false,
            admin : true,
            menuID : [11,1],
            dropDownOptions : [{}]
        },
        {
            icon : "logo.webp",
            name : "KYC Requests",
            isDropdown : false,
            admin : true,
            menuID : [11,2],
            dropDownOptions : [{}]
        }
    ]
    },
    {
        icon : "logo.webp",
        name : "Manual Recharge",
        isDropdown : false,
        admin : true,
        menuID : [12],
        dropDownOptions : [{}]
    },
    {
        icon : "logo.webp",
        name : "Settings",
        isDropdown : true,
        dropDownOptions : [
            {
                icon : "logo.webp",
                name : "Profile",
                isDropdown : false,
                menuID : [6,0],
                dropDownOptions : [{}]
            },
            {
                icon : "logo.webp",
                name : "Change Password",
                isDropdown : false,
                menuID : [6,1],
                dropDownOptions : [{}]
            },
        ]
    },
    {
        icon : "logo.webp",
        name : "Logout",
        isDropdown : false,
        menuID : [7],
        dropDownOptions : [{}]
    },



]

export const IndianStateInfo = {
    "Andaman & Nicobar" :{
        "id": 4023,
        "name": "Andaman and Nicobar Islands",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "AN",
        "type": "Union territory",
        "latitude": "11.74008670",
        "longitude": "92.65864010"
    },
     "Andhra Pradesh" : {
        "id": 4017,
        "name": "Andhra Pradesh",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "AP",
        "type": "state",
        "latitude": "15.91289980",
        "longitude": "79.73998750"
    },
    "Arunachal Pradesh": {
        "id": 4024,
        "name": "Arunachal Pradesh",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "AR",
        "type": "state",
        "latitude": "28.21799940",
        "longitude": "94.72775280"
    },
    "Assam" : {
        "id": 4027,
        "name": "Assam",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "AS",
        "type": "state",
        "latitude": "26.20060430",
        "longitude": "92.93757390"
    },
    "Bihar" : {
        "id": 4037,
        "name": "Bihar",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "BR",
        "type": "state",
        "latitude": "25.09607420",
        "longitude": "85.31311940"
    },
    "Chandigarh" : {
        "id": 4031,
        "name": "Chandigarh",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "CH",
        "type": "Union territory",
        "latitude": "30.73331480",
        "longitude": "76.77941790"
    },
    "Chhattisgarh" : {
        "id": 4040,
        "name": "Chhattisgarh",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "CT",
        "type": "state",
        "latitude": "21.27865670",
        "longitude": "81.86614420"
    },
    "Dadra & Nagar Haveli" : {
        "id": 4033,
        "name": "Dadra and Nagar Haveli and Daman and Diu",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "DH",
        "type": "Union territory",
        "latitude": "20.39737360",
        "longitude": "72.83279910"
    },
    "Daman & Diu" : {
        "id": 4033,
        "name": "Dadra and Nagar Haveli and Daman and Diu",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "DH",
        "type": "Union territory",
        "latitude": "20.39737360",
        "longitude": "72.83279910"
    },
    "Delhi" : {
        "id": 4021,
        "name": "Delhi",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "DL",
        "type": "Union territory",
        "latitude": "28.70405920",
        "longitude": "77.10249020"
    },
    "Goa" : {
        "id": 4009,
        "name": "Goa",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "GA",
        "type": "state",
        "latitude": "15.29932650",
        "longitude": "74.12399600"
    },
    "Gujarat" : {
        "id": 4030,
        "name": "Gujarat",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "GJ",
        "type": "state",
        "latitude": "22.25865200",
        "longitude": "71.19238050"
    },
    "Haryana" : {
        "id": 4007,
        "name": "Haryana",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "HR",
        "type": "state",
        "latitude": "29.05877570",
        "longitude": "76.08560100"
    },
    "Himachal Pradesh" : {
        "id": 4020,
        "name": "Himachal Pradesh",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "HP",
        "type": "state",
        "latitude": "31.10482940",
        "longitude": "77.17339010"
    },
    "Jammu & Kashmir" : {
        "id": 4029,
        "name": "Jammu and Kashmir",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "JK",
        "type": "Union territory",
        "latitude": "33.27783900",
        "longitude": "75.34121790"
    },
    "Jharkhand" : {
        "id": 4025,
        "name": "Jharkhand",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "JH",
        "type": "state",
        "latitude": "23.61018080",
        "longitude": "85.27993540"
    },
    "Karnataka" : {
        "id": 4026,
        "name": "Karnataka",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "KA",
        "type": "state",
        "latitude": "15.31727750",
        "longitude": "75.71388840"
    },
    "Kerala" : {
        "id": 4028,
        "name": "Kerala",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "KL",
        "type": "state",
        "latitude": "10.85051590",
        "longitude": "76.27108330"
    },
    "Ladakh" : {
        "id": 4852,
        "name": "Ladakh",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "LA",
        "type": "Union territory",
        "latitude": "34.22684750",
        "longitude": "77.56194190"
    },
    "Lakshadweep" : {
        "id": 4019,
        "name": "Lakshadweep",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "LD",
        "type": "Union territory",
        "latitude": "10.32802650",
        "longitude": "72.78463360"
    },
    "Madhya Pradesh" : {
        "id": 4039,
        "name": "Madhya Pradesh",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "MP",
        "type": "state",
        "latitude": "22.97342290",
        "longitude": "78.65689420"
    },
    "Maharashtra" : {
        "id": 4008,
        "name": "Maharashtra",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "MH",
        "type": "state",
        "latitude": "19.75147980",
        "longitude": "75.71388840"
    },
    "Manipur" : {
        "id": 4010,
        "name": "Manipur",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "MN",
        "type": "state",
        "latitude": "24.66371730",
        "longitude": "93.90626880"
    },
    "Meghalaya" : {
        "id": 4006,
        "name": "Meghalaya",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "ML",
        "type": "state",
        "latitude": "25.46703080",
        "longitude": "91.36621600"
    },
    "Mizoram" : {
        "id": 4036,
        "name": "Mizoram",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "MZ",
        "type": "state",
        "latitude": "23.16454300",
        "longitude": "92.93757390"
    },
    "Nagaland" : {
        "id": 4018,
        "name": "Nagaland",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "NL",
        "type": "state",
        "latitude": "26.15843540",
        "longitude": "94.56244260"
    },
    "Odisha" : {
        "id": 4013,
        "name": "Odisha",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "OR",
        "type": "state",
        "latitude": "20.95166580",
        "longitude": "85.09852360"
    },
    "Puducherry" : {
        "id": 4011,
        "name": "Puducherry",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "PY",
        "type": "Union territory",
        "latitude": "11.94159150",
        "longitude": "79.80831330"
    },
    "Punjab" : {
        "id": 4015,
        "name": "Punjab",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "PB",
        "type": "state",
        "latitude": "31.14713050",
        "longitude": "75.34121790"
    },
    "Rajasthan" : {
        "id": 4014,
        "name": "Rajasthan",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "RJ",
        "type": "state",
        "latitude": "27.02380360",
        "longitude": "74.21793260"
    },
    "Sikkim" : {
        "id": 4034,
        "name": "Sikkim",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "SK",
        "type": "state",
        "latitude": "27.53297180",
        "longitude": "88.51221780"
    },
    "Tamil Nadu" : {
        "id": 4035,
        "name": "Tamil Nadu",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "TN",
        "type": "state",
        "latitude": "11.12712250",
        "longitude": "78.65689420"
    },
    "Telangana" : {
        "id": 4012,
        "name": "Telangana",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "TG",
        "type": "state",
        "latitude": "18.11243720",
        "longitude": "79.01929970"
    },
    "Tripura" : {
        "id": 4038,
        "name": "Tripura",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "TR",
        "type": "state",
        "latitude": "23.94084820",
        "longitude": "91.98815270"
    },
    "Uttar Pradesh" : {
        "id": 4022,
        "name": "Uttar Pradesh",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "UP",
        "type": "state",
        "latitude": "26.84670880",
        "longitude": "80.94615920"
    },
    "Uttarakhand" : {
        "id": 4016,
        "name": "Uttarakhand",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "UK",
        "type": "state",
        "latitude": "30.06675300",
        "longitude": "79.01929970"
    },
    "West Bengal" : {
        "id": 4853,
        "name": "West Bengal",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "state_code": "WB",
        "type": "state",
        "latitude": "22.98675690",
        "longitude": "87.85497550"
    }
}