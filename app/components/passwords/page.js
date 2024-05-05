import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Passwords() {
    const { data: session, status, update } = useSession()

    const [addName, setAddName] = useState('');
    const [addPassword, setAddPassword] = useState('');

    const [confirmationMsg, setConfirmationMsg] = useState('');
    const [confirmationVisible, setConfirmationVisible] = useState(false);

    const [passwords, setPasswords] = useState([]);

    const [showPassword, setShowPassword] = useState(passwords.map(() => false));

    const getPasswords = async () =>{
        axios({
            method: 'get',
            params:{
                user_id: session.user.id
            },
            url: 'http://localhost:3001/getPasswords'
        }).then((res) => {
            setPasswords(res.data);
        }).catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        getPasswords();
    }, []);

    useEffect(() => {
        getPasswords();
    }, [passwords]);

    const add = async () => {
        if (addName === '' || addPassword === '') {
            setConfirmationMsg("Missing fields");
        }
        else {
            setConfirmationMsg("Password added");
            setAddName(''); //clear fields
            setAddPassword('');

            axios({
                method: 'post',
                data:{
                    user_id: session.user.id,
                    password_name: addName,
                    password: addPassword
                },
                url: 'http://localhost:3001/add'
            }).then((res) => {
                getPasswords();
            }).catch((err) => {
                console.log(err);
            })
        }
        setConfirmationVisible(true);
        setTimeout(() => {
            setConfirmationVisible(false);
        }, 2000);
    }

    const deletePassword = async (id) => {
        axios({
            method: 'post',
            data:{
                password_id: id
            },
            url: 'http://localhost:3001/delete'
        }).then((res) => {
            getPasswords();
        }).catch((err) => {
            console.log(err);
        })
    }

    const toggleShowPassword = (index) => {
        console.log(index);
        let newShowPassword = showPassword;
        newShowPassword[index] = !newShowPassword[index];
        setShowPassword(newShowPassword);
    }

    return (
        <div>
            <h1>Welcome {session.user.username}</h1>
            <button onClick={() => signOut()}>Sign out</button>
            <br></br>
            <input
                type="text"
                value={addName}
                placeholder="Enter name of password"
                onChange={e => setAddName(e.target.value)}>
            </input>
            <input
                type="text"
                value ={addPassword}
                placeholder="Enter password"
                onChange={e => setAddPassword(e.target.value)}>
            </input>
            <button onClick={add}>Add</button>
            {confirmationVisible && <p>{confirmationMsg}</p>}
            <ul>
                {passwords.map((password) => (
                    <div>
                        <li key={password.id}>{password.password_name} : {
                            showPassword[passwords.indexOf(password)] ? password.password : '*'.repeat(password.password.length)
                        }</li>
                        <button onClick={() => deletePassword(password.id)}>Delete</button>
                        <button onClick={() => toggleShowPassword(passwords.indexOf(password))}>
                            {showPassword[passwords.indexOf(password)] ? 'Hide' : 'Show'}
                        </button>
                    </div>
                ))}
            </ul>
        </div>
    );
}