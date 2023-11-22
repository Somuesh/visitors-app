const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const uuid = require('uuid');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

let accessToken = null;
let tokenExpiry = null;

app.post('/sign_in', (req, res) => {
    const data = req.body;

    // Validating data
    if (!data.name || !data.mobile || !data.address) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    // Store visitor information in a table (simulated here with a list)
    const visitorInfo = {
        id: uuid.v4(),
        name: data.name,
        mobile: data.mobile,
        address: data.address,
        sign_in_datetime: new Date().toISOString()
    };

    // Update access token and token expiry
    accessToken = uuid.v4();
    tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    res.json({ message: 'Sign-in successful', access_token: accessToken });
});

app.use('/check_token', (req, res) => {
    // Check if the access token is valid
    if (!accessToken || new Date() > tokenExpiry) {
        return res.status(401).json({ error: 'Invalid access token' });
    }

    res.json({ message: 'Token is valid' });
});


const staffMembers = [
    {
        id: '1',
        name: 'Staff Member 1',
        image: 'url_to_image1',
        email: 'staff1@example.com',
        mobile: '1234567890',
    },
    {
        id: '2',
        name: 'Staff Member 2',
        image: 'url_to_image2',
        email: 'staff2@example.com',
        mobile: '9876543210',
    },
    {
        id: '3',
        name: 'Staff Member 3',
        image: 'url_to_image3',
        email: 'staff3@example.com',
        mobile: '9876443210',
    },
];

app.get('/get_staff_members', (req, res) => {
    res.json( staffMembers );
});

app.post('/confirm_visit', (req, res) => {
    //console.log(req.body)
    const { staff_member_id, visitor_id, reason } = req.body;

    // Store visiting details in the visitor_details model
    const visitingDetails = {
        staff_member_id,
        visitor_id,
        reason,
        state: 'Confirmed',
        visiting_datetime: new Date().toISOString(),
    };

    // Send SMS notification to the staff member (you'll need a real SMS service for this)
    // For demonstration purposes, we'll log a message here
    console.log(`SMS sent to Staff Member ${staff_member_id}: Visit Confirmed`);

    res.json({ message: 'Visit confirmed successfully', visitingDetails });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
