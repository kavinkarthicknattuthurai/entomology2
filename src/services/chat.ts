import { collection, addDoc, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const CHAT_COLLECTION = 'messages';

export const saveMessage = async (message: ChatMessage) => {
  try {
    const docRef = await addDoc(collection(db, CHAT_COLLECTION), {
      text: message.text,
      sender: message.sender,
      timestamp: Timestamp.fromDate(message.timestamp)
    });
    console.log('Message saved with ID:', docRef.id);
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

export const getRecentMessages = async (messageLimit: number = 50): Promise<ChatMessage[]> => {
  try {
    const q = query(
      collection(db, CHAT_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(messageLimit)
    );

    const querySnapshot = await getDocs(q);
    const messages: ChatMessage[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        text: data.text,
        sender: data.sender,
        timestamp: data.timestamp.toDate(),
      });
    });

    return messages.reverse();
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};
