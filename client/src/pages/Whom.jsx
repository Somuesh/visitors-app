import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../App';
import AskDrink from './AskDrink';

function Whom() {
    const [staffMembers, setStaffMembers] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [reason, setReason] = useState('');
    const [forward, setForward] = useState(false)

    const [session] = useContext(GlobalContext)

    useEffect(()=>{
        return async ()=>{
            try {
                const response = await fetch('http://localhost:5000/get_staff_members');
                if (!response.ok) {
                    throw new Error('Failed to fetch staff members');
                }
    
                const data = await response.json();
                // console.log(data)
                setStaffMembers(data);
            } catch (error) {
                console.error('Error fetching staff members:', error.message);
            }   
        }
    },[])


    const handleStaffSelection = (staff) => {
        setSelectedStaff(staff);
    };

    const confirmVisit = async () => {
        
        try {
            if(session && selectedStaff && reason){
                const response = await fetch('http://localhost:5000/confirm_visit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    staff_member_id: selectedStaff,
                    visitor_id: session,
                    reason,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to confirm visit');
            }

            const visitData = await response.json();
            console.log(visitData); // Log the response from the server

            setForward(true)
            }
            
        } catch (error) {
            console.error('Error confirming visit:', error.message);

        }
    };

    return (
        <>
        { !forward ?
        <div>
            <div>
                <h2>Whom to Visit?</h2>
                <div>
                    <label>Enter Name:</label>
                    <select onChange={(e)=>handleStaffSelection(e.target.value)}>
                    <option>Select</option>
                    {staffMembers.map((member)=>{
                        return <option key={member.id} value={member.id}>{member.name}</option>
                    })}
                    </select>
                </div>
                <div>
                    <label>Reason:</label>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>
                <button onClick={confirmVisit}>Confirm</button>
            </div>
        </div>
        :
        <AskDrink />
        }
        </>
    );
}

export default Whom;
