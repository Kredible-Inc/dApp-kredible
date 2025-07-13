import { db } from "@/shared/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { User } from "@/shared/types/user.types";

export class UserService {
  private static COLLECTION_NAME = "users";

  // Obtener usuario por wallet address
  static async getUserByWalletAddress(
    walletAddress: string
  ): Promise<User | null> {
    try {
      const usersRef = collection(db, this.COLLECTION_NAME);
      const q = query(usersRef, where("walletAddress", "==", walletAddress));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as User;
      }

      return null;
    } catch (error) {
      console.error("Error getting user by wallet address:", error);
      throw error;
    }
  }

  // Obtener usuario por ID
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, this.COLLECTION_NAME, userId));

      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
      }

      return null;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw error;
    }
  }

  // Crear nuevo usuario
  static async createUser(userData: Omit<User, "id">): Promise<User> {
    try {
      const userRef = doc(collection(db, this.COLLECTION_NAME));
      const newUser = {
        ...userData,
        id: userRef.id,
      };

      await setDoc(userRef, userData);
      return newUser as User;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Actualizar usuario
  static async updateUser(
    userId: string,
    updates: Partial<User>
  ): Promise<void> {
    try {
      const userRef = doc(db, this.COLLECTION_NAME, userId);
      await updateDoc(userRef, updates);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Eliminar usuario
  static async deleteUser(userId: string): Promise<void> {
    try {
      const userRef = doc(db, this.COLLECTION_NAME, userId);
      await setDoc(userRef, {
        deleted: true,
        deletedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}
