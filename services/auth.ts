import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth, db } from "./firebaseConfig";
import { ref, set } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const register = async (fullName: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(await userCredential.user, {
        displayName: fullName
    })

    console.log("Saving to Database...");

    set(ref(db, `users/${userCredential.user.uid}`), {
        uid: userCredential.user.uid,
        fullname: fullName,
        email: email,
        createdAt: new Date().toISOString()
    });

    console.log("Saved Successfully!");

    return userCredential
}

export const login = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
}

export const logout = async () => {
    await auth.signOut();
    AsyncStorage.clear();
    return;
}