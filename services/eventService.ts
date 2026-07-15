import { 
  ref, 
  push, 
  get, 
  set, 
  update, 
  remove, 
  query, 
  orderByChild, 
  equalTo 
} from "firebase/database";
import { db, auth } from "./firebaseConfig";

export const addEvent = async (eventData: any) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const eventsRef = ref(db, "events");
    const newEventRef = push(eventsRef);
    
    await set(newEventRef, {
      ...eventData,
      userId: user.uid, 
      createdAt: new Date().toISOString(),
    });
    return newEventRef.key;
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
};

export const getAllEvents = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    const eventsRef = ref(db, "events");
    const q = query(
      eventsRef, 
      orderByChild("userId"),
      equalTo(user.uid)
    );

    const snapshot = await get(q);
    const events: any[] = [];
    
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        events.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
    }

    // Realtime Database queries only support sorting by one field.
    // So we manually sort by createdAt desc.
    return events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const getEventById = async (id: string) => {
  try {
    const eventRef = ref(db, `events/${id}`);
    const snapshot = await get(eventRef);

    if (snapshot.exists()) {
      return { id: snapshot.key, ...snapshot.val() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching event details:", error);
    throw error;
  }
};

export const updateEvent = async (id: string, updatedData: any) => {
  try {
    const eventRef = ref(db, `events/${id}`);
    await update(eventRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEvent = async (id: string) => {
  try {
    const eventRef = ref(db, `events/${id}`);
    await remove(eventRef);
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export const markAsCompleted = async (id: string) => {
  try {
    const eventRef = ref(db, `events/${id}`);
    await update(eventRef, {
      status: "Completed"
    });
    return true;
  } catch (error) {
    console.error("Error marking as completed:", error);
    throw error;
  }
};