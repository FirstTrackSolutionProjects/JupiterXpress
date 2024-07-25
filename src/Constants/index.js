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
        isDropdown : false,
        merchantOnly : true,
        menuID : [5],
        dropDownOptions : [{}]
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
            name : "Unshipped Shipments",
            isDropdown : false,
            menuID : [9,3],
            dropDownOptions : [{}]
        },
        {
            icon : "logo.webp",
            name : "Shipment Reports",
            isDropdown : false,
            menuID : [9,4],
            dropDownOptions : [{}]
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