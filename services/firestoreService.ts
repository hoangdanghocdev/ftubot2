import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";

// User Preferences
export const saveUserPersona = async (userId: string, personaId: string): Promise<void> => {
  try {
    const userPrefsRef = doc(db, "users", userId, "preferences", "persona");
    await setDoc(userPrefsRef, {
      personaId,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } catch (error) {
    console.error("Error saving user persona:", error);
    throw error;
  }
};

export const getUserPersona = async (userId: string): Promise<string | null> => {
  try {
    const userPrefsRef = doc(db, "users", userId, "preferences", "persona");
    const docSnap = await getDoc(userPrefsRef);
    if (docSnap.exists()) {
      return docSnap.data().personaId || null;
    }
    return null;
  } catch (error) {
    console.error("Error getting user persona:", error);
    return null;
  }
};

// Personal Information for Form Filling
export interface PersonalInfo {
  fullName?: string;
  studentId?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  idNumber?: string;
  [key: string]: any; // Allow custom fields
}

export const savePersonalInfo = async (userId: string, info: PersonalInfo): Promise<void> => {
  try {
    const personalInfoRef = doc(db, "users", userId, "data", "personalInfo");
    await setDoc(personalInfoRef, {
      ...info,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } catch (error) {
    console.error("Error saving personal info:", error);
    throw error;
  }
};

export const getPersonalInfo = async (userId: string): Promise<PersonalInfo | null> => {
  try {
    const personalInfoRef = doc(db, "users", userId, "data", "personalInfo");
    const docSnap = await getDoc(personalInfoRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      delete data.updatedAt;
      return data as PersonalInfo;
    }
    return null;
  } catch (error) {
    console.error("Error getting personal info:", error);
    return null;
  }
};

// Forms
export interface FormField {
  name: string;
  type: string;
  position?: { x: number; y: number; width: number; height: number };
  required: boolean;
  label?: string;
}

export interface FormTemplate {
  id?: string;
  name: string;
  description?: string;
  category?: string;
  fields: FormField[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export const saveFormTemplate = async (form: FormTemplate): Promise<string> => {
  try {
    const formsRef = collection(db, "forms");
    const docRef = await addDoc(formsRef, {
      ...form,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving form template:", error);
    throw error;
  }
};

export const searchForms = async (searchTerm: string): Promise<FormTemplate[]> => {
  try {
    const formsRef = collection(db, "forms");
    const q = query(
      formsRef,
      where("name", ">=", searchTerm),
      where("name", "<=", searchTerm + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as FormTemplate[];
  } catch (error) {
    console.error("Error searching forms:", error);
    // Fallback: get all forms and filter client-side
    try {
      const formsRef = collection(db, "forms");
      const querySnapshot = await getDocs(formsRef);
      const allForms = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as FormTemplate[];
      return allForms.filter(form => 
        form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (fallbackError) {
      console.error("Error in fallback search:", fallbackError);
      return [];
    }
  }
};

export const getFormTemplate = async (formId: string): Promise<FormTemplate | null> => {
  try {
    const formRef = doc(db, "forms", formId);
    const docSnap = await getDoc(formRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as FormTemplate;
    }
    return null;
  } catch (error) {
    console.error("Error getting form template:", error);
    return null;
  }
};

// User Filled Forms
export interface FilledForm {
  id?: string;
  formId: string;
  formName: string;
  filledData: { [key: string]: any };
  filledAt: Timestamp;
  driveFileId?: string;
}

export const saveFilledForm = async (userId: string, filledForm: Omit<FilledForm, 'id' | 'filledAt'>): Promise<string> => {
  try {
    const userFormsRef = collection(db, "userForms", userId, "forms");
    const docRef = await addDoc(userFormsRef, {
      ...filledForm,
      filledAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving filled form:", error);
    throw error;
  }
};

export const getUserFilledForms = async (userId: string): Promise<FilledForm[]> => {
  try {
    const userFormsRef = collection(db, "userForms", userId, "forms");
    const querySnapshot = await getDocs(userFormsRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as FilledForm[];
  } catch (error) {
    console.error("Error getting user filled forms:", error);
    return [];
  }
};



