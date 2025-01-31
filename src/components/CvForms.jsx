import { useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

function CvForm({route, method}) {
    const [cvWriter, setCvWriter] = useState([]);
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [professional_summary, setProfessional_summary] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const[contact_number, setContact_number] = useState('');
    const[interest, setInterest] = useState('');
    const [additional_information, setAdditionalInformation] = useState('');

    const createCv = (e) => {
        e.preventDefault();
        const payload = {
            first_name,
            last_name,
            professional_summary,
            address,
            city,
            country,
            contact_number,
            interest,
            additional_information
        }
        axiosInstance.post("/api/cv_writer/cv/", payload)
        .then((res) => {
            if (res.status === 201) alert("cv created!")
                else alert("Something went wrong");
            
        })
        .catch((error) => {
            if (error.response) {
                console.error(error.response.data);
                alert(JSON.stringify(error.response.data));
            } else {
                console.error(error.message);
                alert(error.message);
            }
        });
        getCvs();
    }

    return <div>
        <form onSubmit={createCv}>
            <label htmlFor="first_name">First Name</label>
            <br />
            <input type="text" id="first_name" onChange={(e) => setFirstName(e.target.value)} />
            <br />
            <label htmlFor="last_name">Last Name</label>
            <br />
            <input type="text" id="last_name" onChange={(e) => setLastName(e.target.value)} />
            <br />
            <label htmlFor="professional_summary">Professional Summary</label>
            <br />
            <textarea name="professional_summary" id="professional_summary" value={professional_summary} onChange={(e) => setProfessional_summary(e.target.value)}></textarea>
            <br />
            <label htmlFor="address">Address</label>
            <br />
            <input type="text" id="address" onChange={(e) => setAddress(e.target.value)} />
            <br />
            <label htmlFor="city">City</label>
            <br />
            <input type="text" id="city" onChange={(e) => setCity(e.target.value)} />
            <br />
            <label htmlFor="country">Country</label>
            <br />
            <input type="text" id="country" onChange={(e) => setCountry(e.target.value)} />
            <br />
            <label htmlFor="contact_number">Contact Number</label>
            <br />
            <input type="text" id="contact_number" onChange={(e) => setContact_number(e.target.value)} />
            <br />
            <label htmlFor="interest">Interest</label>
            <br />
            <input type="text" id="interest" onChange={(e) => setInterest(e.target.value)} />
            <br />
            <label htmlFor="additional_infromation">Additional Information</label>
            <br />
            <textarea name="additional_infromation" id="additional_infromation" value={additional_information} onChange={(e) => setAdditionalInformation(e.target.value)}></textarea>
            <br />
            <button type="submit">Create CV</button>
        </form>
    </div>;
}

export default CvForm;