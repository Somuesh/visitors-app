import React, { createContext, useState } from 'react';
import Whom from './pages/Whom';

export const GlobalContext = createContext()

function App() {
  const [session, setSession] = useState(null)

  const [visitor, setVisitor] = useState({
    name: '',
    mobile: '',
    address: '',
  })

  const [data, setData] = useState(null)


    const signIn = async () => {
        try {
            const response = await fetch('http://localhost:5000/sign_in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: visitor.name, 
                    mobile: visitor.mobile,
                    address: visitor.address,
                }),
            });

            if (!response.ok) {
                throw new Error('Sign-in failed');
            }

            const responsedata = await response.json();
            setData(responsedata)
            setSession(responsedata.access_token)
            console.log(responsedata); // Log the response from the server

            // Optionally, you can update the UI or perform other actions based on the response
        } catch (error) {
            console.error('Error signing in:', error.message);
        }
    };

    return (
        <>
        <GlobalContext.Provider value={[session]}>
        {!data ? <div>
            <h1>Visitor Web App</h1>
            <label htmlFor='name'>Name:</label>
            <input id='name' type='text' onChange={(e)=> setVisitor(prev=> ({...prev, name: e.target.value}))} />
            
            <label htmlFor='mobile'>Mobile:</label>
            <input id='mobile' type='text' onChange={(e)=> setVisitor(prev=> ({...prev, mobile: e.target.value}))} />
            
            <label htmlFor='address'>Address:</label>
            <input id='address' type='text' onChange={(e)=> setVisitor(prev=> ({...prev, address: e.target.value}))} />
            <button onClick={signIn}>Sign In</button>
        </div>
        :
        <Whom />
        }
        </GlobalContext.Provider>
        </>
    );
}

export default App;
