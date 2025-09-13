import DashboardMain from "../Components/DashboardMain"
import CreateOrder from "../Components/CreateOrder"
import Warehouse from "../Components/Warehouse"
import TransactionHistory from "../Components/TransactionHistory"
import UpdateOrder from "../Components/UpdateOrder"
import NDR from "../Components/NDR"
import Profile from "../Components/Profile"
import ChangePassword from "../Components/ChangePassword"
import MerchantManage from "../Components/MerchantManage"
import ManualRecharge from "../Components/ManualRecharge"
import VerificationRequests from "../Components/VerificationRequests"
import ContactSubmissions from "../Components/ContactSubmissions"
import CreateOrderInternational from "../Components/CreateOrderInternational"
import NonVerifiedMerchantManage from "../Components/NonVerifiedMerchantManage"
import AllTransactions from "../Components/AllTransactions"
import AllParcels from "../Components/AllParcels"
import AllShipmentReports from "../Components/AllShipmentReports"
import UpdateOrderInternational from "../Components/UpdateOrderInternational"
// import KYCVerification from "../Components/KYCVerification"
// import KYCRequests from "../Components/KYCRequests"
import AllInternationalShipmentReports from "../Components/AllInternationalShipmentReports"
import InternationalReports from "../Components/InternationalReports"
import WeightDisputes from "../Components/WeightDisputes"
import PendingCancellations from "../Components/PendingCancellations/PendingCancellations"
import PendingRefunds from "../Components/PendingRefunds/PendingRefunds"
import UpdateProfileRequest from '../Components/UpdateProfileRequest';
import UpdateProfileRequestSubmissions from '../Components/UpdateProfileRequestSubmissions';
import CodRemittanceAdmin from "../Components/CodRemittance/CodRemittanceAdmin"
import CodRemittanceMerchant from "../Components/CodRemittance/CodRemittanceMerchant"

export const navItems = [
    {
        name : 'Home',
        url : '/'
    },
    {
        name : 'Tracking',
        url : '/tracking'
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
        name : 'International',
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
        icon : "/logo.webp",
        name : "Dashboard",
        isDropdown : false,
        url : '',
        component : DashboardMain,
        dropDownOptions : [{}]
    },
    // {
    //     icon : "/logo.webp",
    //     name : "Wallet Recharge",
    //     isDropdown : false,
    //     url : 'wallet-recharge',
    //     dropDownOptions : [{}]
    // },
    // {
    //     icon : "/logo.webp",
    //     name : "KYC Update",
    //     isDropdown : false,
    //     merchantOnly : true,
    //     url : 'kyc-update',
    //     component : KYCVerification,
    //     dropDownOptions : [{}]
    // },
    {
        icon : "/logo.webp",
        name : "Create Shipment",
        isDropdown : true,
        merchantOnly : true,
        url : 'order/create',
        dropDownOptions : [{
            icon : "/logo.webp",
            name : "Domestic",
            isDropdown : false,
            url : 'order/domestic/create',
            component : CreateOrder,
            dropDownOptions : [{}]
        },{
            icon : "/logo.webp",
            name : "International",
            isDropdown : false,
            url : 'order/international/create',
            component : CreateOrderInternational,
            dropDownOptions : [{}]
        },]
    },
    {
        icon : "/logo.webp",
        name : "Warehouse",
        isDropdown : false,
        merchantOnly : true,
        url : 'warehouse',
        component : Warehouse,
        dropDownOptions : [{}]
    },
    {
        icon : "/logo.webp",
        name : "Parcels",
        isDropdown : true,
        merchantOnly : true,
        url : 'parcels',
        dropDownOptions : [{
            icon : "/logo.webp",
            name : "Domestic",
            isDropdown : false,
            url : 'parcels/domestic',
            component : UpdateOrder,
            dropDownOptions : [{}]
        },
        {
            icon : "/logo.webp",
            name : "International",
            isDropdown : false,
            url : 'parcels/international',
            component : UpdateOrderInternational,
            dropDownOptions : [{}]
        },]
    },
    {
        icon : "/logo.webp",
        name : "Transaction History",
        isDropdown : false,
        url : 'transaction-history',
        component : TransactionHistory,
        dropDownOptions : [{}],
        merchantOnly : true
    },
    {
        icon : "/logo.webp",
        name : "Merchant Transactions",
        isDropdown : false,
        admin : true,
        url : 'manage/merchant/transactions',
        component : AllTransactions,
        dropDownOptions : [{}]
    },
    {
        icon : "/logo.webp",
        name : "Weight Disputes",
        isDropdown : false,
        url : 'weight-disputes',
        component : WeightDisputes,
        dropDownOptions : [{}]
    },
    {
        icon : "/logo.webp",
        name : "COD Remittance",
        isDropdown : false,
        admin : true,
        url : 'cod-remittance-manage',
        component : CodRemittanceAdmin,
        dropDownOptions : [{}]
    },
    {
        icon : "/logo.webp",
        name : "COD Remittance",
        isDropdown : false,
        merchantOnly : true,
        url : 'cod-remittance-history',
        component : CodRemittanceMerchant,
        dropDownOptions : [{}]
    },
    {
        icon : "/logo.webp",
        name : "Cancellations/Refunds",
        isDropdown : true,
        admin : true,
        // url : 'cancellations-refunds',
        // component : DashboardMain,
        dropDownOptions : [
            {
                icon : "/logo.webp",
                name : "Pending Cancellations",
                isDropdown : false,
                url : 'pending-cancellations',
                component : PendingCancellations,
                dropDownOptions : [{}]
            },
            {
                icon : "/logo.webp",
                name : "Pending Refunds",
                isDropdown : false,
                url : 'pending-refunds',
                component : PendingRefunds,
                dropDownOptions : [{}]
            }
        ]
    },
    {
        icon : "/logo.webp",
        name : "Reports",
        isDropdown : true,
        merchantOnly : true,
        url : 'shipment/reports',
        dropDownOptions : [{
            icon : "/logo.webp",
            name : "Domestic Reports",
            isDropdown : false,
            url : 'shipment/domestic/reports',
            component : NDR,
            dropDownOptions : [{}]
        },{
            icon : "/logo.webp",
            name : "International Reports",
            isDropdown : false,
            url : 'shipment/international/reports',
            component : InternationalReports,
            dropDownOptions : [{}]
        },]
    },
    {
        icon : "/logo.webp",
        name : "Merchant Manage",
        isDropdown : true,
        admin : true,
        url : 'manage/merchant',
        dropDownOptions : [{
            icon : "/logo.webp",
            name : "Verified Merchants",
            isDropdown : false,
            url : 'manage/merchant/verified',
            component : MerchantManage,
            dropDownOptions : [{}]
        },
        {
            icon : "/logo.webp",
            name : "Non-Verified Merchants",
            isDropdown : false,
            url : 'manage/merchant/non-verified',
            component : NonVerifiedMerchantManage,
            dropDownOptions : [{}]
        },
        {
            icon : "/logo.webp",
            name : "Shipments",
            isDropdown : true,
            url : 'manage/merchant/shipments',
            dropDownOptions : [{
                icon : "/logo.webp",
                name : "Domestic",
                isDropdown : false,
                url : 'manage/merchant/shipments/domestic',
                component : AllParcels,
                dropDownOptions : [{}]
            },{
                icon : "/logo.webp",
                name : "International",
                isDropdown : false,
                url : 'manage/merchant/shipments/international',
                component : AllInternationalShipmentReports,
                dropDownOptions : [{}]
            },]
        },
        {
            icon : "/logo.webp",
            name : "Shipment Reports",
            isDropdown : true,
            dropDownOptions : [{
                icon : "/logo.webp",
                name : "Domestic Reports",
                isDropdown : false,
                url : 'manage/merchant/shipments/domestic/reports',
                component : AllShipmentReports,
                dropDownOptions : [{}]
            },{
                icon : "/logo.webp",
                name : "International Reports",
                isDropdown : false,
                url : 'manage/merchant/shipments/international/reports',
                component : InternationalReports,
                dropDownOptions : [{}]
            },]
        }]
    },
    // {
    //     icon : "/logo.webp",
    //     name : "Users",
    //     admin : true,
    //     isDropdown : true,
    //     menuID : [10],
    //     dropDownOptions : [{
    //         icon : "/logo.webp",
    //         name : "Accounts",
    //         isDropdown : false,
    //         menuID : [10,0],
    //         dropDownOptions : [{}]
    //     },{
    //         icon : "/logo.webp",
    //         name : "Admin",
    //         isDropdown : false,
    //         menuID : [10,1],
    //         dropDownOptions : [{}]
    //     },]
    // },
    {
        icon : "/logo.webp",
        name : "Submission",
        isDropdown : true,
        admin : true,
        url : 'submissions',
        dropDownOptions : [{
            icon : "/logo.webp",
            name : "Merchant Verification",
            isDropdown : false,
            admin : true,
            url : 'submissions/merchant-verification',
            component : VerificationRequests,
            dropDownOptions : [{}]
        },
        {
            icon : "/logo.webp",
            name : "Update Profile Requests",
            isDropdown : false,
            admin : true,
            url : 'submissions/merchant-update-profile-requests',
            component : UpdateProfileRequestSubmissions,
            dropDownOptions : [{}]
        },
        {
            icon : "/logo.webp",
            name : "Contact Submission",
            isDropdown : false,
            admin : true,
            url : 'submissions/contact-submission',
            component : ContactSubmissions,
            dropDownOptions : [{}]
        },
        // {
        //     icon : "/logo.webp",
        //     name : "KYC Requests",
        //     isDropdown : false,
        //     admin : true,
        //     url : 'submissions/kyc-requests',
        //     component : KYCRequests,
        //     dropDownOptions : [{}]
        // }
    ]
    },
    {
        icon : "/logo.webp",
        name : "Manual Recharge",
        isDropdown : false,
        admin : true,
        url : 'manual-recharge',
        component : ManualRecharge,
        dropDownOptions : [{}]
    },
    {
        icon : "/logo.webp",
        name : "Settings",
        isDropdown : true,
        url : 'settings',
        dropDownOptions : [
            {
                icon : "/logo.webp",
                name : "Profile",
                isDropdown : false,
                url : 'settings/profile',
                component : Profile,
                dropDownOptions : [{}]
            },
            {
                icon : "/logo.webp",
                name : "Profile Update",
                isDropdown : false,
                url : 'settings/profile-update-request',
                component : UpdateProfileRequest,
                merchantOnly : true,
                dropDownOptions : [{}]
            },
            {
                icon : "/logo.webp",
                name : "Change Password",
                isDropdown : false,
                url : 'settings/change-password',
                component : ChangePassword,
                dropDownOptions : [{}]
            },
        ]
    },
    {
        icon : "/logo.webp",
        name : "Logout",
        isDropdown : false,
        url : 'logout',
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

export const COUNTRIES = {
    "Afghanistan": { name: "Afghanistan", iso_code2: "AF", iso_code3: "AFG", country_code: "+93" },
    "Albania": { name: "Albania", iso_code2: "AL", iso_code3: "ALB", country_code: "+355" },
    "Algeria": { name: "Algeria", iso_code2: "DZ", iso_code3: "DZA", country_code: "+213" },
    "Andorra": { name: "Andorra", iso_code2: "AD", iso_code3: "AND", country_code: "+376" },
    "Angola": { name: "Angola", iso_code2: "AO", iso_code3: "AGO", country_code: "+244" },
    "Antigua and Barbuda": { name: "Antigua and Barbuda", iso_code2: "AG", iso_code3: "ATG", country_code: "+1268" },
    "Argentina": { name: "Argentina", iso_code2: "AR", iso_code3: "ARG", country_code: "+54" },
    "Armenia": { name: "Armenia", iso_code2: "AM", iso_code3: "ARM", country_code: "+374" },
    "Australia": { name: "Australia", iso_code2: "AU", iso_code3: "AUS", country_code: "+61" },
    "Austria": { name: "Austria", iso_code2: "AT", iso_code3: "AUT", country_code: "+43" },
    "Azerbaijan": { name: "Azerbaijan", iso_code2: "AZ", iso_code3: "AZE", country_code: "+994" },
    "Bahamas": { name: "Bahamas", iso_code2: "BS", iso_code3: "BHS", country_code: "+1242" },
    "Bahrain": { name: "Bahrain", iso_code2: "BH", iso_code3: "BHR", country_code: "+973" },
    "Bangladesh": { name: "Bangladesh", iso_code2: "BD", iso_code3: "BGD", country_code: "+880" },
    "Barbados": { name: "Barbados", iso_code2: "BB", iso_code3: "BRB", country_code: "+1246" },
    "Belarus": { name: "Belarus", iso_code2: "BY", iso_code3: "BLR", country_code: "+375" },
    "Belgium": { name: "Belgium", iso_code2: "BE", iso_code3: "BEL", country_code: "+32" },
    "Belize": { name: "Belize", iso_code2: "BZ", iso_code3: "BLZ", country_code: "+501" },
    "Benin": { name: "Benin", iso_code2: "BJ", iso_code3: "BEN", country_code: "+229" },
    "Bhutan": { name: "Bhutan", iso_code2: "BT", iso_code3: "BTN", country_code: "+975" },
    "Bolivia": { name: "Bolivia (Plurinational State of)", iso_code2: "BO", iso_code3: "BOL", country_code: "+591" },
    "Bosnia and Herzegovina": { name: "Bosnia and Herzegovina", iso_code2: "BA", iso_code3: "BIH", country_code: "+387" },
    "Botswana": { name: "Botswana", iso_code2: "BW", iso_code3: "BWA", country_code: "+267" },
    "Brazil": { name: "Brazil", iso_code2: "BR", iso_code3: "BRA", country_code: "+55" },
    "Brunei": { name: "Brunei Darussalam", iso_code2: "BN", iso_code3: "BRN", country_code: "+673" },
    "Bulgaria": { name: "Bulgaria", iso_code2: "BG", iso_code3: "BGR", country_code: "+359" },
    "Burkina Faso": { name: "Burkina Faso", iso_code2: "BF", iso_code3: "BFA", country_code: "+226" },
    "Burundi": { name: "Burundi", iso_code2: "BI", iso_code3: "BDI", country_code: "+257" },
    "Cabo Verde": { name: "Cabo Verde", iso_code2: "CV", iso_code3: "CPV", country_code: "+238" },
    "Cambodia": { name: "Cambodia", iso_code2: "KH", iso_code3: "KHM", country_code: "+855" },
    "Cameroon": { name: "Cameroon", iso_code2: "CM", iso_code3: "CMR", country_code: "+237" },
    "Canada": { name: "Canada", iso_code2: "CA", iso_code3: "CAN", country_code: "+1" },
    "Central African Republic": { name: "Central African Republic", iso_code2: "CF", iso_code3: "CAF", country_code: "+236" },
    "Chad": { name: "Chad", iso_code2: "TD", iso_code3: "TCD", country_code: "+235" },
    "Chile": { name: "Chile", iso_code2: "CL", iso_code3: "CHL", country_code: "+56" },
    "China": { name: "China", iso_code2: "CN", iso_code3: "CHN", country_code: "+86" },
    "Colombia": { name: "Colombia", iso_code2: "CO", iso_code3: "COL", country_code: "+57" },
    "Comoros": { name: "Comoros", iso_code2: "KM", iso_code3: "COM", country_code: "+269" },
    "Congo (Congo-Brazzaville)": { name: "Congo", iso_code2: "CG", iso_code3: "COG", country_code: "+242" },
    "Costa Rica": { name: "Costa Rica", iso_code2: "CR", iso_code3: "CRI", country_code: "+506" },
    "Cote d'Ivoire": { name: "Côte d'Ivoire", iso_code2: "CI", iso_code3: "CIV", country_code: "+225" },
    "Croatia": { name: "Croatia", iso_code2: "HR", iso_code3: "HRV", country_code: "+385" },
    "Cuba": { name: "Cuba", iso_code2: "CU", iso_code3: "CUB", country_code: "+53" },
    "Cyprus": { name: "Cyprus", iso_code2: "CY", iso_code3: "CYP", country_code: "+357" },
    "Czechia": { name: "Czechia", iso_code2: "CZ", iso_code3: "CZE", country_code: "+420" },
    "Democratic Republic of the Congo": { name: "Congo (Democratic Republic of the)", iso_code2: "CD", iso_code3: "COD", country_code: "+243" },
    "Denmark": { name: "Denmark", iso_code2: "DK", iso_code3: "DNK", country_code: "+45" },
    "Djibouti": { name: "Djibouti", iso_code2: "DJ", iso_code3: "DJI", country_code: "+253" },
    "Dominica": { name: "Dominica", iso_code2: "DM", iso_code3: "DMA", country_code: "+1767" },
    "Dominican Republic": { name: "Dominican Republic", iso_code2: "DO", iso_code3: "DOM", country_code: "+1809" },
    "Ecuador": { name: "Ecuador", iso_code2: "EC", iso_code3: "ECU", country_code: "+593" },
    "Egypt": { name: "Egypt", iso_code2: "EG", iso_code3: "EGY", country_code: "+20" },
    "El Salvador": { name: "El Salvador", iso_code2: "SV", iso_code3: "SLV", country_code: "+503" },
    "Equatorial Guinea": { name: "Equatorial Guinea", iso_code2: "GQ", iso_code3: "GNQ", country_code: "+240" },
    "Eritrea": { name: "Eritrea", iso_code2: "ER", iso_code3: "ERI", country_code: "+291" },
    "Estonia": { name: "Estonia", iso_code2: "EE", iso_code3: "EST", country_code: "+372" },
    "Eswatini": { name: "Eswatini", iso_code2: "SZ", iso_code3: "SWZ", country_code: "+268" },
    "Ethiopia": { name: "Ethiopia", iso_code2: "ET", iso_code3: "ETH", country_code: "+251" },
    "Fiji": { name: "Fiji", iso_code2: "FJ", iso_code3: "FJI", country_code: "+679" },
    "Finland": { name: "Finland", iso_code2: "FI", iso_code3: "FIN", country_code: "+358" },
    "France": { name: "France", iso_code2: "FR", iso_code3: "FRA", country_code: "+33" },
    "Gabon": { name: "Gabon", iso_code2: "GA", iso_code3: "GAB", country_code: "+241" },
    "Gambia": { name: "Gambia", iso_code2: "GM", iso_code3: "GMB", country_code: "+220" },
    "Georgia": { name: "Georgia", iso_code2: "GE", iso_code3: "GEO", country_code: "+995" },
    "Germany": { name: "Germany", iso_code2: "DE", iso_code3: "DEU", country_code: "+49" },
    "Ghana": { name: "Ghana", iso_code2: "GH", iso_code3: "GHA", country_code: "+233" },
    "Greece": { name: "Greece", iso_code2: "GR", iso_code3: "GRC", country_code: "+30" },
    "Grenada": { name: "Grenada", iso_code2: "GD", iso_code3: "GRD", country_code: "+1473" },
    "Guatemala": { name: "Guatemala", iso_code2: "GT", iso_code3: "GTM", country_code: "+502" },
    "Guinea": { name: "Guinea", iso_code2: "GN", iso_code3: "GIN", country_code: "+224" },
    "Guinea-Bissau": { name: "Guinea-Bissau", iso_code2: "GW", iso_code3: "GNB", country_code: "+245" },
    "Guyana": { name: "Guyana", iso_code2: "GY", iso_code3: "GUY", country_code: "+592" },
    "Haiti": { name: "Haiti", iso_code2: "HT", iso_code3: "HTI", country_code: "+509" },
    "Honduras": { name: "Honduras", iso_code2: "HN", iso_code3: "HND", country_code: "+504" },
    "Hungary": { name: "Hungary", iso_code2: "HU", iso_code3: "HUN", country_code: "+36" },
    "Iceland": { name: "Iceland", iso_code2: "IS", iso_code3: "ISL", country_code: "+354" },
    "India": { name: "India", iso_code2: "IN", iso_code3: "IND", country_code: "+91" },
    "Indonesia": { name: "Indonesia", iso_code2: "ID", iso_code3: "IDN", country_code: "+62" },
    "Iran": { name: "Iran (Islamic Republic of)", iso_code2: "IR", iso_code3: "IRN", country_code: "+98" },
    "Iraq": { name: "Iraq", iso_code2: "IQ", iso_code3: "IRQ", country_code: "+964" },
    "Ireland": { name: "Ireland", iso_code2: "IE", iso_code3: "IRL", country_code: "+353" },
    "Israel": { name: "Israel", iso_code2: "IL", iso_code3: "ISR", country_code: "+972" },
    "Italy": { name: "Italy", iso_code2: "IT", iso_code3: "ITA", country_code: "+39" },
    "Jamaica": { name: "Jamaica", iso_code2: "JM", iso_code3: "JAM", country_code: "+1876" },
    "Japan": { name: "Japan", iso_code2: "JP", iso_code3: "JPN", country_code: "+81" },
    "Jordan": { name: "Jordan", iso_code2: "JO", iso_code3: "JOR", country_code: "+962" },
    "Kazakhstan": { name: "Kazakhstan", iso_code2: "KZ", iso_code3: "KAZ", country_code: "+7" },
    "Kenya": { name: "Kenya", iso_code2: "KE", iso_code3: "KEN", country_code: "+254" },
    "Kiribati": { name: "Kiribati", iso_code2: "KI", iso_code3: "KIR", country_code: "+686" },
    "Kuwait": { name: "Kuwait", iso_code2: "KW", iso_code3: "KWT", country_code: "+965" },
    "Kyrgyzstan": { name: "Kyrgyzstan", iso_code2: "KG", iso_code3: "KGZ", country_code: "+996" },
    "Laos": { name: "Lao People's Democratic Republic", iso_code2: "LA", iso_code3: "LAO", country_code: "+856" },
    "Latvia": { name: "Latvia", iso_code2: "LV", iso_code3: "LVA", country_code: "+371" },
    "Lebanon": { name: "Lebanon", iso_code2: "LB", iso_code3: "LBN", country_code: "+961" },
    "Lesotho": { name: "Lesotho", iso_code2: "LS", iso_code3: "LSO", country_code: "+266" },
    "Liberia": { name: "Liberia", iso_code2: "LR", iso_code3: "LBR", country_code: "+231" },
    "Libya": { name: "Libya", iso_code2: "LY", iso_code3: "LBY", country_code: "+218" },
    "Liechtenstein": { name: "Liechtenstein", iso_code2: "LI", iso_code3: "LIE", country_code: "+423" },
    "Lithuania": { name: "Lithuania", iso_code2: "LT", iso_code3: "LTU", country_code: "+370" },
    "Luxembourg": { name: "Luxembourg", iso_code2: "LU", iso_code3: "LUX", country_code: "+352" },
    "Madagascar": { name: "Madagascar", iso_code2: "MG", iso_code3: "MDG", country_code: "+261" },
    "Malawi": { name: "Malawi", iso_code2: "MW", iso_code3: "MWI", country_code: "+265" },
    "Malaysia": { name: "Malaysia", iso_code2: "MY", iso_code3: "MYS", country_code: "+60" },
    "Maldives": { name: "Maldives", iso_code2: "MV", iso_code3: "MDV", country_code: "+960" },
    "Mali": { name: "Mali", iso_code2: "ML", iso_code3: "MLI", country_code: "+223" },
    "Malta": { name: "Malta", iso_code2: "MT", iso_code3: "MLT", country_code: "+356" },
    "Marshall Islands": { name: "Marshall Islands", iso_code2: "MH", iso_code3: "MHL", country_code: "+692" },
    "Mauritania": { name: "Mauritania", iso_code2: "MR", iso_code3: "MRT", country_code: "+222" },
    "Mauritius": { name: "Mauritius", iso_code2: "MU", iso_code3: "MUS", country_code: "+230" },
    "Mexico": { name: "Mexico", iso_code2: "MX", iso_code3: "MEX", country_code: "+52" },
    "Micronesia": { name: "Micronesia (Federated States of)", iso_code2: "FM", iso_code3: "FSM", country_code: "+691" },
    "Moldova": { name: "Moldova (Republic of)", iso_code2: "MD", iso_code3: "MDA", country_code: "+373" },
    "Monaco": { name: "Monaco", iso_code2: "MC", iso_code3: "MCO", country_code: "+377" },
    "Mongolia": { name: "Mongolia", iso_code2: "MN", iso_code3: "MNG", country_code: "+976" },
    "Montenegro": { name: "Montenegro", iso_code2: "ME", iso_code3: "MNE", country_code: "+382" },
    "Morocco": { name: "Morocco", iso_code2: "MA", iso_code3: "MAR", country_code: "+212" },
    "Mozambique": { name: "Mozambique", iso_code2: "MZ", iso_code3: "MOZ", country_code: "+258" },
    "Myanmar": { name: "Myanmar", iso_code2: "MM", iso_code3: "MMR", country_code: "+95" },
    "Namibia": { name: "Namibia", iso_code2: "NA", iso_code3: "NAM", country_code: "+264" },
    "Nauru": { name: "Nauru", iso_code2: "NR", iso_code3: "NRU", country_code: "+674" },
    "Nepal": { name: "Nepal", iso_code2: "NP", iso_code3: "NPL", country_code: "+977" },
    "Netherlands": { name: "Netherlands", iso_code2: "NL", iso_code3: "NLD", country_code: "+31" },
    "New Zealand": { name: "New Zealand", iso_code2: "NZ", iso_code3: "NZL", country_code: "+64" },
    "Nicaragua": { name: "Nicaragua", iso_code2: "NI", iso_code3: "NIC", country_code: "+505" },
    "Niger": { name: "Niger", iso_code2: "NE", iso_code3: "NER", country_code: "+227" },
    "Nigeria": { name: "Nigeria", iso_code2: "NG", iso_code3: "NGA", country_code: "+234" },
    "North Korea": { name: "Korea (Democratic People's Republic of)", iso_code2: "KP", iso_code3: "PRK", country_code: "+850" },
    "North Macedonia": { name: "North Macedonia", iso_code2: "MK", iso_code3: "MKD", country_code: "+389" },
    "Norway": { name: "Norway", iso_code2: "NO", iso_code3: "NOR", country_code: "+47" },
    "Oman": { name: "Oman", iso_code2: "OM", iso_code3: "OMN", country_code: "+968" },
    "Pakistan": { name: "Pakistan", iso_code2: "PK", iso_code3: "PAK", country_code: "+92" },
    "Palau": { name: "Palau", iso_code2: "PW", iso_code3: "PLW", country_code: "+680" },
    "Panama": { name: "Panama", iso_code2: "PA", iso_code3: "PAN", country_code: "+507" },
    "Papua New Guinea": { name: "Papua New Guinea", iso_code2: "PG", iso_code3: "PNG", country_code: "+675" },
    "Paraguay": { name: "Paraguay", iso_code2: "PY", iso_code3: "PRY", country_code: "+595" },
    "Peru": { name: "Peru", iso_code2: "PE", iso_code3: "PER", country_code: "+51" },
    "Philippines": { name: "Philippines", iso_code2: "PH", iso_code3: "PHL", country_code: "+63" },
    "Poland": { name: "Poland", iso_code2: "PL", iso_code3: "POL", country_code: "+48" },
    "Portugal": { name: "Portugal", iso_code2: "PT", iso_code3: "PRT", country_code: "+351" },
    "Qatar": { name: "Qatar", iso_code2: "QA", iso_code3: "QAT", country_code: "+974" },
    "Romania": { name: "Romania", iso_code2: "RO", iso_code3: "ROU", country_code: "+40" },
    "Russia": { name: "Russian Federation", iso_code2: "RU", iso_code3: "RUS", country_code: "+7" },
    "Rwanda": { name: "Rwanda", iso_code2: "RW", iso_code3: "RWA", country_code: "+250" },
    "Saint Kitts and Nevis": { name: "Saint Kitts and Nevis", iso_code2: "KN", iso_code3: "KNA", country_code: "+1869" },
    "Saint Lucia": { name: "Saint Lucia", iso_code2: "LC", iso_code3: "LCA", country_code: "+1758" },
    "Saint Vincent and the Grenadines": { name: "Saint Vincent and the Grenadines", iso_code2: "VC", iso_code3: "VCT", country_code: "+1784" },
    "Samoa": { name: "Samoa", iso_code2: "WS", iso_code3: "WSM", country_code: "+685" },
    "San Marino": { name: "San Marino", iso_code2: "SM", iso_code3: "SMR", country_code: "+378" },
    "Sao Tome and Principe": { name: "Sao Tome and Principe", iso_code2: "ST", iso_code3: "STP", country_code: "+239" },
    "Saudi Arabia": { name: "Saudi Arabia", iso_code2: "SA", iso_code3: "SAU", country_code: "+966" },
    "Senegal": { name: "Senegal", iso_code2: "SN", iso_code3: "SEN", country_code: "+221" },
    "Serbia": { name: "Serbia", iso_code2: "RS", iso_code3: "SRB", country_code: "+381" },
    "Seychelles": { name: "Seychelles", iso_code2: "SC", iso_code3: "SYC", country_code: "+248" },
    "Sierra Leone": { name: "Sierra Leone", iso_code2: "SL", iso_code3: "SLE", country_code: "+232" },
    "Singapore": { name: "Singapore", iso_code2: "SG", iso_code3: "SGP", country_code: "+65" },
    "Slovakia": { name: "Slovakia", iso_code2: "SK", iso_code3: "SVK", country_code: "+421" },
    "Slovenia": { name: "Slovenia", iso_code2: "SI", iso_code3: "SVN", country_code: "+386" },
    "Solomon Islands": { name: "Solomon Islands", iso_code2: "SB", iso_code3: "SLB", country_code: "+677" },
    "Somalia": { name: "Somalia", iso_code2: "SO", iso_code3: "SOM", country_code: "+252" },
    "South Africa": { name: "South Africa", iso_code2: "ZA", iso_code3: "ZAF", country_code: "+27" },
    "South Korea": { name: "Korea (Republic of)", iso_code2: "KR", iso_code3: "KOR", country_code: "+82" },
    "South Sudan": { name: "South Sudan", iso_code2: "SS", iso_code3: "SSD", country_code: "+211" },
    "Spain": { name: "Spain", iso_code2: "ES", iso_code3: "ESP", country_code: "+34" },
    "Sri Lanka": { name: "Sri Lanka", iso_code2: "LK", iso_code3: "LKA", country_code: "+94" },
    "State of Palestine": { name: "State of Palestine", iso_code2: "PS", iso_code3: "PSE", country_code: "+970" },
    "Sudan": { name: "Sudan", iso_code2: "SD", iso_code3: "SDN", country_code: "+249" },
    "Suriname": { name: "Suriname", iso_code2: "SR", iso_code3: "SUR", country_code: "+597" },
    "Sweden": { name: "Sweden", iso_code2: "SE", iso_code3: "SWE", country_code: "+46" },
    "Switzerland": { name: "Switzerland", iso_code2: "CH", iso_code3: "CHE", country_code: "+41" },
    "Syria": { name: "Syrian Arab Republic", iso_code2: "SY", iso_code3: "SYR", country_code: "+963" },
    "Tajikistan": { name: "Tajikistan", iso_code2: "TJ", iso_code3: "TJK", country_code: "+992" },
    "Tanzania": { name: "Tanzania, United Republic of", iso_code2: "TZ", iso_code3: "TZA", country_code: "+255" },
    "Thailand": { name: "Thailand", iso_code2: "TH", iso_code3: "THA", country_code: "+66" },
    "Timor-Leste": { name: "Timor-Leste", iso_code2: "TL", iso_code3: "TLS", country_code: "+670" },
    "Togo": { name: "Togo", iso_code2: "TG", iso_code3: "TGO", country_code: "+228" },
    "Tonga": { name: "Tonga", iso_code2: "TO", iso_code3: "TON", country_code: "+676" },
    "Trinidad and Tobago": { name: "Trinidad and Tobago", iso_code2: "TT", iso_code3: "TTO", country_code: "+1868" },
    "Tunisia": { name: "Tunisia", iso_code2: "TN", iso_code3: "TUN", country_code: "+216" },
    "Turkey": { name: "Türkiye", iso_code2: "TR", iso_code3: "TUR", country_code: "+90" },
    "Turkmenistan": { name: "Turkmenistan", iso_code2: "TM", iso_code3: "TKM", country_code: "+993" },
    "Tuvalu": { name: "Tuvalu", iso_code2: "TV", iso_code3: "TUV", country_code: "+688" },
    "Uganda": { name: "Uganda", iso_code2: "UG", iso_code3: "UGA", country_code: "+256" },
    "Ukraine": { name: "Ukraine", iso_code2: "UA", iso_code3: "UKR", country_code: "+380" },
    "United Arab Emirates": { name: "United Arab Emirates", iso_code2: "AE", iso_code3: "ARE", country_code: "+971" },
    "United Kingdom": { name: "United Kingdom of Great Britain and Northern Ireland", iso_code2: "GB", iso_code3: "GBR", country_code: "+44" },
    "United States": { name: "United States of America", iso_code2: "US", iso_code3: "USA", country_code: "+1" },
    "Uruguay": { name: "Uruguay", iso_code2: "UY", iso_code3: "URY", country_code: "+598" },
    "Uzbekistan": { name: "Uzbekistan", iso_code2: "UZ", iso_code3: "UZB", country_code: "+998" },
    "Vanuatu": { name: "Vanuatu", iso_code2: "VU", iso_code3: "VUT", country_code: "+678" },
    "Venezuela": { name: "Venezuela (Bolivarian Republic of)", iso_code2: "VE", iso_code3: "VEN", country_code: "+58" },
    "Viet Nam": { name: "Viet Nam", iso_code2: "VN", iso_code3: "VNM", country_code: "+84" },
    "Yemen": { name: "Yemen", iso_code2: "YE", iso_code3: "YEM", country_code: "+967" },
    "Zambia": { name: "Zambia", iso_code2: "ZM", iso_code3: "ZMB", country_code: "+260" },
    "Zimbabwe": { name: "Zimbabwe", iso_code2: "ZW", iso_code3: "ZWE", country_code: "+263" },
    "Holy See": { name: "Holy See", iso_code2: "VA", iso_code3: "VAT", country_code: "+379" }
};

