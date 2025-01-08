import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
} from "@ionic/react";
import { useState } from "react";
import "./Tab1.scss";
import axios from "axios";
import { useDispatch } from "react-redux";
import config from "../config.json";

const POST_USER_REQUEST = "POST_USER_REQUEST";
const POST_USER_SUCCESS = "POST_USER_SUCCESS";
const POST_USER_FAILURE = "POST_USER_FAILURE";
const postUser: any =
  (formData: { email: string; password: string }) => async (dispatch: any) => {
    dispatch({ type: POST_USER_REQUEST });

    try {
      const response = await axios.post(
        `${config.API_BASE_URL}user`,
        formData,
        {
          withCredentials: true, // Include credentials with the request
        }
      );
      dispatch({
        type: POST_USER_SUCCESS,
        payload: response.data,
      });
    } catch (error: any) {
      dispatch({
        type: POST_USER_FAILURE,
        payload: error.message || "Something went wrong",
      });
    }
  };

const Tab1: React.FC = () => {
  // Initialize state as an object with email and password properties
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch(); // Access Redux dispatch

  const handleInputChange = (e: CustomEvent, name: string) => {
    setFormData((prevState) => ({
      ...prevState, // Copy previous state
      [name]: e.detail.value, // Update the specific field (email or password)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email Submitted: ", formData.email);
    console.log("Password Submitted: ", formData.password);
    dispatch(postUser(formData));
    // Add form submission logic here
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <form className="ion-padding" onSubmit={handleSubmit}>
          <IonInput
            labelPlacement="floating"
            fill="solid"
            type="email"
            name="email" // Set the input name for email
            value={formData.email} // Bind email state to the input
            onIonInput={(e) => handleInputChange(e, "email")}
          >
            <div slot="label">Email</div> {/* Correct label placement */}
          </IonInput>
          <IonInput
            labelPlacement="floating"
            fill="solid"
            type="password"
            name="password" // Set the input name for password
            value={formData.password} // Bind password state to the input
            onIonInput={(e) => handleInputChange(e, "password")}
          >
            <div slot="label">Contraseña</div> {/* Correct label placement */}
          </IonInput>
          <IonButton type="submit">Sortu</IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
