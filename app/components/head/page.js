'use client';

import Register from '../register/page';
import Passwords from '../passwords/page';


import { useSession, signOut } from "next-auth/react"

export default function Head() {
    const { data: session, status, update } = useSession()

    if (status === 'loading'){
        return <h1>Loading...</h1>
    }
    if (status === 'unauthenticated') {
        // User is not signed in
        return (
            <Register />
        );
    }
    if (status === 'authenticated') {
        // User is signed in
        return (
            <Passwords />
        );
    }
}